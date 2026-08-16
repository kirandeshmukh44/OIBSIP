function Navbar() {
  const loggedIn = Boolean(localStorage.getItem("token"));
  return <nav className="navbar">
    <a href="/" className="brand" aria-label="PizzaCraft home"><span className="brand-icon">🍕</span><span>Pizza<span className="brand-red">Craft</span></span></a>
    <div className="nav-links"><a href="/">Home</a><a href="/builder">Build pizza</a><a href="/orders">My orders</a></div>
    <a href={loggedIn ? "/dashboard" : "/login"} className="nav-login">{loggedIn ? "My account" : "Sign in"}<span>→</span></a>
  </nav>;
}
export default Navbar;
