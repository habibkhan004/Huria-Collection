import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { C } from "../theme/colors";
import { FileDown, BarChart3, Package, ChevronDown, ChevronUp } from "lucide-react";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

const PERIODS = [
  { value: "daily", label: "Daily" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusColors = {
  pending: { bg: "#fef3c7", text: "#92400e" },
  confirmed: { bg: "#dbeafe", text: "#1d4ed8" },
  shipped: { bg: "#e0e7ff", text: "#3730a3" },
  delivered: { bg: "#d1fae5", text: "#065f46" },
  cancelled: { bg: "#fee2e2", text: "#991b1b" },
};

function groupOrdersByPeriod(orders, period) {
  const groups = {};
  for (const order of orders) {
    const d = new Date(order.createdAt);
    let key;
    if (period === "daily") {
      key = d.toISOString().slice(0, 10);
    } else if (period === "monthly") {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    } else {
      key = String(d.getFullYear());
    }
    if (!groups[key]) groups[key] = { count: 0, revenue: 0, orders: [] };
    groups[key].count += 1;
    groups[key].revenue += order.total || 0;
    groups[key].orders.push(order);
  }
  const keys = Object.keys(groups).sort();
  return keys.map((key) => ({
    period: key,
    count: groups[key].count,
    revenue: groups[key].revenue,
  }));
}

export default function Reports() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("daily");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { limit: 2000 };
      if (statusFilter) params.status = statusFilter;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      const { data } = await API.get("/orders", { params });
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, dateFrom, dateTo]);

  const tableRows = useMemo(() => groupOrdersByPeriod(orders, period), [orders, period]);
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm" });
    let y = 12;
    doc.setFontSize(14);
    doc.text(`Orders Report (${period})`, 14, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(
      `Date: ${dateFrom || "—"} to ${dateTo || "—"} | Status: ${statusFilter || "All"}`,
      14,
      y
    );
    y += 10;

    const head = [["Period", "Orders", "Revenue (PKR)"]];
    const body = tableRows.map((r) => [r.period, String(r.count), r.revenue.toLocaleString()]);
    autoTable(doc, {
      startY: y,
      head,
      body,
      theme: "grid",
      headStyles: { fillColor: [231, 84, 128], textColor: 255 },
      margin: { left: 14 },
    });
    y = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(10);
    doc.text(`Total: ${totalOrders} orders | PKR ${totalRevenue.toLocaleString()}`, 14, y);
    y += 12;

    if (orders.length > 0) {
      doc.setFontSize(12);
      doc.text("Order details", 14, y);
      y += 6;
      const detailHead = [["Date", "Customer", "Phone", "Address", "Total (PKR)", "Status"]];
      const detailBody = orders.map((o) => [
        new Date(o.createdAt).toLocaleDateString(),
        o.customer?.name || "—",
        o.customer?.phone || "—",
        `${(o.customer?.address || "").slice(0, 25)}${(o.customer?.address?.length || 0) > 25 ? "…" : ""}, ${o.customer?.city || ""}`,
        (o.total || 0).toLocaleString(),
        o.status || "—",
      ]);
      autoTable(doc, {
        startY: y,
        head: detailHead,
        body: detailBody,
        theme: "grid",
        headStyles: { fillColor: [231, 84, 128], textColor: 255, fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        margin: { left: 14 },
      });
      y = doc.lastAutoTable.finalY + 6;
      for (const order of orders) {
        if (y > 270) {
          doc.addPage();
          y = 14;
        }
        doc.setFontSize(9);
        doc.text(
          `Order ${new Date(order.createdAt).toLocaleString()} — ${order.customer?.name} — PKR ${(order.total || 0).toLocaleString()}`,
          14,
          y
        );
        y += 5;
        const itemHead = [["Product", "Category", "Size", "Color", "Qty", "Line total (PKR)"]];
        const itemBody = (order.items || []).map((it) => [
          (it.name || "").slice(0, 30),
          it.category || "—",
          it.size || "—",
          it.color || "—",
          String(it.qty),
          (it.price * it.qty).toLocaleString(),
        ]);
        autoTable(doc, {
          startY: y,
          head: itemHead,
          body: itemBody,
          theme: "grid",
          headStyles: { fillColor: [240, 240, 240], fontSize: 7 },
          bodyStyles: { fontSize: 7 },
          margin: { left: 14 },
        });
        y = doc.lastAutoTable.finalY + 8;
      }
    }
    doc.save(`orders-report-${period}-${dateFrom || "all"}-${dateTo || "all"}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p style={{ color: C.textMid }}>Loading report data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl p-6" style={{ background: "#fee2e2", color: "#991b1b" }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-widest uppercase" style={{ color: C.text }}>
          Reports
        </h1>
        <p className="mt-1 text-sm" style={{ color: C.textMid }}>
          Daily, monthly, or yearly summary with date and status filters. Full order details below. Export as PDF.
        </p>
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap items-center gap-3 p-4 rounded-xl"
        style={{ background: C.white, border: `1px solid ${C.creamDeep}` }}
      >
        <label className="text-sm font-semibold" style={{ color: C.textMid }}>
          Report by:
        </label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-pink"
          style={{ borderColor: C.creamDeep }}
        >
          {PERIODS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <label className="text-sm font-semibold ml-2" style={{ color: C.textMid }}>
          Status:
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-pink"
          style={{ borderColor: C.creamDeep }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value || "all"} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <label className="text-sm font-semibold" style={{ color: C.textMid }}>
          From:
        </label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-pink"
          style={{ borderColor: C.creamDeep }}
        />
        <label className="text-sm font-semibold" style={{ color: C.textMid }}>
          To:
        </label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-pink"
          style={{ borderColor: C.creamDeep }}
        />
        {(dateFrom || dateTo) && (
          <button
            type="button"
            onClick={() => {
              setDateFrom("");
              setDateTo("");
            }}
            className="text-sm font-semibold"
            style={{ color: C.pink }}
          >
            Clear dates
          </button>
        )}
        <button
          type="button"
          onClick={handleExportPDF}
          className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
          style={{ background: C.pink }}
        >
          <FileDown size={18} />
          Export PDF
        </button>
      </div>

      {/* Summary cards */}
      <div className="flex flex-wrap gap-4">
        <div
          className="px-4 py-3 rounded-xl flex items-center gap-3"
          style={{ background: C.white, border: `1px solid ${C.creamDeep}` }}
        >
          <BarChart3 size={24} style={{ color: C.pink }} />
          <div>
            <p className="text-xs font-bold uppercase" style={{ color: C.textMid }}>
              Total orders
            </p>
            <p className="text-xl font-black" style={{ color: C.pinkDark }}>
              {totalOrders}
            </p>
          </div>
        </div>
        <div
          className="px-4 py-3 rounded-xl flex items-center gap-3"
          style={{ background: C.white, border: `1px solid ${C.creamDeep}` }}
        >
          <BarChart3 size={24} style={{ color: C.pink }} />
          <div>
            <p className="text-xs font-bold uppercase" style={{ color: C.textMid }}>
              Total revenue
            </p>
            <p className="text-xl font-black" style={{ color: C.pinkDark }}>
              PKR {totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Summary by period */}
      <div className="overflow-x-auto rounded-xl border" style={{ background: C.white, borderColor: C.creamDeep }}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.pinkPale, borderBottom: `2px solid ${C.creamDeep}` }}>
              <th className="text-left py-3 px-4 font-bold uppercase" style={{ color: C.text }}>
                Period
              </th>
              <th className="text-right py-3 px-4 font-bold uppercase" style={{ color: C.text }}>
                Orders
              </th>
              <th className="text-right py-3 px-4 font-bold uppercase" style={{ color: C.text }}>
                Revenue (PKR)
              </th>
            </tr>
          </thead>
          <tbody>
            {tableRows.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 text-center" style={{ color: C.textMid }}>
                  No data for selected filters
                </td>
              </tr>
            ) : (
              tableRows.map((row) => (
                <tr key={row.period} style={{ borderBottom: `1px solid ${C.creamDeep}` }}>
                  <td className="py-2 px-4 font-medium" style={{ color: C.text }}>
                    {row.period}
                  </td>
                  <td className="py-2 px-4 text-right" style={{ color: C.text }}>
                    {row.count}
                  </td>
                  <td className="py-2 px-4 text-right font-semibold" style={{ color: C.pinkDark }}>
                    {row.revenue.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Full order details */}
      <div>
        <h2 className="text-lg font-bold mb-3" style={{ color: C.text }}>
          Order details ({orders.length})
        </h2>
        <div className="overflow-x-auto rounded-xl border" style={{ background: C.white, borderColor: C.creamDeep }}>
          {orders.length === 0 ? (
            <div className="p-10 text-center">
              <Package size={40} style={{ color: C.textMid }} className="mx-auto mb-2" />
              <p style={{ color: C.text }} className="font-semibold">
                No orders for selected filters
              </p>
            </div>
          ) : (
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: C.cream, borderBottom: `2px solid ${C.creamDeep}` }}>
                  <th className="text-left py-3 px-3 font-bold" style={{ color: C.text }}>
                    Date
                  </th>
                  <th className="text-left py-3 px-3 font-bold" style={{ color: C.text }}>
                    Customer
                  </th>
                  <th className="text-left py-3 px-3 font-bold hidden md:table-cell" style={{ color: C.text }}>
                    Phone
                  </th>
                  <th className="text-left py-3 px-3 font-bold hidden lg:table-cell max-w-[180px]" style={{ color: C.text }}>
                    Address
                  </th>
                  <th className="text-right py-3 px-3 font-bold" style={{ color: C.text }}>
                    Total
                  </th>
                  <th className="text-left py-3 px-3 font-bold" style={{ color: C.text }}>
                    Status
                  </th>
                  <th className="w-10 py-3 px-2" />
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const statusStyle = statusColors[order.status] || statusColors.pending;
                  const orderDate = order.createdAt
                    ? new Date(order.createdAt).toLocaleString("en-PK", { dateStyle: "short", timeStyle: "short" })
                    : "—";
                  const isExpanded = expandedOrderId === order._id;
                  return (
                    <React.Fragment key={order._id}>
                      <tr
                        key={order._id}
                        style={{
                          borderBottom: `1px solid ${C.creamDeep}`,
                          background: isExpanded ? C.cream : undefined,
                        }}
                      >
                        <td className="py-2 px-3 whitespace-nowrap" style={{ color: C.text }}>
                          {orderDate}
                        </td>
                        <td className="py-2 px-3 font-semibold" style={{ color: C.text }}>
                          {order.customer?.name}
                        </td>
                        <td className="py-2 px-3 hidden md:table-cell" style={{ color: C.textMid }}>
                          {order.customer?.phone}
                        </td>
                        <td className="py-2 px-3 hidden lg:table-cell max-w-[180px] truncate" style={{ color: C.textMid }}>
                          {order.customer?.address}, {order.customer?.city}
                        </td>
                        <td className="py-2 px-3 text-right font-bold" style={{ color: C.pink }}>
                          PKR {(order.total || 0).toLocaleString()}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                            style={{ background: statusStyle.bg, color: statusStyle.text }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-2 px-2">
                          <button
                            type="button"
                            onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                            className="p-1 rounded hover:opacity-80"
                            style={{ color: C.pink }}
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                          >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${order._id}-detail`}>
                          <td colSpan={7} className="p-0" style={{ background: C.cream, borderBottom: `1px solid ${C.creamDeep}` }}>
                            <div className="p-4">
                              <p className="text-xs font-bold uppercase mb-2" style={{ color: C.textMid }}>
                                Items
                              </p>
                              <div className="space-y-3">
                                {(order.items || []).map((it, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-3 p-3 rounded-lg border"
                                    style={{ borderColor: C.creamDeep, background: C.white }}
                                  >
                                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white border" style={{ borderColor: C.creamDeep }}>
                                      {it.img ? (
                                        <img src={it.img} alt={it.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center" style={{ color: C.textMid }}>
                                          <Package size={20} />
                                        </div>
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold" style={{ color: C.text }}>
                                        {it.name}
                                      </p>
                                      <p className="text-xs" style={{ color: C.textMid }}>
                                        Category: {it.category || "—"} {it.size ? ` · Size: ${it.size}` : ""} {it.color ? ` · Color: ${it.color}` : ""}
                                      </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                      <p className="font-bold" style={{ color: C.pink }}>
                                        ×{it.qty} — PKR {(it.price * it.qty).toLocaleString()}
                                      </p>
                                      <p className="text-xs" style={{ color: C.textMid }}>
                                        PKR {it.price?.toLocaleString()} each
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
