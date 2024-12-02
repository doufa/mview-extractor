const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// Configuration for obfuscation
const obfuscatorConfig = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: true,
    debugProtectionInterval: 2000,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    rotateStringArray: true,
    selfDefending: true,
    shuffleStringArray: true,
    splitStrings: true,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false
};

// Files to obfuscate
const filesToObfuscate = [
    'extension/background.js',
    'extension/popup/popup.js'
    // Add other JS files here
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

// Create popup directory in dist/extension
const distPopupDir = path.join(distExtDir, 'popup');
if (!fs.existsSync(distPopupDir)) {
    fs.mkdirSync(distPopupDir);
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
    'extension/popup/popup.html',
    'extension/popup/popup.css',
    // Add other non-JS files here
];

filesToCopy.forEach(file => {
    const sourcePath = path.join(__dirname, file);
    const distPath = path.join(distDir, file);
    
    if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, distPath);
    }
});
