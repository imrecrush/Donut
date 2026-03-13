const help = require('./commands/help');
const generate = require('./commands/generate');
const encrypt = require('./commands/encrypt');
const decrypt = require('./commands/decrypt');
const exit = require('./commands/exit');

console.log('Donut - A password generator, encryptor and decryptor tool\nType "help" for available commands\n');

let waitingForInput = false;
let stdinListenerAttached = false;

process.stdin.setEncoding('utf8');
process.stdin.resume();

const commands = {
    help: () => { help.execute(); schedulePrompt(); },
    generate: () => { generate.execute(); schedulePrompt(); },
    encrypt: () => { waitingForInput = true; encrypt.execute(); },
    decrypt: () => { waitingForInput = true; decrypt.execute(); },
    exit: () => { 
        process.stdin.pause();
        process.stdin.removeAllListeners('data');
        exit.execute(); 
    }
};

const schedulePrompt = () => {
    setImmediate(() => {
        if (!waitingForInput) {
            process.stdout.write('Donut >> ');
        }
    });
};

const inputHandler = (data) => {
    const input = data.toString().trim();
    
    if (waitingForInput) {
        waitingForInput = false;
        return;
    }
    
    const command = commands[input.toLowerCase()];
    
    if (command) {
        command();
    } else if (input) {
        console.log('Unknown command. Type "help" to see available commands\n');
        schedulePrompt();
    } else {
        schedulePrompt();
    }
};

if (!stdinListenerAttached) {
    process.stdin.on('data', inputHandler);
    stdinListenerAttached = true;
    schedulePrompt();
}