const userInput = document.getElementById("user-input");
const checkBtn = document.getElementById("check-btn");
const clearBtn = document.getElementById("clear-btn");
const resultDiv = document.getElementById("results-div");


checkBtn.addEventListener("click", () => {
    if(!userInput.value){
        alert("Please provide a phone number");
        return;
    }
    const phoneNumber = userInput.value;
    if (validatePhoneNumber(phoneNumber)) {
        resultDiv.innerHTML = `Valid US number: ${userInput.value}`;
    } else {
        resultDiv.innerHTML = `Invalid US number: ${userInput.value}`;
    }
});
clearBtn.addEventListener("click", () => {
    userInput.value = "";
    resultDiv.innerHTML = "";
});

function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^(1\s?)?(\(\d{3}\)|\d{3})([\s-]?\d{3})([\s-]?\d{4})$/;
    return phoneRegex.test(phoneNumber);
}
