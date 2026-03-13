const crypto = require('crypto');

const CHARS = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '$%#*@!?'
};

const ALL_CHARS = Object.values(CHARS).join('');
const LENGTHS = [8, 16, 32];

const generatePassword = (length) => {
    const chars = new Array(length);
    const getChar = (str) => str[crypto.randomInt(str.length)];
    
    chars[0] = getChar(CHARS.upper);
    chars[1] = getChar(CHARS.lower);
    chars[2] = getChar(CHARS.numbers);
    chars[3] = getChar(CHARS.symbols);
    
    for (let i = 4; i < length; i++) {
        chars[i] = getChar(ALL_CHARS);
    }
    
    for (let i = chars.length - 1; i > 0; i--) {
        const j = crypto.randomInt(i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    
    return chars.join('');
};

module.exports = {
    execute: () => {
        const length = LENGTHS[crypto.randomInt(LENGTHS.length)];
        console.log(`\nGenerated password: ${generatePassword(length)}\n`);
    }
};