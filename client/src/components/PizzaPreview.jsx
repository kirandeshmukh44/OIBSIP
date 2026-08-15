function PizzaPreview({ pizza, price }) {
    return (
        <div className="preview">

            <div className="preview-image">
                <div className="pizza-emoji">🍕</div>
            </div>

            <div className="preview-title">
                <div>
                    <span>Your creation</span>
                    <h2>My Pizza</h2>
                </div>

                <span className="veg-badge">VEG</span>
            </div>

            <div className="summary">

                <div className="summary-row">
                    <span>Base</span>
                    <strong>{pizza.base || "Not selected"}</strong>
                </div>

                <div className="summary-row">
                    <span>Sauce</span>
                    <strong>{pizza.sauce || "Not selected"}</strong>
                </div>

                <div className="summary-row">
                    <span>Cheese</span>
                    <strong>{pizza.cheese || "Not selected"}</strong>
                </div>

                <div className="summary-row">
                    <span>Toppings</span>
                    <strong>
                        {pizza.vegetables.length > 0
                            ? pizza.vegetables.join(", ")
                            : "None"}
                    </strong>
                </div>

            </div>

            <div className="price-box">
                <span>Estimated total</span>
                <strong>₹{price}</strong>
            </div>

        </div>
    );
}

export default PizzaPreview;