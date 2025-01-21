const fs = require('fs');
const path = require('path');

const projectDistDir = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const outputHTMLFile = path.join(projectDistDir, 'index.html');
const outputCSSFile = path.join(projectDistDir, 'style.css');
const assetsDir = path.join(__dirname, 'assets');

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

const writeFile = (filePath, data, callback) => {
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

// 04
const copyDirectory = (src, dest) => {
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

const replaceTemplate = async (template) => {
  const regex = /{{(\w+)}}/g;
  const matches = template.match(regex);
  if (!matches) return template;

  for (const match of matches) {
    const componentName = match.replace(/{{|}}/g, '').trim();
    const componentFile = path.join(componentsDir, `${componentName}.html`);
    try {
      const componentContent = await readFile(componentFile);
      template = template.replace(match, componentContent);
    } catch (err) {
      console.log(err);
    }
  }
  return template;
};

// 05
const mergeStyles = async () => {
  fs.unlink(outputCSSFile, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.log(err);
      return;
    }

    fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.log(err);
        return;
      }

      const writeableStream = fs.createWriteStream(outputCSSFile);
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


const build = async () => {
  try {

    fs.mkdir(projectDistDir, { recursive: true }, (err) => {
      if (err) {
        console.log(err);
        return;
      }
    })


    const template = await readFile(templateFile);
    const resultHTML = await replaceTemplate(template);

    await writeFile(outputHTMLFile, resultHTML, (err) => {
      if (err) {
        console.log(err);
      }
    });


    await mergeStyles();
    await copyDirectory(assetsDir, path.join(projectDistDir, 'assets'));

    console.log('Готово');
  } catch (err) {
    console.log(err);
  }
};

build();
