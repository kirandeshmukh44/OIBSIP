
function convert() {
    const input = Number(document.getElementById("temperature").value);
    const unit = document.getElementById("unit").value;
    const error = document.getElementById("error");

    error.textContent = "";

    if (document.getElementById("temperature").value === "" || !Number.isFinite(input)) {
        error.textContent = "Please enter a valid number.";
        return;
    }

    let celsius;

    if (unit === "C") celsius = input;
    if (unit === "F") celsius = (input - 32) * 5 / 9;
    if (unit === "K") celsius = input - 273.15;

    if (celsius < -273.15) {
        error.textContent = "Temperature cannot be below absolute zero (-273.15°C).";
        return;
    }

    const fahrenheit = celsius * 9 / 5 + 32;
    const kelvin = celsius + 273.15;

    document.getElementById("celsius").textContent = celsius.toFixed(2);
    document.getElementById("fahrenheit").textContent = fahrenheit.toFixed(2);
    document.getElementById("kelvin").textContent = kelvin.toFixed(2);
}