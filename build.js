const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// Configuration for obfuscation
const obfuscatorConfig = {
    compact: true,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    debugProtection: false,
    debugProtectionInterval: 2000,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    rotateStringArray: true,
    selfDefending: false,
    shuffleStringArray: true,
    splitStrings: true,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    transformObjectKeys: false,
    unicodeEscapeSequence: false,
    reservedNames: ['chrome', 'self']
};

// Files to obfuscate (only obfuscate library files that contain sensitive logic)
const filesToObfuscate = [
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
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Create extension directory in dist
const distExtDir = path.join(distDir, 'extension');
if (!fs.existsSync(distExtDir)) {
    fs.mkdirSync(distExtDir);
}

const distLibDir = path.join(distExtDir, 'lib');
if (!fs.existsSync(distLibDir)) {
    fs.mkdirSync(distLibDir);
}

const distIconsDir = path.join(distExtDir, 'icons');
if (!fs.existsSync(distIconsDir)) {
    fs.mkdirSync(distIconsDir);
}

// Copy and obfuscate files
filesToObfuscate.forEach(file => {
    const sourceCode = fs.readFileSync(path.join(__dirname, file), 'utf8');
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(sourceCode, obfuscatorConfig).getObfuscatedCode();
    
    const distPath = path.join(distDir, file);
    fs.writeFileSync(distPath, obfuscatedCode);
});

// Copy other necessary files (manifest.json, images, CSS, etc.)
const filesToCopy = [
    'extension/manifest.json',
    'extension/popup.html',
    'extension/icons/icon16.png',
    'extension/icons/icon48.png',
    'extension/icons/icon128.png'
];

filesToCopy.forEach(file => {
    const sourcePath = path.join(__dirname, file);
    const distPath = path.join(distDir, file);
    
    if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, distPath);
    }
});
