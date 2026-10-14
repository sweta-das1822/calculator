// Making a fully functional calculator using html css and js.

const display = document.getElementById("result-box");          // input box
const eqn_display = document.getElementById("equation");        // div tag
let str = '';
let ans;
const operators = ['+', '-', '*', '/'];
let calculatedValue = false;

function isOperator(value) {
    return operators.includes(value);
}

function isPercentage(value) {
    // checks whether % is present in the equation or not.
    let arr = Array.from(value);
    let percentIdx = -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '%') {
            percentIdx = i;
        }
    }
    return percentIdx;
}

function beforeIdx(value, pIdx) {
    // returns the index of the first operand before %
    let arr = Array.from(value);
    let beforeOpIdx = -1;
    for (let i = pIdx; i >= 0; i--) {
        if (operators.includes(arr[i])) {
            beforeOpIdx = i;
            return beforeOpIdx + 1;
        }
    }
    return 0;
}

function afterIdx(value, pIdx) {
    // returns the index of the last operand aftr %  
    let arr = Array.from(value);
    let afterOpIdx = -1;
    for (let i = pIdx+1; i <= arr.length - 1; i++) {
        if (operators.includes(arr[i])) {
            afterOpIdx = i;
            return afterOpIdx - 1;
        }
    }
    return arr.length - 1;
}

function percentValue(str, pIdx) {
    // calculate the value around % and return a new equation 
    let start = beforeIdx(str, pIdx);
    let end = afterIdx(str, pIdx);
    
    let firstnum = parseFloat(str.slice(start, pIdx));
    let secondnum = parseFloat(str.slice(pIdx + 1, end + 1));

    if(isNaN(firstnum) || isNaN(secondnum)) {
        return str; // blocks invalid percentage use like 5 + %
    }
    let percentAns = firstnum * (secondnum / 100);
    const newStr = str.slice(0,start) + percentAns + str.slice(end+1);
    return newStr;
}

const buttons = document.querySelectorAll("button");

Array.from(buttons).forEach((button) => {
    button.addEventListener('click', (e) => {
        let lastChar = str.slice(-1);
        // all clear button 
        if (e.target.innerHTML === 'AC') {
            str = '';
            ans = '';
            display.value = '0';
            eqn_display.innerHTML = '';
            calculatedValue = false;
            return;
        }

        // only clear button
        else if (e.target.innerHTML === 'C') {
            str = str.slice(0, -1);
            if (str === '')
                display.value = '0';
            else
                display.value = str;
            eqn_display.innerHTML = '';
            calculatedValue = false;
            return;
        }

        // equal button
        else if (e.target.innerHTML === '=') {
            if (str === '' || isOperator(lastChar)) {
                console.log("String is empty or last char is an operator.");
                return;
            }

            try {
                eqn_display.innerHTML = str;
                while (isPercentage(str) > -1) {
                    str = percentValue(str, isPercentage(str));
                }
                ans = eval(str);
                ans = parseFloat(ans.toFixed(10));
                display.value = ans;
                str = ans.toString();
                calculatedValue = true;
            }
            catch (error) {
                console.log(error);
                str = '';
            }
            return;
        }
        
        // all other buttons
        else {
            let value = e.target.innerHTML;
            // prevents from starting with operator 
            if (str === '' && (isOperator(value) || value === '%')) {
                alert("Invalid Format Used!");
                return;
            }

            // controls '=' sign behavior
            if (calculatedValue) {
                if (isOperator(value) || value === '%') {
                    str = str + value;
                }
                else {
                    str = value;
                    eqn_display.innerHTML = '';
                }
                calculatedValue = false;
                display.value = str;
                return;
            }

            // overlapping two operators condition
            else if ((isOperator(value) || value === '%') && (isOperator(lastChar) || lastChar === '%')) {
                str = str.slice(0, -1) + value;
                display.value = str;
                return;
            }

            else {
                str = str + e.target.innerHTML;
                display.value = str;
            }
        }
    })
})