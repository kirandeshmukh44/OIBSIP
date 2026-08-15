function Progress({ step }) {
    const steps = ["Base", "Sauce", "Cheese", "Toppings"];

    return (
        <div className="progress">
            {steps.map((item, index) => {
                const number = index + 1;

                return (
                    <div
                        className={`progress-step ${step === number ? "current" : ""
                            } ${step > number ? "completed" : ""}`}
                        key={item}
                    >
                        <div className="progress-number">
                            {step > number ? "✓" : number}
                        </div>

                        <span>{item}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default Progress;