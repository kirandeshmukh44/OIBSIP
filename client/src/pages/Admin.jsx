import { useEffect, useState } from "react";
import { api } from "../services/api";

const categories = ["Pizza Bases", "Sauces", "Cheeses", "Vegetables"];
const metrics = [
  ["Total orders", "total", "🍕"], ["Awaiting kitchen", "pending", "⏳"],
  ["In kitchen", "kitchen", "👨‍🍳"], ["Out for delivery", "delivery", "🛵"],
  ["Customers", "users", "👥"], ["Low stock", "lowStock", "⚠️"]
];

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [item, setItem] = useState({ name: "", category: categories[0], quantity: 0, threshold: 10 });
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [dashboard, orders, inventory] = await Promise.all([
        api("/admin/dashboard", { token }), api("/admin/orders", { token }), api("/admin/inventory", { token })
      ]);
      setData({ dashboard, orders, inventory }); setError("");
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { if (token) load(); }, [token]);

  const login = async (event) => {
    event.preventDefault();
    try {
      const result = await api("/admin/login", { method: "POST", body: JSON.stringify(credentials) });
      localStorage.setItem("adminToken", result.token); setToken(result.token);
    } catch (e) { setError(e.message); }
  };

  const changeStatus = async (id, orderStatus) => {
    try { await api(`/admin/orders/${id}/status`, { method: "PATCH", token, body: JSON.stringify({ orderStatus }) }); load(); }
    catch (e) { setError(e.message); }
  };

  const addItem = async (event) => {
    event.preventDefault();
    try {
      await api("/admin/inventory", { method: "POST", token, body: JSON.stringify({ ...item, quantity: Number(item.quantity), threshold: Number(item.threshold) }) });
      setItem({ name: "", category: categories[0], quantity: 0, threshold: 10 }); load();
    } catch (e) { setError(e.message); }
  };

  const adjust = async (stock, direction) => {
    try { await api(`/admin/inventory/${stock._id}`, { method: "PATCH", token, body: JSON.stringify({ quantity: Math.max(0, stock.quantity + direction) }) }); load(); }
    catch (e) { setError(e.message); }
  };

  if (!token) return <div className="auth-page"><div className="auth-card admin-login"><div className="auth-logo">🍕</div><span className="eyebrow">PIZZACRAFT CONTROL ROOM</span><h1>Admin sign in</h1><p>Manage orders, kitchen progress and ingredients.</p><form onSubmit={login}><label>Email</label><input type="email" required onChange={e => setCredentials({ ...credentials, email: e.target.value })}/><label>Password</label><input type="password" required onChange={e => setCredentials({ ...credentials, password: e.target.value })}/><button className="primary-btn">Enter dashboard →</button></form>{error && <p className="form-error">{error}</p>}</div></div>;
  if (!data) return <main className="dashboard admin-shell"><p className="loading-copy">Loading your operations dashboard…</p></main>;

  return <main className="dashboard admin-shell">
    <header className="admin-hero">
      <div><span className="eyebrow">PIZZACRAFT CONTROL ROOM</span><h1>Good day, Admin.</h1><p>Keep every pizza, ingredient and delivery moving on time.</p></div>
      <button className="secondary-btn" onClick={() => { localStorage.removeItem("adminToken"); setToken(null); }}>Logout</button>
    </header>
    {error && <p className="form-error">{error}</p>}
    <section className="admin-metrics">{metrics.map(([label, key, icon], index) => <article className="metric-card" style={{ "--delay": `${index * 70}ms` }} key={key}><span>{icon}</span><small>{label}</small><strong>{key === "lowStock" ? data.dashboard.lowStock.length : data.dashboard[key]}</strong></article>)}</section>
    <section className="admin-section"><div className="section-heading"><div><span className="eyebrow">LIVE QUEUE</span><h2>Order management</h2></div><span className="muted-copy">{data.orders.length} orders</span></div><div className="admin-list">{data.orders.length ? data.orders.map(order => <article className="admin-row" key={order._id}><div className="order-token">#{order._id.slice(-6).toUpperCase()}</div><div className="row-main"><strong>{order.user?.name || "Customer"}</strong><span>{order.pizzaBase.name} · ₹{order.totalAmount}</span></div><span className={`status ${order.paymentStatus}`}>{order.paymentStatus}</span><select aria-label="Change order status" value={order.orderStatus} onChange={e => changeStatus(order._id, e.target.value)}>{["Order Received", "In Kitchen", "Sent to Delivery"].map(status => <option key={status}>{status}</option>)}</select></article>) : <p className="empty-admin">No orders have been placed yet.</p>}</div></section>
    <section className="admin-section inventory-section"><div className="section-heading"><div><span className="eyebrow">INGREDIENTS</span><h2>Inventory control</h2></div><span className="muted-copy">Add stock or adjust quantities</span></div><form className="inventory-form" onSubmit={addItem}><input placeholder="Ingredient name" required value={item.name} onChange={e => setItem({ ...item, name: e.target.value })}/><select value={item.category} onChange={e => setItem({ ...item, category: e.target.value })}>{categories.map(category => <option key={category}>{category}</option>)}</select><input aria-label="Quantity" type="number" min="0" value={item.quantity} onChange={e => setItem({ ...item, quantity: e.target.value })}/><input aria-label="Low-stock threshold" type="number" min="0" value={item.threshold} onChange={e => setItem({ ...item, threshold: e.target.value })}/><button className="primary-btn">Add item</button></form><div className="admin-list">{data.inventory.length ? data.inventory.map(stock => <article className={`admin-row inventory-row ${stock.quantity < stock.threshold ? "low-stock" : ""}`} key={stock._id}><div className="stock-mark">{stock.category === "Vegetables" ? "🥬" : stock.category === "Sauces" ? "🍅" : "🧀"}</div><div className="row-main"><strong>{stock.name}</strong><span>{stock.category} · alert at {stock.threshold}</span></div><b>{stock.quantity} units</b><div className="stock-controls"><button type="button" aria-label={`Remove one ${stock.name}`} onClick={() => adjust(stock, -1)}>−</button><button type="button" aria-label={`Add one ${stock.name}`} onClick={() => adjust(stock, 1)}>+</button></div></article>) : <p className="empty-admin">No ingredients in stock yet. Add your first item above.</p>}</div></section>
  </main>;
}
