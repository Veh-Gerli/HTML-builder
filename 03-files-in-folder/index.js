const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  }
  else {
    files.forEach(file => {
      if (file.isFile()) {
        const filePath = path.join(path.join(__dirname, 'secret-folder'), file.name);

        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.log(err);
          }
          else {
            const size = stats.size / 1024;

            // Извлекаем имя файла и расширение
            const [name, extension] = file.name.split('.');
            console.log(`${name} - ${extension} - ${size}kb`);
          }
        });
      }

    });
  }
});

// надо ли проверять наличие файлов в подпапках, хмм (ㆆ_ㆆ)