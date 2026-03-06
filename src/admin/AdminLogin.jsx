import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "./fakeAuth";
import { C } from "../theme/colors";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = loginAdmin(email, password);
    if (success) navigate("/admin/dashboard");
    else alert("Invalid credentials");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: C.cream }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-96 p-8 rounded-2xl shadow-xl space-y-6"
        style={{ background: C.white }}
      >
        <h2
          className="text-2xl font-black tracking-widest text-center uppercase"
          style={{ color: C.pinkDark }}
        >
          Admin Login
        </h2>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:outline-none"
            style={{
              borderColor: C.creamDark,
              color: C.text,
            }}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:outline-none"
            style={{
              borderColor: C.creamDark,
              color: C.text,
            }}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-bold tracking-widest uppercase transition-all hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`,
            color: C.white,
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}