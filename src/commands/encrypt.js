const cipher = require('../utils/cipher');

module.exports = {
    execute: function() {
        process.stdout.write('Enter password: ');
        process.stdin.once('data', (data) => {
            const password = data.toString().trim();
            
            if (!password) {
                console.log('No password entered.\n');
            } else {
                const encrypted = cipher.encrypt(password);
                console.log(`Encrypted: ${encrypted}\n`);
            }
            process.stdout.write('Donut >> ');
        });
    }
};