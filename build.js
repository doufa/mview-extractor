const { minify } = require('terser');
const fs = require('fs');
const path = require('path');

// Configuration for minification
const minifyConfig = {
    compress: {
        dead_code: true,
        drop_console: false,
        drop_debugger: true,
        passes: 2
    },
    mangle: {
        reserved: ['chrome', 'self']
    },
    format: {
        comments: false
    }
};

// Files to minify
const filesToMinify = [
    'extension/lib/binary-reader.js',
    'extension/lib/FileProcessor.js',
    'extension/lib/jszip.min.js',
    'extension/lib/model-extractor.js',
    'extension/lib/mview-extractor.js',
    'extension/popup.js',
    'extension/background.js'
];

// Create dist directory
const distDir = path.join(__dirname, 'dist');
const distExtDir = path.join(distDir, 'extension');
const distLibDir = path.join(distExtDir, 'lib');
const distIconsDir = path.join(distExtDir, 'icons');

// Function to clear directory recursively
function clearDirectory(directory) {
    if (fs.existsSync(directory)) {
        fs.readdirSync(directory).forEach((file) => {
            const currentPath = path.join(directory, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
                clearDirectory(currentPath);
                fs.rmdirSync(currentPath);
            } else {
                fs.unlinkSync(currentPath);
            }
        });
    }
}

// Copy and minify files
async function processFiles() {
    for (const file of filesToMinify) {
        const sourceCode = fs.readFileSync(path.join(__dirname, file), 'utf8');
        const minified = await minify(sourceCode, minifyConfig);
        
        const distPath = path.join(distDir, file);
        fs.writeFileSync(distPath, minified.code);
    }
}

// Copy other necessary files (manifest.json, images, CSS, etc.)
const filesToCopy = [
    'extension/manifest.json',
    'extension/popup.html',
    'extension/icons/icon16.png',
    'extension/icons/icon48.png',
    'extension/icons/icon128.png'
];

// Main build process
async function build() {
    // Clear dist directory if it exists
    clearDirectory(distDir);

    // Create directories
    [distDir, distExtDir, distLibDir, distIconsDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    });

    // Process files
    await processFiles();

    // Copy static files
    filesToCopy.forEach(file => {
        const sourcePath = path.join(__dirname, file);
        const distPath = path.join(distDir, file);
        
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, distPath);
        }
    });
}

// Run the build
build().catch(console.error);
