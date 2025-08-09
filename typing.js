// Settings
const target = document.getElementById('whoami');
const typeDelay = 0.08;          // speeds in seconds
const backspaceDelay = 0.03;
const chillDelay = 2.5;
const before = 'I\'m Jimin Woo, '
const me = [
    'a student @ University of Toronto',
    'an artist',
    'a Computer Engineer',
    'a Web Developer',
    'a Machine Learning Developer',
    'a fast learner',
    'a programmer',
]

// Turn into array of char arrays
let me_expanded = []
for (const elem of me) {
    me_expanded.push(elem.split(''));
}

// Looping typing animation
let currentLine = 0;
let currentChars = me_expanded[0].filter(() => true);   // clone array so we don't just have a reference
function type() {
    if (currentChars.length !== 0) {
        target.innerText += currentChars.shift();       // display next char

        setTimeout(type, typeDelay * 1000);
    }
    else {
        currentLine = (currentLine + 1 < me_expanded.length) ? currentLine + 1 : 0;     // run through all lines in a loop
        currentChars = me_expanded[currentLine].filter(() => true);                     // clone array like above

        setTimeout(backspace, chillDelay * 1000);
    }
}
function backspace() {
    if (target.innerText !== before) {
        target.innerText = target.innerText.slice(0, -1);       // remove last char from text
        setTimeout(backspace, backspaceDelay * 1000);
    }
    else {
        setTimeout(type, typeDelay * 1000);     // go back to typing once all text is removed
    }
}

// Start!
target.innerText = before;
type();

