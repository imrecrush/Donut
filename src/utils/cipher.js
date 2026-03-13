const encryptionMap = new Map([
    ['a', 'F1#'], ['b', 'G2@'], ['c', 'H3$'], ['d', 'I4%'], ['e', 'J5^'],
    ['f', 'K6&'], ['g', 'L7*'], ['h', 'M8('], ['i', 'N9)'], ['j', 'O0-'],
    ['k', 'P1_'], ['l', 'Q2+'], ['m', 'R3='], ['n', 'S4{'], ['o', 'T5}'],
    ['p', 'U6['], ['q', 'V7]'], ['r', 'W8?'], ['s', 'X9:'], ['t', 'Y0;'],
    ['u', 'Z1"'], ['v', 'A2~'], ['w', 'B3<'], ['x', 'C4>'], ['y', 'D5,'],
    ['z', 'E6.'],
    ['A', 'x7!'], ['B', 'y8@'], ['C', 'z9#'], ['D', 'a1$'], ['E', 'b2%'],
    ['F', 'c3^'], ['G', 'd4&'], ['H', 'e5*'], ['I', 'f6('], ['J', 'g7)'],
    ['K', 'h8-'], ['L', 'i9_'], ['M', 'j0+'], ['N', 'k1='], ['O', 'l2{'],
    ['P', 'm3}'], ['Q', 'n4['], ['R', 'o5]'], ['S', 'p6?'], ['T', 'q7:'],
    ['U', 'r8;'], ['V', 's9"'], ['W', 't0~'], ['X', 'u1<'], ['Y', 'v2>'],
    ['Z', 'w3,'],
    ['0', 'aA!'], ['1', 'bB@'], ['2', 'cC#'], ['3', 'dD$'], ['4', 'eE%'],
    ['5', 'fF^'], ['6', 'gG&'], ['7', 'hH*'], ['8', 'iI('], ['9', 'jJ)'],
    ['!', 'kK1'], ['@', 'lL2'], ['#', 'mM3'], ['$', 'nN4'], ['%', 'oO5'],
    ['^', 'pP6'], ['&', 'qQ7'], ['*', 'rR8'], ['(', 'sS9'], [')', 'tT0'],
    ['-', 'uU!'], ['_', 'vV@'], ['+', 'wW#'], ['=', 'xX$'], ['{', 'yY%'],
    ['}', 'zZ^'], ['[', 'Aa&'], [']', 'Bb*'], ['|', 'Cc('], [':', 'Dd)'],
    [';', 'Ee-'], ['"', 'Ff_'], ["'", 'Gg+'], ['<', 'Hh='], ['>', 'Ii{'],
    [',', 'Jj}'], ['.', 'Kk['], ['?', 'Ll]']
]);

const decryptionMap = new Map(
    Array.from(encryptionMap, ([k, v]) => [v, k])
);

const MAX_CHUNK_SIZE = 3;
const MIN_CHUNK_SIZE = 1;
const ESCAPE_CHAR = '[';

class Decryptor {
    constructor(text) {
        this.text = text;
        this.pos = 0;
        this.result = [];
        this.textLength = text.length;
        this.lastChunk = '';
    }

    process() {
        while (this.pos < this.textLength) {
            this.text[this.pos] === ESCAPE_CHAR 
                ? this.handleEscape() 
                : this.handleChunk();
        }
        return this.result.join('');
    }

    handleEscape() {
        const closePos = this.text.indexOf(']', this.pos);
        if (closePos === -1) {
            this.result.push(this.text[this.pos++]);
            return;
        }
        
        this.result.push(this.text.slice(this.pos + 1, closePos));
        this.pos = closePos + 1;
    }

    handleChunk() {
        const maxSize = Math.min(MAX_CHUNK_SIZE, this.textLength - this.pos);
        
        for (let size = maxSize; size >= MIN_CHUNK_SIZE; size--) {
            const chunk = size === 3 ? this.text.slice(this.pos, this.pos + 3) :
                          size === 2 ? this.text.slice(this.pos, this.pos + 2) :
                          this.text[this.pos];
            
            const decrypted = decryptionMap.get(chunk);
            
            if (decrypted !== undefined) {
                this.result.push(decrypted);
                this.pos += size;
                return;
            }
        }
        
        this.result.push(this.text[this.pos++]);
    }
}

const memoize = (fn) => {
    const cache = new Map();
    const weakCache = new WeakMap();
    let hits = 0;
    let misses = 0;
    
    return (text) => {
        if (typeof text !== 'string') return '';
        if (text.length > 1000) {
            if (weakCache.has(text)) return weakCache.get(text);
            const result = fn(text);
            weakCache.set(text, result);
            return result;
        }
        if (cache.has(text)) return cache.get(text);
        const result = fn(text);
        cache.set(text, result);
        
        if (cache.size > 10000) {
            const iterator = cache.keys();
            cache.delete(iterator.next().value);
        }
        
        return result;
    };
};

const encryptChar = (char) => encryptionMap.get(char);

module.exports = {
    encrypt: (text) => {
        if (typeof text !== 'string') return '';
        
        let result = '';
        let lastPos = 0;
        
        for (let i = 0; i < text.length; i++) {
            const encrypted = encryptChar(text[i]);
            if (encrypted) {
                result += encrypted;
            } else {
                result += `[${text[i]}]`;
            }
        }
        
        return result;
    },
    
    decrypt: memoize((text) => {
        if (typeof text !== 'string') return '';
        return new Decryptor(text).process();
    }),
    
    encryptStream: function* (text) {
        if (typeof text !== 'string') return;
        for (let i = 0; i < text.length; i++) {
            yield encryptChar(text[i]) || `[${text[i]}]`;
        }
    },
    
    decryptStream: function* (text) {
        if (typeof text !== 'string') return;
        const decryptor = new Decryptor(text);
        while (decryptor.pos < decryptor.textLength) {
            decryptor.text[decryptor.pos] === ESCAPE_CHAR 
                ? decryptor.handleEscape() 
                : decryptor.handleChunk();
            yield decryptor.result[decryptor.result.length - 1];
        }
    }
};