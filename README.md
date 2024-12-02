# MView Extractor

A browser extension for extracting and downloading MView files from websites. This project is inspired by and extends the functionality of [mviewer](https://github.com/majimboo/mviewer), a Python library for parsing MView files.

## Overview

MView Extractor is a browser extension that allows users to easily download MView files encountered while browsing. It integrates directly into your browser, providing a seamless experience for handling MView content.

## Features

- Automatic detection of MView files on webpages
- One-click download of MView content
- Browser extension integration
- Background processing of MView data
- Support for various MView file formats

## Installation

1. Clone this repository
2. Load the extension in your browser:
   - Open your browser's extension management page
   - Enable Developer Mode
   - Click "Load unpacked" and select the extension directory

## Usage

1. Browse to a webpage containing MView content
2. Click the extension icon when MView content is detected
3. Choose your download options
4. The MView file will be processed and downloaded automatically

## Project Structure

```
mview-extractor/
├── extension/           # Browser extension files
│   ├── background.js   # Background script for processing
│   ├── manifest.json   # Extension manifest
│   └── popup/         # Extension popup interface
├── docs/              # Documentation
└── README.md         # This file
```

## Technical Details

The extension works by:
1. Detecting MView content in web pages
2. Processing the content using specialized algorithms
3. Converting the data into a downloadable format
4. Handling the browser download process

## Building for Production

To build the extension for production and Chrome Web Store submission:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the production version:
   ```bash
   npm run build
   ```

3. Package the extension:
   ```bash
   npm run package
   ```

This will create:
- A `dist` folder with the obfuscated code
- A `mview-extractor.zip` file ready for Chrome Web Store submission

The production build includes:
- Obfuscated JavaScript code
- Minified resources
- Protection against code inspection
- Optimized performance

## Credits

This project builds upon the work done in [mviewer](https://github.com/majimboo/mviewer), a Python library for parsing MView files. The original mviewer project provides the foundational understanding of MView file formats and parsing techniques.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support the Project

If you find this project helpful, consider buying me a coffee! ☕

<a href="https://www.buymeacoffee.com/doufa" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="50">
</a>

## License

MIT License

Copyright (c) 2024 MView Extractor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
