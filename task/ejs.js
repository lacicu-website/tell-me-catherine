'use strict';

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const { globSync } = require('glob');
const beautify = require('js-beautify');

const srcDir = `${process.cwd()}/src/ejs`;
const distDir = `${process.cwd()}/src/html`;

const dataList = [
  {
    name: 'pageData',
    path: `${process.cwd()}/src/ejs/page-data.json`,
  },
  {
    name: 'links',
    path: `${process.cwd()}/src/ejs/links.json`,
  },
];

const dataObj = {};
dataList.forEach((item) => {
  dataObj[item.name] = JSON.parse(fs.readFileSync(item.path, 'utf-8'));
});
const rootPath = `${process.cwd()}/src/ejs`;

// options
// https://www.npmjs.com/package/js-beautify
const beautifyOptions = {
  indent_size: 2,
  indent_char: ' ',
  end_with_newline: true,
  preserve_newlines: false,
  max_preserve_newlines: 0,
  wrap_line_length: 0,
  wrap_attributes_indent_size: 0,
  unformatted: ['b', 'em'],
};

const convert = (fileName, srcDir, distDir) => {
  ejs.renderFile(path.resolve(srcDir, fileName), { rootPath, ...dataObj }, (err, str) => {
    if (err) {
      // 変換に失敗したら終了コードを1にして、後続のwebpackビルドを止める
      console.error(err);
      process.exitCode = 1;
      return;
    }

    const distPath = path.resolve(distDir, fileName);
    fs.mkdirSync(path.dirname(distPath), { recursive: true });
    const htmlPath = path.format({
      dir: path.dirname(distPath),
      name: path.basename(distPath, '.ejs'),
      ext: '.html',
    });
    const formatted = beautify.html(str, beautifyOptions);
    fs.writeFileSync(htmlPath, formatted);
  });
};

const files = globSync('**/*.ejs', {
  cwd: srcDir,
  ignore: '**/_*.ejs',
});
for (const fileName of files) {
  convert(fileName, srcDir, distDir);
}
