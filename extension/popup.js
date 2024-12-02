document.addEventListener('DOMContentLoaded', function() {
    // Query the active tab to get detected models
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.runtime.sendMessage({action: "getDetectedModels", tabId: tabs[0].id}, function(response) {
            updateModelList(response.models || []);
        });
    });
});

function updateModelList(models) {
    const modelList = document.getElementById('modelList');
    
    if (models.length === 0) {
        modelList.innerHTML = '<div class="no-models">No 3D models detected on this page</div>';
        return;
    }

    modelList.innerHTML = '';
    models.forEach(model => {
        const modelItem = document.createElement('div');
        modelItem.className = 'model-item';
        
        const modelInfo = document.createElement('div');
        modelInfo.className = 'model-info';
        
        const fileName = document.createElement('div');
        fileName.className = 'file-name';
        fileName.textContent = model.filename;
        
        const fileType = document.createElement('div');
        fileType.className = 'file-type';
        fileType.textContent = model.type || getFileExtension(model.filename);
        
        modelInfo.appendChild(fileName);
        modelInfo.appendChild(fileType);
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.textContent = 'Download';
        downloadBtn.onclick = () => {
            chrome.runtime.sendMessage({
                action: "downloadModel",
                url: model.url,
                filename: model.filename
            });
        };
        
        buttonContainer.appendChild(downloadBtn);
        
        // Add extract button for mview files
        if (model.filename.toLowerCase().endsWith('.mview')) {
            const extractBtn = document.createElement('button');
            extractBtn.className = 'extract-btn';
            extractBtn.textContent = 'Extract';
            extractBtn.onclick = () => {
                extractBtn.disabled = true;
                extractBtn.textContent = 'Extracting...';
                chrome.runtime.sendMessage({
                    action: "extractMview",
                    url: model.url
                }, response => {
                    extractBtn.disabled = false;
                    extractBtn.textContent = 'Extract';
                    if (!response.success) {
                        alert('Extraction failed: ' + response.error);
                    }
                });
            };
            buttonContainer.appendChild(extractBtn);
        }

        modelItem.appendChild(modelInfo);
        modelItem.appendChild(buttonContainer);
        modelList.appendChild(modelItem);
    });
}

function getFileExtension(filename) {
    return filename.split('.').pop().toUpperCase();
}
