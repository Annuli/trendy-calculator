
// Assign UTF-8 symbols to the input buttons
document.getElementById('btn-chevron-up').value='\u2303';
document.getElementById('btn-chevron-down').value = '\u2304';
document.getElementById('btn-square-root').value = '\u221A';
document.getElementById('btn-division-sign').value = '\u00F7';
document.getElementById('btn-percent-sign').value = '\u0025';
document.getElementById('btn-multiplication-sign').value = '\u2715';
document.getElementById('btn-subtraction-sign').value = '\u2212';
document.getElementById('btn-addition-sign').value = '\u002B';
document.getElementById('btn-decimal-point').value = '\u00B7';

// Create a space in local storage for user values; initialize to 0;
localStorage.setItem('valueInMemory', 0);


// Start with the calculator turned off
let calculatorOn = false;

// Start with the digit separators off
let showDigitSeparators = false;

// Max of 12 digits to be shown on the display
const MAX_NUMBER_OF_DIGITS = 12;

// Counter for the number of digits displayed on the screen
let digitCounter = 0;



// This function clears ALL values after an arithmetic operator
clearScreen = () => {

    // Retrieve the LCD screen string
    let screenDisplay = document.getElementById("lcd-display").value;

    let counter = 0;
    let newString = false;
    for(let x = screenDisplay.length - 1; (x >= 0) && (newString == false); x--) {
  
        // If [x] is a number
        if(Number(screenDisplay[x])) {
            counter++;

        // [x] is not a number
        } else {

            // Create a string with all characters except those AFTER the arithmetic operators
            let newDisplay = screenDisplay.substring(0, screenDisplay.length - counter);

            // Assign the new string to the LCD screen
            document.getElementById('lcd-display').value = newDisplay;

            // Break the loop
            newString = true;
        } 
    }

    // Subtract the number associated with 'counter' from the 'digitCounter'
    digitCounter = digitCounter - counter; 
}


// Display the button values as the user needs
display = (character) => {

    // Don't display any values if the calculator is not on
    if(calculatorOn == false) {
        document.getElementById("lcd-display").value = '';
    }

    // Calculator now used for needed functions
    else if((calculatorOn == true) && (digitCounter < MAX_NUMBER_OF_DIGITS)) {

        // Remove the '0.' when starting calculations
        if(document.getElementById("lcd-display").value == '0.') {
            document.getElementById("lcd-display").value = '';
         }
         
        // Assign the value to a variable; cast as a number
        let testedVariable = Number(character);

        // Test whether the character is a digit and add to the 'digitCounter' as needed
        if((Number.isInteger(testedVariable)) && (character == '00')) {
            digitCounter += 2;
            document.getElementById("lcd-display").value += character;

        } else if(Number.isInteger(testedVariable)) {

            // Append the character to the LCD screen
            document.getElementById("lcd-display").value += character;
            digitCounter++;

        } else {

            // For any operator other than a number
            document.getElementById("lcd-display").value += character;
        }
    }
}


// Insert a digit separator to increase ease of reading the display
displayDigitSeparators = () => {

    // If 'displayDigitSeparators' is false
    if(showDigitSeparators == false) {

        // Retrieve the string from the LCD screen
        let screenDisplay = document.getElementById("lcd-display").value

        // Regular Expression to insert an apostrophe after every three digits
        let newDisplay = screenDisplay.replace(/\B(?=(\d{3})+(?!\d))/g, "'");

        // Display the new string to the LCD screen
        document.getElementById("lcd-display").value = newDisplay;
    }

    // If 'displayDigitSeparators' is false
    else if(showDigitSeparators == true) {

        // Retrieve the string from the LCD screen
        let screenDisplay = document.getElementById("lcd-display").value

        // Regular Expression to replace all apostrophes with empty space
        let newDisplay = screenDisplay.replace(/'/g,'') ;

        // Display the new string to the LCD screen
        document.getElementById("lcd-display").value = newDisplay;
    }

    // Change the boolean value for the next time the DISP button is tapped
    showDigitSeparators = !showDigitSeparators;
}


// Calculate the square root of a number and return the value
// Does not work with arithmetic operators!!
calculateSquareRoot = () => {

    digitCounter = 0;
    let evalString = '';

    // Retrieve the string from the LCD screen
    let screenDisplay = document.getElementById("lcd-display").value

    // Cast the screenDisplay number to a Float datatype
    castedDisplayString = parseFloat(screenDisplay);

    // Get the square root of the casted string
    let squareRoot = Math.sqrt(castedDisplayString);

    // Convert the number to a string; radix = base 10
    let evaluationToString = squareRoot.toString(10);


    // Count the number of integers, '-' or '.' being shown in the LCD screen
    for(let x = 0; (x < evaluationToString.length) && (digitCounter < MAX_NUMBER_OF_DIGITS); x++) {

        // If the character is a  number add to digitCounter
        if(!isNaN(evaluationToString[x])) {

            // Increase the digitCounter
            digitCounter++;
        }

        // Add the character to the string
        evalString += evaluationToString[x];
    }


    // Display the square root on the LCD screen
    document.getElementById("lcd-display").value = evalString;
}


// Calculate the percentage of a number and return the value
calculatePercentage = () => {

    let evalString = '';
    let operator = '';
    let displayString = '';
    let percentString = '';
    let newString = false;
    let counter = 1;  // Start with 1, due to counting the percent sign to begin

    // Retrieve the LCD screen string
    let screenDisplay = document.getElementById('lcd-display').value;

    // Retrieve all the digits that are before the percent sign and after the arithmetic operator; don't count '%'
    for(let x = screenDisplay.length - 1; (x >= 0) && (newString == false); x--) {

        // Retrieve all digits before the percent sign and after the arithmetic operator
        if(Number(screenDisplay[x]) || Number(screenDisplay[x]) == 0 || screenDisplay[x] == '.') {
            counter++;

            // Append the character to the end of the new string
            percentString = screenDisplay[x] + percentString;
                
        // Retrieve all digits before the arithmetic operator                                                                            // '*' and '/' do not work correctly
        } else if((screenDisplay[x] == '+') || (screenDisplay[x] == '-') || (screenDisplay[x] == '*') || (screenDisplay[x] == '/')) {                        // Add -, *, /
 
            // Save the operator for distinction
            operator = screenDisplay[x];

            // Retrieve the rest of the characters of the string
            displayString = screenDisplay.substring(0, screenDisplay.length - counter);

            // Break the loop
            newString = true;
        }
    }

    // Convert the new string to Number datatype; get percentage
    let castedPercentage = parseFloat(percentString);
    let convertToPercentage = castedPercentage / 100;

    // Convert the prefix of the number
    let castedDisplayString = parseFloat(displayString);

    if(operator == '+') {
        displayPercent = castedDisplayString + (castedDisplayString * convertToPercentage);

    } else if(operator == '-') {
        displayPercent = castedDisplayString - (castedDisplayString * convertToPercentage);

    } else if(operator == '*') {
        displayPercent = (castedPercentage / 100) * castedDisplayString;

    } else if(operator == '/') {
        displayPercent = castedDisplayString / convertToPercentage;
    }

    // Convert to a string with 12 places after the decimal
    let fixedDisplayPercent = displayPercent.toFixed(12);

    // Convert the number to a string; radix = base 10
    let evaluationToString = fixedDisplayPercent.toString(10);

    // Reset the digit counter 
    digitCounter = 0;

    // Count the number of integers, '-' or '.' being shown in the LCD screen
    for(let x = 0; (digitCounter < MAX_NUMBER_OF_DIGITS); x++) {
        if(!isNaN(evaluationToString[x])) {

            // Tally the number of integers used in the LCD screen
            digitCounter++;

            // Add to the string
            evalString += evaluationToString[x];

        } else if((evaluationToString[x] == '-') || (evaluationToString[x] == '.')) {

            // Add to the string
            evalString += evaluationToString[x];
        }  
    }

    // Display the string on the LCD screen
    document.getElementById('lcd-display').value = evalString;
}


// Delete the display characters one at a time;
removeLastCharacter = () => {

    // Retrieve the LCD screen string
    let screenDisplay = document.getElementById("lcd-display").value;


    // Only remove the last character if the string has characters
    if(screenDisplay !== '') {

        // Remove the last character from the screen
        let newDisplay = screenDisplay.slice(0, screenDisplay.length - 1); 

        // Display the new screen value
        document.getElementById('lcd-display').value = newDisplay;
    }
}
    

// Save user's value to the local storage value
addValueToMemory = () => {

    // If the calculator is not turned on, do no display anything on the screen
    if(calculatorOn == false) {

        document.getElementById('lcd-display').value = '';
    }

    // Calculator is on
    else {

        // Retrieve the value from the LCD screen
        let screenDisplay = document.getElementById('lcd-display').value;

        // Evaluate the string
        let newDisplay = eval(screenDisplay);

        // Display the new value on the LCD screen
        document.getElementById("lcd-display").value = newDisplay;

        // Retrieve the value in local storage
        let localStorageValue = parseFloat(localStorage.getItem('valueInMemory'));

        // Accumulate the local storage value
        let newLocalStorageValue = parseFloat(newDisplay) + localStorageValue;

        // Set the new value as a key-value pair
        localStorage.setItem('valueInMemory', newLocalStorageValue);
    }
}



// Subtract user's value from the local storage value
subtractValueFromMemory = () => {

    // If the calculator is not turned on, do no display anything on the screen
    if(calculatorOn == false) {

        document.getElementById('lcd-display').value = '';
    }

    // Calculator is on
    else {

        // Retrieve the value from the LCD screen
        let screenDisplay = document.getElementById('lcd-display').value;

        // Evaluate the string
        let newDisplay = eval(screenDisplay);

        // Display the new value on the LCD screen
        document.getElementById("lcd-display").value = newDisplay;

        // Retrieve the value in local storage
        let localStorageValue = parseFloat(localStorage.getItem('valueInMemory'));

        // Subtract the screen value from the local storage value
        let newLocalStorageValue = localStorageValue - parseFloat(newDisplay);

        // Set the new value as the key-value pair
        localStorage.setItem('valueInMemory', newLocalStorageValue);
    }
}



// Recall the value stored in local storage
recallMemory = () => {

    // If the calculator is not turned on, do no display anything on the screen
    if(calculatorOn == false) {

        document.getElementById('lcd-display').value = '';
    }

    // Calculator is on
    else {

        // Get the value from the LCD screen
        let screenDisplay = document.getElementById('lcd-display').value;

        // Retrieve the value in local storage
        let retrievedMemory = localStorage.getItem('valueInMemory');

        // Display the retrieved memory in the LCD screen
        screenDisplay = document.getElementById('lcd-display').value = screenDisplay + retrievedMemory;
    }
}


// AC_On button; set the local memory value to '0'
resetMemory_turnOn = () => {

    // Turn the calculator on
    calculatorOn = true;

    // Reset the number of displayed digits
    digitCounter = 0;

    // Reset the value in the local storage to zero
    localStorage.setItem('valueInMemory', 0);

    // Set the initial display characters
    document.getElementById("lcd-display").value = "0.";
}


// This function evaluates the expression and return result
calculate = () => {

    digitCounter = 0;
    let checkSeparators = '';
    let evalString = '';

    // If the calculator is not turned on, do no display anything on the screen
    if(calculatorOn == false) {
        document.getElementById('lcd-display').value = '';
    }

    // Calculator is on
    else {

        // Retrieve the values in the calculator display
        let screenDisplay = document.getElementById("lcd-display").value;

        // Regular Expression to replace all separators with empty space;
        // -> -> If showDigitSeparators == true, now '' == TRUE; same for boolean false
        let newDisplay = screenDisplay.replace(/'/g,'');

        // Evaluate() the string
        let showDisplay = eval(newDisplay);

        // Convert the number to a string; radix = base 10
        let evaluationToString = showDisplay.toString(10);

        // Count the number of integers, '-' or '.' being shown in the LCD screen
        for(let x = 0; (x < evaluationToString.length) && (digitCounter < MAX_NUMBER_OF_DIGITS); x++) {
            if(!isNaN(evaluationToString[x])) {

                // Tally the total places used in the LCD screen
                digitCounter++;
            }
            evalString += evaluationToString[x];
        }


        // Check to see if the digit separators are on and display to the LCD screen
        // -> -> If showDigitSeparators == true, now '' == TRUE; same for boolean false
        if(showDigitSeparators == true) {

            // Add the separators
            checkSeparators = evalString.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
            document.getElementById("lcd-display").value = checkSeparators;

        } else if(showDigitSeparators == false) {

            // Remove the separators
            checkSeparators = evalString.replace(/'/g,'');
            document.getElementById("lcd-display").value = checkSeparators;
        }     
    } 
}


// For keys that have no planned operations
noOperations = () => {

    let keyResponse = "No Functions";
    let stringIndex = 0;

    // Keep the values in the calculator display
    let screenDisplay = document.getElementById("lcd-display").value;

    // Remove the string on the LCD string
    document.getElementById("lcd-display").value = '';

    // Append one letter to the 'lcd-display' every 500ms;
    let interval = setInterval(function () {

        // Add the letter to the string
        document.getElementById("lcd-display").value += keyResponse.charAt(stringIndex);

        // Increment the index
        stringIndex++;

        // Clear the timer after the last character of the string is displayed
        if(stringIndex > keyResponse.length) {
            clearInterval(interval);

            // Clear the LCD screen after the 'keyResponse' string has finished
            document.getElementById("lcd-display").value = '';
        }

    // Displays a new character every half second
    }, 500);
}