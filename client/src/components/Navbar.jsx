function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">
        <span className="brand-icon">🍕</span>
        <span>Pizza<span className="brand-red">Craft</span></span>
      </div>

      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/builder">Build Pizza</a>
        <a href="/orders">Orders</a>
      </div>

      <a href="/login" className="nav-login">
        Login
      </a>
    </nav>
  );
}

export default Navbar;