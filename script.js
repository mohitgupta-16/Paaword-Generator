const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-length-number]");
const passwordDisplay = document.querySelector("[data-password-display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let checkCount = 0;

setIndicator("#ccc");

// default value
let passwordLength = 4;
handleSlider();

// set password length from slider
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.textContent = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =
        ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

// function to set color to strength indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// generate random integer in min to max range
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandomInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
    const symbols = '~`!@#$%^&8()_-+={[}]|:;"<,>?/';
    return symbols[getRandomInteger(0, symbols.length)];
}

// strength calcultor function
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

// to copy password to clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.textContent = "Copied";
    } catch (error) {
        copyMsg.textContent = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// every time checkbox is checked or unchecked we calculate checkCount
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    // special case
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

// function to shuffle password
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// function for generating password
function generatePassword() {
    if (checkCount <= 0) {
        return;
    }
    // special case
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // empty old password
    password = "";

    // adding values according to checkbox

    let funcArr = [];

    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }

    // compulsory addition

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // for testing
    // password += ".";

    // remaining addition

    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        password += funcArr[getRandomInteger(0, funcArr.length)]();
    }

    // shuffling the password

    password = shufflePassword(Array.from(password));

    // setting value to input element
    passwordDisplay.value = password;

    // calling strength function
    calcStrength();
}

inputSlider.addEventListener("input", (event) => {
    passwordLength = event.target.value;
    handleSlider();
});

copyBtn.addEventListener("click", () => {
    // if non empty then copy
    if (passwordDisplay.value) copyContent();
});

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});

generateBtn.addEventListener("click", generatePassword);
