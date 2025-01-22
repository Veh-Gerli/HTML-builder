const fs = require('fs');
const path = require('path');

const copyDir = async () => {
  const source = path.join(__dirname, 'files');
  const targer = path.join(__dirname, 'files-copy');

  copyDirectory(source, targer);
};

const copyDirectory = async (src, dest) => {


  await fs.promises.rm(dest, { recursive: true, force: true });

  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
      return;
    }

    fs.readdir(src, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.log(err);
        return;
      }

      files.forEach(file => {
        const source = path.join(src, file.name);
        const targer = path.join(dest, file.name);

        if (file.isFile()) {
          fs.copyFile(source, targer, (err) => {
            if (err) {
              console.log(err);
              return;
            }
          });
        } else if (file.isDirectory()) {
          copyDirectory(source, targer);
        }
      });
    });
  });
};

copyDir();
