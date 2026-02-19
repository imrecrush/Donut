const encryptionMap = {
    'a': 'F1#', 'b': 'G2@', 'c': 'H3$', 'd': 'I4%', 'e': 'J5^',
    'f': 'K6&', 'g': 'L7*', 'h': 'M8(', 'i': 'N9)', 'j': 'O0-',
    'k': 'P1_', 'l': 'Q2+', 'm': 'R3=', 'n': 'S4{', 'o': 'T5}',
    'p': 'U6[', 'q': 'V7]', 'r': 'W8?', 's': 'X9:', 't': 'Y0;',
    'u': 'Z1"', 'v': 'A2\'', 'w': 'B3<', 'x': 'C4>', 'y': 'D5,',
    'z': 'E6.',
    
    'A': 'x7!', 'B': 'y8@', 'C': 'z9#', 'D': 'a1$', 'E': 'b2%',
    'F': 'c3^', 'G': 'd4&', 'H': 'e5*', 'I': 'f6(', 'J': 'g7)',
    'K': 'h8-', 'L': 'i9_', 'M': 'j0+', 'N': 'k1=', 'O': 'l2{',
    'P': 'm3}', 'Q': 'n4[', 'R': 'o5]', 'S': 'p6?', 'T': 'q7:',
    'U': 'r8;', 'V': 's9"', 'W': 't0\'', 'X': 'u1<', 'Y': 'v2>',
    'Z': 'w3,',
    
    '0': 'aA!', '1': 'bB@', '2': 'cC#', '3': 'dD$', '4': 'eE%',
    '5': 'fF^', '6': 'gG&', '7': 'hH*', '8': 'iI(', '9': 'jJ)',
    
    '!': 'kK1', '@': 'lL2', '#': 'mM3', '$': 'nN4', '%': 'oO5',
    '^': 'pP6', '&': 'qQ7', '*': 'rR8', '(': 'sS9', ')': 'tT0',
    '-': 'uU!', '_': 'vV@', '+': 'wW#', '=': 'xX$', '{': 'yY%',
    '}': 'zZ^', '[': 'Aa&', ']': 'Bb*', '|': 'Cc(', ':': 'Dd)',
    ';': 'Ee-', '"': 'Ff_', "'": 'Gg+', '<': 'Hh=', '>': 'Ii{',
    ',': 'Jj}', '.': 'Kk[', '?': 'Ll]'
};

const decryptionMap = {};
for (let [key, value] of Object.entries(encryptionMap)) {
    decryptionMap[value] = key;
}

module.exports = {
    encrypt: function(text) {
        let result = '';
        for (let char of text) {
            if (encryptionMap[char]) {
                result += encryptionMap[char];
            } else {
                result += '[' + char + ']';
            }
        }
        return result;
    },
    
    decrypt: function(text) {
        let result = '';
        let i = 0;
        
        while (i < text.length) {
            if (text[i] === '[') {
                const closeBracket = text.indexOf(']', i);
                if (closeBracket !== -1) {
                    result += text.substring(i + 1, closeBracket);
                    i = closeBracket + 1;
                    continue;
                }
            }
            
            if (i + 2 < text.length) {
                const chunk = text.substr(i, 3);
                if (decryptionMap[chunk]) {
                    result += decryptionMap[chunk];
                    i += 3;
                } else {
                    const chunk2 = text.substr(i, 2);
                    if (decryptionMap[chunk2]) {
                        result += decryptionMap[chunk2];
                        i += 2;
                    } else {
                        result += text[i];
                        i++;
                    }
                }
            } 
            else if (i + 1 < text.length) {
                const chunk = text.substr(i, 2);
                if (decryptionMap[chunk]) {
                    result += decryptionMap[chunk];
                    i += 2;
                } else {
                    result += text[i];
                    i++;
                }
            }
            else {
                result += text[i];
                i++;
            }
        }
        
        return result;
    }
};
