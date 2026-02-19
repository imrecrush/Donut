module.exports = {
    execute: function() {
        const lengths = [8, 16, 32];
        const randomIndex = Math.floor(Math.random() * lengths.length);
        const passwordLength = lengths[randomIndex];
        
        const password = generatePassword(passwordLength);
        
        console.log(`\nGenerated password: ${password}\n`);
    }
};

function generatePassword(length) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '$%#*@!?';
    
    const allChars = uppercase + lowercase + numbers + symbols;
    let password = '';
    
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    return password;
}