let currentInput = '';
let previousInput = '';
let operator = null;
let justEvaluated = false;
let expression = '';
const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');
function updateDisplay(value) {
    resultEl.textContent = value;
}
function updateExpression(value) {
    expressionEl.textContent = value;
}
function flashResult() {
    resultEl.classList.add('flash');
    setTimeout(() => resultEl.classList.remove('flash'), 350);
}
function formatNumber(num) {
    if (isNaN(num) || !isFinite(num)) return 'Error';
    if (Number.isInteger(num)) return num.toString();
    const str = num.toFixed(4); 
    return parseFloat(str).toString(); 
}
function calculate(a, op, b) {
    let result;
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (op === '+') { result = numA + numB; }
    else if (op === '-') { result = numA - numB; }
    else if (op === '*') { result = numA * numB; }
    else if (op === '/') {
        if (numB === 0) return 'Cannot ÷ by 0';
        result = numA / numB;
    }
    else { result = numB; }
    return formatNumber(result);
}
function handleDigit(value) {
    if (justEvaluated) {
        currentInput = value;
        justEvaluated = false;
    } else {
        if (currentInput.replace('.', '').replace('-', '').length >= 12) return;
        currentInput += value;
    }
    updateDisplay(currentInput);
    updateExpression(
        previousInput
            ? `${previousInput} ${operatorSymbol(operator)} ${currentInput}`
            : currentInput
    );
}
function handleDecimal() {
    if (justEvaluated) { currentInput = '0.'; justEvaluated = false; }
    if (currentInput.includes('.')) return;
    if (currentInput === '') currentInput = '0';
    currentInput += '.';
    updateDisplay(currentInput);
}
function handleOperator(op) {
    if (currentInput === '' && previousInput !== '') {
        operator = op;
        updateExpression(`${previousInput} ${operatorSymbol(op)}`);
        return;
    }
    if (previousInput !== '' && currentInput !== '') {
        const chained = calculate(previousInput, operator, currentInput);
        if (chained === 'Cannot ÷ by 0') { showError(chained); return; }
        previousInput = chained;
        currentInput = '';
        updateDisplay(previousInput);
    } else if (currentInput !== '') {
        previousInput = currentInput;
        currentInput = '';
    }
    operator = op;
    justEvaluated = false;
    updateExpression(`${previousInput} ${operatorSymbol(op)}`);
}
function handleEquals() {
    if (operator === null || previousInput === '' || currentInput === '') return;
    const evalExpr = `${previousInput} ${operatorSymbol(operator)} ${currentInput}`;
    const result = calculate(previousInput, operator, currentInput);
    if (result === 'Cannot ÷ by 0') { showError(result); return; }
    updateExpression(`${evalExpr} =`);
    updateDisplay(result);
    flashResult();
    currentInput = result;
    previousInput = '';
    operator = null;
    justEvaluated = true;
}
function handlePercent() {
    if (currentInput === '') return;
    const val = parseFloat(currentInput) / 100;
    currentInput = formatNumber(val);
    updateDisplay(currentInput);
}
function handleBackspace() {
    if (justEvaluated) { handleClear(); return; }
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput || '0');
}
function handleClear() {
    currentInput = '';
    previousInput = '';
    operator = null;
    justEvaluated = false;
    expression = '';
    updateDisplay('0');
    updateExpression('');
    resultEl.classList.remove('error');
}
function showError(msg) {
    resultEl.textContent = msg;
    resultEl.classList.add('error');
    setTimeout(() => { handleClear(); }, 2000);
}
function operatorSymbol(op) {
    if (op === '+') return '+';
    if (op === '-') return '−';
    if (op === '*') return '×';
    if (op === '/') return '÷';
    return op;
}
document.querySelector('.btn-grid').addEventListener('click', function (e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    const value = btn.dataset.value;
    if (action === 'digit') { handleDigit(value); }
    else if (action === 'decimal') { handleDecimal(); }
    else if (action === 'operator') { handleOperator(value); }
    else if (action === 'equals') { handleEquals(); }
    else if (action === 'percent') { handlePercent(); }
    else if (action === 'backspace') { handleBackspace(); }
    else if (action === 'clear') { handleClear(); }
});
const keyMap = {
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
    '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
};
document.addEventListener('keydown', function (e) {
    const k = e.key;
    if (keyMap[k]) { handleDigit(k); }
    else if (k === '.') { handleDecimal(); }
    else if (k === '+') { handleOperator('+'); }
    else if (k === '-') { handleOperator('-'); }
    else if (k === '*') { handleOperator('*'); }
    else if (k === '/') { e.preventDefault(); handleOperator('/'); }
    else if (k === 'Enter' || k === '=') { handleEquals(); }
    else if (k === 'Backspace') { handleBackspace(); }
    else if (k === 'Escape') { handleClear(); }
    else if (k === '%') { handlePercent(); }
});
const voiceBtn = document.getElementById('voice-btn');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    voiceBtn.addEventListener('click', () => {
        recognition.start();
        voiceBtn.classList.add('listening');
        currentInput = '';
        previousInput = '';
        operator = null;
        updateDisplay('Listening...');
        updateExpression('');
    });
    recognition.onresult = (event) => {
        let speechResult = event.results[0][0].transcript.toLowerCase();
        console.log('Voice Input:', speechResult);
        const wordMap = [
            { regex: /\b(zero)\b/g, symbol: '0' },
            { regex: /\b(one)\b/g, symbol: '1' },
            { regex: /\b(two|to|too)\b/g, symbol: '2' },
            { regex: /\b(three)\b/g, symbol: '3' },
            { regex: /\b(four)\b/g, symbol: '4' },
            { regex: /\b(five)\b/g, symbol: '5' },
            { regex: /\b(six)\b/g, symbol: '6' },
            { regex: /\b(seven)\b/g, symbol: '7' },
            { regex: /\b(eight)\b/g, symbol: '8' },
            { regex: /\b(nine)\b/g, symbol: '9' },
            { regex: /\b(plus|add|sum|addition)\b/g, symbol: '+' },
            { regex: /\b(minus|subtract|subtraction|sub)\b/g, symbol: '-' },
            { regex: /\b(times|multiply|multiplied|multiplication|into|x)\b/g, symbol: '*' },
            { regex: /\b(divide|divided|division|over|by)\b/g, symbol: '/' },
            { regex: /\b(equals|equal to|equal)\b/g, symbol: '=' },
            { regex: /\b(clear|reset|ac)\b/g, symbol: 'clear' }
        ];
        for (const item of wordMap) {
            speechResult = speechResult.replace(item.regex, item.symbol);
        }
        speechResult = speechResult.replace(/[^0-9\+\-\*\/\.\=clear ]/g, '');
        handleCommandSequence(speechResult);
    };
    recognition.onspeechend = () => {
        recognition.stop();
        voiceBtn.classList.remove('listening');
    };
    recognition.onerror = (event) => {
        showError('Mic Error');
        voiceBtn.classList.remove('listening');
    };
    function handleCommandSequence(seq) {
        const tokens = seq.trim().split(/\s+/);
        if (tokens.includes('clear')) {
            handleClear();
            return;
        }
        handleClear();
        for (let token of tokens) {
            if (!token) continue;
            if (!isNaN(parseFloat(token))) {
                for (let char of token) {
                    if (char === '.') handleDecimal();
                    else handleDigit(char);
                }
            } else if (['+', '-', '*', '/'].includes(token)) {
                handleOperator(token);
            } else if (token === '=') {
                handleEquals();
            }
        }
        if (previousInput && operator && currentInput) {
            handleEquals();
        }
    }
} else {
    voiceBtn.style.display = 'none';
}
