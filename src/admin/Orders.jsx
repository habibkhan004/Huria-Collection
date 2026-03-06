import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { C } from "../theme/colors";
import { Phone, Package, Calendar } from "lucide-react";

const WhatsAppIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 3C8.82 3 3 8.82 3 16c0 2.31.62 4.47 1.7 6.33L3 29l6.84-1.66A12.93 12.93 0 0016 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.6a10.58 10.58 0 01-5.38-1.47l-.38-.23-4.06.98.99-3.95-.25-.4A10.56 10.56 0 015.4 16C5.4 9.63 10.63 4.4 16 4.4S26.6 9.63 26.6 16 21.37 26.6 16 26.6zm5.8-7.94c-.32-.16-1.87-.92-2.16-1.02-.29-.1-.5-.16-.71.16-.21.32-.8 1.02-.98 1.23-.18.21-.36.23-.68.07-.32-.16-1.34-.49-2.56-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.5.14-.65.14-.14.32-.36.48-.54.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.61-.52-.53-.71-.54h-.6c-.21 0-.54.08-.82.4-.29.32-1.09 1.06-1.09 2.59s1.11 3 1.27 3.21c.16.21 2.18 3.33 5.28 4.67.74.32 1.32.51 1.77.65.74.23 1.42.2 1.95.12.6-.09 1.87-.76 2.13-1.5.26-.74.26-1.37.18-1.5-.07-.13-.28-.21-.6-.37z"
      fill="currentColor"
    />
  </svg>
);

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

const GROUP_OPTIONS = [
  { value: "", label: "All orders" },
  { value: "daily", label: "Daily" },
  { value: "monthly", label: "Monthly" },
];

function groupOrdersByPeriod(orders, groupBy) {
  if (!groupBy) return null;
  const groups = {};
  for (const order of orders) {
    const d = new Date(order.createdAt);
    const key =
      groupBy === "daily"
        ? d.toISOString().slice(0, 10)
        : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(order);
  }
  const keys = Object.keys(groups).sort().reverse();
  return keys.map((key) => ({
    period: key,
    orders: groups[key],
    count: groups[key].length,
    revenue: groups[key].reduce((sum, o) => sum + (o.total || 0), 0),
  }));
}

function whatsappNumber(phone) {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.startsWith("92")) return digits;
  if (digits.startsWith("0")) return "92" + digits.slice(1);
  return "92" + digits;
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [groupBy, setGroupBy] = useState("");

  const grouped = useMemo(() => groupOrdersByPeriod(orders, groupBy), [orders, groupBy]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { limit: 100 };
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

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const { data } = await API.patch(`/orders/${orderId}`, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data.order : o)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusColors = {
    pending: { bg: "#fef3c7", text: "#92400e" },
    confirmed: { bg: "#dbeafe", text: "#1d4ed8" },
    shipped: { bg: "#e0e7ff", text: "#3730a3" },
    delivered: { bg: "#d1fae5", text: "#065f46" },
    cancelled: { bg: "#fee2e2", text: "#991b1b" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p style={{ color: C.textMid }}>Loading orders…</p>
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
          Orders
        </h1>
        <p className="mt-1 text-sm" style={{ color: C.textMid }}>
          Change status, filter by date, and contact customers
        </p>
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap items-center gap-3 p-4 rounded-xl"
        style={{ background: C.white, border: `1px solid ${C.creamDeep}` }}
      >
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-pink"
          style={{ borderColor: C.creamDeep }}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
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
        <label className="text-sm font-semibold ml-2 flex items-center gap-1" style={{ color: C.textMid }}>
          <Calendar size={16} />
          View:
        </label>
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-pink"
          style={{ borderColor: C.creamDeep }}
        >
          {GROUP_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border" style={{ background: C.white, borderColor: C.creamDeep }}>
        {orders.length === 0 ? (
          <div className="p-10 text-center">
            <Package size={40} style={{ color: C.textMid }} className="mx-auto mb-2" />
            <p style={{ color: C.text }} className="font-semibold">
              No orders found
            </p>
            <p style={{ color: C.textMid }} className="text-sm">
              Try adjusting filters.
            </p>
          </div>
        ) : groupBy && grouped && grouped.length > 0 ? (
          <div className="space-y-6">
            {grouped.map(({ period, orders: periodOrders, count, revenue }) => (
              <div key={period}>
                <div
                  className="flex flex-wrap items-center gap-3 py-2.5 px-4 rounded-t-xl border"
                  style={{ background: C.pinkPale, borderColor: C.creamDeep, color: C.text }}
                >
                  <span className="font-bold">
                    {groupBy === "daily"
                      ? new Date(period + "T12:00:00").toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
                      : new Date(period + "-01").toLocaleDateString("en-PK", { month: "long", year: "numeric" })}
                  </span>
                  <span className="text-sm" style={{ color: C.textMid }}>
                    {count} order{count !== 1 ? "s" : ""} · PKR {revenue.toLocaleString()}
                  </span>
                </div>
                <div className="overflow-x-auto rounded-b-xl border border-t-0" style={{ borderColor: C.creamDeep, background: C.white }}>
                  <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: C.cream, borderBottom: `2px solid ${C.creamDeep}` }}>
                        <th className="text-left py-3 px-3 font-bold uppercase" style={{ color: C.textMid }}>Date</th>
                        <th className="text-left py-3 px-3 font-bold uppercase" style={{ color: C.textMid }}>Customer</th>
                        <th className="text-left py-3 px-3 font-bold uppercase hidden lg:table-cell" style={{ color: C.textMid }}>Address</th>
                        <th className="text-left py-3 px-3 font-bold uppercase" style={{ color: C.textMid }}>Items</th>
                        <th className="text-right py-3 px-3 font-bold uppercase" style={{ color: C.textMid }}>Total</th>
                        <th className="text-left py-3 px-3 font-bold uppercase" style={{ color: C.textMid }}>Status</th>
                        <th className="text-left py-3 px-3 font-bold uppercase" style={{ color: C.textMid }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {periodOrders.map((order) => {
                        const statusStyle = statusColors[order.status] || statusColors.pending;
                        const waNum = whatsappNumber(order.customer?.phone);
                        const orderDate = order.createdAt
                          ? new Date(order.createdAt).toLocaleString("en-PK", { dateStyle: "short", timeStyle: "short" })
                          : "—";
                        const isUpdating = updatingId === order._id;
                        const isExpanded = expandedId === order._id;
                        return (
                          <tr
                            key={order._id}
                            style={{ borderBottom: `1px solid ${C.creamDeep}`, background: isExpanded ? C.cream : undefined }}
                          >
                            <td className="py-2 px-3 whitespace-nowrap" style={{ color: C.text }}>{orderDate}</td>
                            <td className="py-2 px-3">
                              <div className="font-semibold" style={{ color: C.text }}>{order.customer?.name}</div>
                              <a href={`tel:${(order.customer?.phone || "").replace(/\s/g, "")}`} className="text-xs hover:underline" style={{ color: C.textMid }}>{order.customer?.phone}</a>
                            </td>
                            <td className="py-2 px-3 max-w-[140px] hidden lg:table-cell truncate" style={{ color: C.textMid }}>{order.customer?.address}, {order.customer?.city}</td>
                            <td className="py-2 px-3">
                              <button type="button" onClick={() => setExpandedId(isExpanded ? null : order._id)} className="text-left font-medium hover:underline" style={{ color: C.pink }}>
                                {order.items?.length || 0} item(s) {isExpanded ? "▲" : "▼"}
                              </button>
                              {isExpanded && (
                                <ul className="mt-2 space-y-2 border-t pt-2" style={{ borderColor: C.creamDeep }}>
                                  {(order.items || []).map((it, i) => (
                                    <li key={i} className="flex items-center gap-2 py-1" style={{ borderBottom: `1px solid ${C.creamDeep}` }}>
                                      <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-white border" style={{ borderColor: C.creamDeep }}>
                                        {it.img ? <img src={it.img} alt={it.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center" style={{ color: C.textMid }}><Package size={14} /></div>}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <span className="font-medium block truncate" style={{ color: C.text }}>{it.name}</span>
                                        <span className="text-xs" style={{ color: C.textMid }}>{[it.category, it.size, it.color].filter(Boolean).join(" · ")} · ×{it.qty} — PKR{(it.price * it.qty).toLocaleString()}</span>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </td>
                            <td className="py-2 px-3 text-right font-bold whitespace-nowrap" style={{ color: C.pink }}>PKR {order.total?.toLocaleString()}</td>
                            <td className="py-2 px-3">
                              <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} disabled={isUpdating} className="px-2 py-1 rounded border text-xs font-semibold outline-none focus:ring-2 focus:ring-pink" style={{ borderColor: C.creamDeep, background: statusStyle.bg, color: statusStyle.text }}>
                                <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-1">
                                <a href={`https://wa.me/${waNum}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-white transition hover:opacity-90" style={{ background: "#25D366" }} title="WhatsApp"><WhatsAppIcon size={14} /></a>
                                <a href={`tel:${(order.customer?.phone || "").replace(/\s/g, "")}`} className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition hover:opacity-90" style={{ background: C.pink, color: C.white }} title="Call"><Phone size={14} /></a>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.cream, borderBottom: `2px solid ${C.creamDeep}` }}>
                <th className="text-left py-3 px-3 font-bold uppercase" style={{ color: C.textMid }}>
                  Date
                </th>
                <th className="text-left py-3 px-3 font-bold uppercase" style={{ color: C.textMid }}>
                  Customer
                </th>
                <th className="text-left py-3 px-3 font-bold uppercase hidden lg:table-cell" style={{ color: C.textMid }}>
                  Address
                </th>
                <th className="text-left py-3 px-3 font-bold uppercase" style={{ color: C.textMid }}>
                  Items
                </th>
                <th className="text-right py-3 px-3 font-bold uppercase" style={{ color: C.textMid }}>
                  Total
                </th>
                <th className="text-left py-3 px-3 font-bold uppercase" style={{ color: C.textMid }}>
                  Status
                </th>
                <th className="text-left py-3 px-3 font-bold uppercase" style={{ color: C.textMid }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusStyle = statusColors[order.status] || statusColors.pending;
                const waNum = whatsappNumber(order.customer?.phone);
                const orderDate = order.createdAt
                  ? new Date(order.createdAt).toLocaleString("en-PK", { dateStyle: "short", timeStyle: "short" })
                  : "—";
                const isUpdating = updatingId === order._id;
                const isExpanded = expandedId === order._id;

                return (
                  <tr
                    key={order._id}
                    style={{
                      borderBottom: `1px solid ${C.creamDeep}`,
                      background: isExpanded ? C.cream : C.white,
                    }}
                  >
                    <td className="py-2 px-3 whitespace-nowrap" style={{ color: C.text }}>
                      {orderDate}
                    </td>
                    <td className="py-2 px-3">
                      <div className="font-semibold" style={{ color: C.text }}>
                        {order.customer?.name}
                      </div>
                      <a
                        href={`tel:${(order.customer?.phone || "").replace(/\s/g, "")}`}
                        className="text-xs hover:underline"
                        style={{ color: C.textMid }}
                      >
                        {order.customer?.phone}
                      </a>
                    </td>
                    <td className="py-2 px-3 max-w-[140px] hidden lg:table-cell truncate" style={{ color: C.textMid }}>
                      {order.customer?.address}, {order.customer?.city}
                    </td>
                    <td className="py-2 px-3">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : order._id)}
                        className="text-left font-medium hover:underline"
                        style={{ color: C.pink }}
                      >
                        {order.items?.length || 0} item(s) {isExpanded ? "▲" : "▼"}
                      </button>
                      {isExpanded && (
                        <ul className="mt-2 space-y-2 border-t pt-2" style={{ borderColor: C.creamDeep }}>
                          {(order.items || []).map((it, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 py-1"
                              style={{ borderBottom: `1px solid ${C.creamDeep}` }}
                            >
                              <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-white border" style={{ borderColor: C.creamDeep }}>
                                {it.img ? (
                                  <img src={it.img} alt={it.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center" style={{ color: C.textMid }}>
                                    <Package size={14} />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="font-medium block truncate" style={{ color: C.text }}>
                                  {it.name}
                                </span>
                                <span className="text-xs" style={{ color: C.textMid }}>
                                  {[it.category, it.size, it.color].filter(Boolean).join(" · ")} · ×{it.qty} — PKR{(it.price * it.qty).toLocaleString()}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right font-bold whitespace-nowrap" style={{ color: C.pink }}>
                      PKR {order.total?.toLocaleString()}
                    </td>
                    <td className="py-2 px-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={isUpdating}
                        className="px-2 py-1 rounded border text-xs font-semibold outline-none focus:ring-2 focus:ring-pink"
                        style={{ borderColor: C.creamDeep, background: statusStyle.bg, color: statusStyle.text }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1">
                        <a
                          href={`https://wa.me/${waNum}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-white transition hover:opacity-90"
                          style={{ background: "#25D366" }}
                          title="WhatsApp"
                        >
                          <WhatsAppIcon size={14} />
                        </a>
                        <a
                          href={`tel:${(order.customer?.phone || "").replace(/\s/g, "")}`}
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition hover:opacity-90"
                          style={{ background: C.pink, color: C.white }}
                          title="Call"
                        >
                          <Phone size={14} />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
