const cipher = require('../utils/cipher');

module.exports = {
    execute: function() {
        process.stdout.write('Enter password: ');
        
        process.stdin.once('data', (data) => {
            const encrypted = data.toString().trim();
            
            if (!encrypted) {
                console.log('No password entered.\n');
            } else {
                const decrypted = cipher.decrypt(encrypted);
                console.log(`Decrypted: ${decrypted}\n`);
            }
            process.stdout.write('Donut >> ');
        });
    }
};