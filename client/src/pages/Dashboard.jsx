import Navbar from "../components/Navbar";

function Dashboard() {

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <>
            <Navbar />

            <main className="dashboard">

                <div className="dashboard-top">

                    <div>
                        <span>MY ACCOUNT</span>
                        <h1>Welcome to PizzaCraft 🍕</h1>
                        <p>Ready to build your next pizza?</p>
                    </div>

                    <button
                        className="secondary-btn"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

                <div className="dashboard-grid">

                    <div className="dashboard-card">
                        <span>🍕</span>
                        <h2>Build a Pizza</h2>
                        <p>Create your own custom pizza.</p>
                        <a href="/builder" className="primary-btn">
                            Start Building
                        </a>
                    </div>

                    <div className="dashboard-card">
                        <span>📦</span>
                        <h2>My Orders</h2>
                        <p>Check your recent pizza orders.</p>
                        <a href="/orders" className="secondary-btn">
                            View Orders
                        </a>
                    </div>

                </div>

            </main>
        </>
    );
}

export default Dashboard;