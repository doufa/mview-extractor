// Import required libraries in correct dependency order
self.importScripts(
    'lib/jszip.min.js',           // Third-party library for ZIP handling
    'lib/binary-reader.js',       // Base utility for binary operations
    'lib/mview-extractor.js',     // MVIEW format specific extractor
    'lib/model-extractor.js',     // General model extraction logic
    'lib/FileProcessor.js'        // Top-level file processing
);

// Store detected models per tab
let detectedModels = {};

// Define supported model formats
const MODEL_TYPES = {
    '.mview': 'mview',
    '.gltf': 'gltf',
    '.glb': 'glb',
    '.obj': 'obj'
};

// Listen for web requests to detect model files
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.type === 'main_frame') {
            // Clear models when navigating to a new page
            detectedModels[details.tabId] = [];
            return;
        }

        const url = details.url.toLowerCase();
        
        // Check for supported model formats
        const matchedFormat = Object.entries(MODEL_TYPES).find(([ext, type]) => url.includes(ext));
        
        if (matchedFormat) {
            if (!detectedModels[details.tabId]) {
                detectedModels[details.tabId] = [];
            }

            // Extract filename from URL
            const filename = url.split('/').pop();
            
            // Add model if it's not already detected
            if (!detectedModels[details.tabId].some(model => model.url === details.url)) {
                detectedModels[details.tabId].push({
                    url: details.url,
                    filename: filename,
                    type: matchedFormat[1]
                });
            }
        }
    },
    { urls: ["<all_urls>"] }
);

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener(function(tabId) {
    delete detectedModels[tabId];
});

// Function to extract mview files
async function extractMview(url) {
    try {
        console.log(url);
        const fileProcessor = new FileProcessor();
        console.log(fileProcessor);
        const { files } = await fileProcessor.processFiles(url);

        // Create a zip file containing all extracted files
        const zip = new JSZip();
        
        for (const file of files) {
            zip.file(file.name, file.data);
        }
        
        // Generate the zip file as an array buffer instead of blob
        const zipBuffer = await zip.generateAsync({type: 'arraybuffer'});
        
        // Convert array buffer to base64
        const base64Data = arrayBufferToBase64(zipBuffer);
        
        // Save the zip file using data URL
        const filename = url.split('/').pop().split('.')[0] + '_extracted.zip';
        chrome.downloads.download({
            url: 'data:application/zip;base64,' + base64Data,
            filename: filename,
            saveAs: true
        });
        
        return { success: true, message: 'Extraction completed successfully' };
    } catch (error) {
        console.error('Error extracting mview:', error);
        return { success: false, error: error.message };
    }
}

// Helper function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Handle messages from popup
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === "getDetectedModels") {
            // Return models for current tab
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0]) {
                    sendResponse({
                        models: detectedModels[tabs[0].id] || []
                    });
                } else {
                    sendResponse({models: []});
                }
            });
            return true; // Will respond asynchronously
        } else if (request.action === "downloadModel") {
            // Download the model file
            chrome.downloads.download({
                url: request.url,
                filename: request.filename,
                saveAs: true
            });
        } else if (request.action === "extractMview") {
            extractMview(request.url)
                .then(result => sendResponse(result))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true; // Will respond asynchronously
        }
    }
);
