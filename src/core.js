const help = require('./commands/help');
const generate = require('./commands/generate');
const encrypt = require('./commands/encrypt');
const decrypt = require('./commands/decrypt');
const exit = require('./commands/exit');

console.log('Donut - A password generator, encryptor and decryptor tool');
console.log('Type "help" for available commands\n');

let waitingForInput = false;

process.stdin.setEncoding('utf8');

function prompt() {
    if (!waitingForInput) {
        process.stdout.write('Donut >> ');
    }
}

prompt();

process.stdin.on('data', (data) => {
    const input = data.toString().trim();
    
    if (waitingForInput) {
        waitingForInput = false;
        return;
    }
    
    const command = input.toLowerCase();
    
    switch(command) {
        case 'help':
            help.execute();
            prompt();
            break;
        case 'generate':
            generate.execute();
            prompt();
            break;
        case 'encrypt':
            waitingForInput = true;
            encrypt.execute();
            break;
        case 'decrypt':
            waitingForInput = true;
            decrypt.execute();
            break;
        case 'exit':
            exit.execute();
            break;
        default:
            if (command) {
                console.log('Unknown command. Type "help" to see available commands');
                console.log(' ');
            }
            prompt();
    }
});