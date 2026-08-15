import Navbar from "../components/Navbar";

function Orders() {
    return (
        <>
            <Navbar />

            <main className="dashboard">

                <div className="dashboard-top">
                    <div>
                        <span>MY ORDERS</span>
                        <h1>Order Summary</h1>
                        <p>Your pizza order will appear here.</p>
                    </div>
                </div>

                <div className="empty-orders">

                    <div>🍕</div>

                    <h2>No orders yet</h2>

                    <p>
                        Build your first pizza and it will appear here.
                    </p>

                    <a href="/builder" className="primary-btn">
                        Build My Pizza
                    </a>

                </div>

            </main>
        </>
    );
}

export default Orders;