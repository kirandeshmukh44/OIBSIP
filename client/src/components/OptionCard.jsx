function OptionCard({ item, selected, multiple, onClick }) {
    return (
        <button
            className={`option-card ${selected ? "selected" : ""}`}
            onClick={onClick}
        >
            <div className="option-icon">
                {item.icon}
            </div>

            <div className="option-text">
                <strong>{item.name}</strong>
                <span>+ ₹{item.price}</span>
            </div>

            <div className="option-check">
                {selected ? "✓" : "+"}
            </div>
        </button>
    );
}

export default OptionCard;