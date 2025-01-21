const fs = require('fs');
const path = require('path');
const process = require('process');

const writeableStream = fs.createWriteStream(path.join(__dirname, 'output.txt'), { flags: 'a' });

console.log('Hello! Input the text: ');

const handleInput = (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('\nBye!');
    process.exit();
  } else {
    writeableStream.write(input + '\n');
    console.log('Input the text: ');
  }
};

process.stdin.on('data', (data) => {
  const text = data.toString().trim();
  handleInput(text);
});

process.on('SIGINT', () => {
  console.log('\nBye!');
  process.exit();
});

// ＞﹏＜
