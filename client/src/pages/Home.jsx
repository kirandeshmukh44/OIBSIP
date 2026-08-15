
import Navbar from "../components/Navbar";

function Home() {
    return (
        <>
            <Navbar />

            <section className="hero">

                <div className="hero-content">

                    <div className="hero-tag">
                        🍕 FRESH • FAST • YOUR WAY
                    </div>

                    <h1>
                        Your pizza.
                        <br />
                        <span>Your rules.</span>
                    </h1>

                    <p>
                        Create your perfect pizza from scratch.
                        Choose your base, sauce, cheese and favourite toppings.
                    </p>

                    <a href="/builder" className="primary-btn">
                        Build My Pizza →
                    </a>

                    <div className="hero-features">
                        <div>
                            <strong>30+</strong>
                            <span>Ingredients</span>
                        </div>

                        <div>
                            <strong>Fresh</strong>
                            <span>Daily</span>
                        </div>

                        <div>
                            <strong>Fast</strong>
                            <span>Delivery</span>
                        </div>
                    </div>

                </div>

                <div className="hero-pizza">
                    <div className="hero-circle">
                        🍕
                    </div>
                </div>

            </section>

            <section className="features">

                <div className="section-title">
                    <span>WHY PIZZACRAFT</span>
                    <h2>Made your way.</h2>
                </div>

                <div className="feature-grid">

                    <div className="feature-card">
                        <div>🥬</div>
                        <h3>Fresh Ingredients</h3>
                        <p>
                            Fresh vegetables and quality ingredients in every pizza.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div>🎨</div>
                        <h3>Build Your Own</h3>
                        <p>
                            Customize every part of your pizza exactly how you like it.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div>🚴</div>
                        <h3>Quick Delivery</h3>
                        <p>
                            Hot and fresh pizza delivered straight to your door.
                        </p>
                    </div>

                </div>

            </section>
        </>
    );
}

export default Home;