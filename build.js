const esbuild = require('esbuild');
const { writeFile } = require('fs').promises;
const isDev = process.env.NODE_ENV === 'development';

function niceBytes(x) {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let l = 0,
    n = parseInt(x, 10) || 0;
  while (n >= 1024 && ++l) {
    n = n / 1024;
  }
  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
}

function writeToHTML(result, watching) {
  writeFile(
    'dist/ui.html',
    `<style>${result.outputFiles[1].text}</style><div id="root"></div><script>${result.outputFiles[0].text}</script>`
  );
  if (!watching) {
    const outputs = result.metafile.outputs;
    const scriptSource = Object.keys(outputs)[0];
    const cssSource = Object.keys(outputs)[1];
    const scriptOutput = outputs[scriptSource];
    const cssOutput = outputs[cssSource];
    const fileSize = niceBytes(scriptOutput.bytes + cssOutput.bytes);
    console.log(
      '  dist/\x1b[1mui.html  ' + '\x1b[0m' + '\x1b[36m' + fileSize + '\x1b[0m'
    );
  }
  if (isDev) console.log(`[watch] build finished, watching for changes...`);
}

// bundling for code.js
esbuild
  .build({
    entryPoints: ['src/widget/code.tsx'],
    bundle: true,
    minify: !isDev,
    target: ['es6'],
    loader: { '.svg': 'text', '.png': 'dataurl' },
    outfile: 'dist/code.js',
    metafile: true,
    watch: isDev && {
      onRebuild(error, result) {
        if (error) console.error('watch build failed:', error);
        else console.log(`[watch] build finished, watching for changes...`);
      },
    },
  })
  .then((result) => {
    const metafile = result.metafile;
    const outputSource = Object.keys(metafile.outputs)[0];
    const output = metafile.outputs[outputSource];
    const fileSize = niceBytes(output.bytes);
    console.log(
      '  dist/\x1b[1mcode.js  ' + '\x1b[0m' + '\x1b[36m' + fileSize + '\x1b[0m'
    );
  })
  .catch(() => process.exit(1));

// bundling for ui.html
esbuild
  .build({
    entryPoints: ['src/ui/App.tsx'],
    bundle: true,
    loader: { '.svg': 'text', '.png': 'dataurl' },
    minify: !isDev,
    write: false,
    outdir: 'dist/',
    metafile: true,
    watch: isDev && {
      onRebuild(error, result) {
        if (error) console.error('watch build failed:', error);
        else writeToHTML(result, true);
      },
    },
  })
  .then((result) => {
    writeToHTML(result, false);
  })
  .catch(() => process.exit(1));
