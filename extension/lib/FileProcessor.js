class FileProcessor {
    constructor() {}
    async processFiles(input) {
        const extractor = new MViewExtractor();
        const files = await extractor.extract(input);
        
        const modelExtractor = new ModelExtractor();
        
        // Find and parse scene.json
        const sceneFile = files.find(f => f.name === 'scene.json');
        if (!sceneFile) {
            throw new Error('scene.json not found in MVIEW file');
        }

        const modelFiles = await modelExtractor.extract(files, sceneFile);

        // Combine all files
        return {
            files: [
                modelFiles.materialFile,
                ...modelFiles.meshFiles,
                ...files
            ],
            modelFiles,
            sceneFile
        };
    }
} 

self.FileProcessor = FileProcessor;