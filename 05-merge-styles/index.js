const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

const mergeStyles = async () => {
  fs.unlink(outputFile, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.log(err);
      return;
    }

    fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.log(err);
        return;
      }

      const writeableStream = fs.createWriteStream(outputFile);
      files.forEach(file => {
        if (path.extname(file.name) === '.css') {
          const filePath = path.join(stylesDir, file.name);
          const readableStream = fs.createReadStream(filePath);
          readableStream.pipe(writeableStream, { end: false });

          readableStream.on('end', () => {
            writeableStream.write('\n');
          });

          readableStream.on('error', (err) => {
            console.log(err);
          });
        }
      });

      writeableStream.on('error', (err) => {
        console.log(err);
      });
    });
  });
};

mergeStyles();

// 😲
