import { useState, useEffect } from "react";
import axios from "axios";
import { C } from "../theme/colors";
import { Mail, Phone, MessageSquare, User } from "lucide-react";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

export default function ContactForm() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await API.get("/contacts", { params: { limit: 200 } });
        setContacts(data.contacts || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load contact submissions");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p style={{ color: C.textMid }}>Loading contact submissions…</p>
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
          Contact Us Form
        </h1>
        <p className="mt-1 text-sm" style={{ color: C.textMid }}>
          Submissions from the public contact page. Admin also receives each submission by email.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border" style={{ background: C.white, borderColor: C.creamDeep }}>
        {contacts.length === 0 ? (
          <div className="p-10 text-center">
            <MessageSquare size={40} style={{ color: C.textMid }} className="mx-auto mb-2" />
            <p style={{ color: C.text }} className="font-semibold">
              No contact submissions yet
            </p>
            <p style={{ color: C.textMid }} className="text-sm">
              When users submit the contact form, they will appear here.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.cream, borderBottom: `2px solid ${C.creamDeep}` }}>
                <th className="text-left py-3 px-3 font-bold uppercase" style={{ color: C.textMid }}>
                  Date
                </th>
                <th className="text-left py-3 px-3 font-bold uppercase" style={{ color: C.textMid }}>
                  Name
                </th>
                <th className="text-left py-3 px-3 font-bold uppercase" style={{ color: C.textMid }}>
                  Email
                </th>
                <th className="text-left py-3 px-3 font-bold uppercase hidden md:table-cell" style={{ color: C.textMid }}>
                  Phone
                </th>
                <th className="text-left py-3 px-3 font-bold uppercase hidden lg:table-cell" style={{ color: C.textMid }}>
                  Subject
                </th>
                <th className="text-left py-3 px-3 font-bold uppercase" style={{ color: C.textMid }}>
                  Message
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c._id} style={{ borderBottom: `1px solid ${C.creamDeep}` }}>
                  <td className="py-2 px-3 whitespace-nowrap" style={{ color: C.text }}>
                    {c.createdAt ? new Date(c.createdAt).toLocaleString("en-PK", { dateStyle: "short", timeStyle: "short" }) : "—"}
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <User size={14} style={{ color: C.pink }} />
                      <span className="font-semibold" style={{ color: C.text }}>{c.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1 hover:underline" style={{ color: C.pink }}>
                      <Mail size={14} />
                      {c.email}
                    </a>
                  </td>
                  <td className="py-2 px-3 hidden md:table-cell" style={{ color: C.textMid }}>
                    {c.phone ? (
                      <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1 hover:underline" style={{ color: C.text }}>
                        <Phone size={14} />
                        {c.phone}
                      </a>
                    ) : "—"}
                  </td>
                  <td className="py-2 px-3 max-w-[120px] hidden lg:table-cell truncate" style={{ color: C.textMid }}>
                    {c.subject || "—"}
                  </td>
                  <td className="py-2 px-3 max-w-[280px]" style={{ color: C.text }}>
                    <span className="line-clamp-2">{c.message}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
