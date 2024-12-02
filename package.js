const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const output = fs.createWriteStream('dist/mview-extractor.zip');
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level
});

output.on('close', () => {
    console.log('Extension has been packaged successfully!');
    console.log(`Total bytes: ${archive.pointer()}`);
});

archive.on('error', (err) => {
    throw err;
});

archive.pipe(output);

// Add the dist/extension directory contents to the zip
archive.directory('dist/extension/', false);

archive.finalize(); 