let display = document.getElementById("display");

let numbers = document.querySelectorAll(".number");
let operators = document.querySelectorAll(".operator");

let clearButton = document.getElementById("clear");
let backspaceButton = document.getElementById("backspace");
let equalsButton = document.getElementById("equals");

let firstNumber = "";
let secondNumber = "";
let currentOperator = "";


// Number buttons
numbers.forEach(function(button) {

    button.addEventListener("click", function() {

        let value = button.textContent;

        // Don't allow more than one decimal point
        if (value === "." && display.value.includes(".")) {
            return;
        }

        // If display is 0, replace it
        if (display.value === "0") {
            display.value = value;
        }
        else {
            display.value += value;
        }

    });

});


// Operator buttons
operators.forEach(function(button) {

    button.addEventListener("click", function() {

        // Don't continue after error
        if (display.value === "Error") {
            return;
        }

        // If an operator already exists,
        // calculate the previous operation first
        if (currentOperator !== "") {

            calculate();

        }
        else {

            firstNumber = parseFloat(display.value);

        }

        currentOperator = button.textContent;

        display.value = "0";

    });

});


// Equals button
equalsButton.addEventListener("click", function() {

    calculate();

    currentOperator = "";

});


// Calculate function
function calculate() {

    secondNumber = parseFloat(display.value);

    if (isNaN(firstNumber) || isNaN(secondNumber)) {
        return;
    }

    let result;

    if (currentOperator === "+") {

        result = firstNumber + secondNumber;

    }
    else if (currentOperator === "−") {

        result = firstNumber - secondNumber;

    }
    else if (currentOperator === "×") {

        result = firstNumber * secondNumber;

    }
    else if (currentOperator === "÷") {

        // Division by zero
        if (secondNumber === 0) {

            display.value = "Error: Cannot divide by zero";

            firstNumber = "";
            secondNumber = "";
            currentOperator = "";

            return;
        }

        result = firstNumber / secondNumber;

    }
    else {

        return;

    }

    display.value = result;

    firstNumber = result;

}


// Clear button
clearButton.addEventListener("click", function() {

    display.value = "0";

    firstNumber = "";
    secondNumber = "";
    currentOperator = "";

});


// Backspace button
backspaceButton.addEventListener("click", function() {

    if (display.value === "Error: Cannot divide by zero") {

        display.value = "0";

        return;
    }

    display.value = display.value.slice(0, -1);

    if (display.value === "") {

        display.value = "0";

    }

});