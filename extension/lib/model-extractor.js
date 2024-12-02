class ModelExtractor {
    constructor() {
        this.materials = [];
        this.meshes = [];
    }

    async extract(files, sceneData) {
        // Parse scene data from binary
        const decoder = new TextDecoder();
        const data = JSON.parse(decoder.decode(sceneData.data));
        
        console.log('sceneData.data', data);
        // Extract materials
        const materialFile = await this.extractMaterials(data.materials);
        
        // Extract meshes using the provided binary data
        const meshFiles = await Promise.all(data.meshes.map(mesh => {
            // Find corresponding mesh file in extracted files
            const meshData = files.find(f => f.name === mesh.file);
            console.log('meshData', meshData);
            return this.extractMesh(mesh, meshData);
        }));

        return {
            materialFile,
            meshFiles
        };
    }

    async extractMaterials(materials) {
        let mtlContent = '';
        
        for (const mat of materials) {
            const name = mat.name;
            const diffuse = mat.albedoTex;
            // const specular = mat.extrasTex;

            // write to mtl content
            mtlContent += `newmtl ${name}\n`;
            mtlContent += `map_Ka ${diffuse}\n`;
            mtlContent += `map_Kd ${diffuse}\n`;
            // mtlContent += `map_Ks ${specular}\n\n`;
        }

        return {
            name: 'master.mtl',
            data: mtlContent,
            type: 'text'
        };
    }

    async extractMesh(mesh, meshData) {
        const name = mesh.name;
        const wireCount = mesh.wireCount;
        const indexCount = mesh.indexCount;
        const vertexCount = mesh.vertexCount;
        
        const texCoord2 = mesh.secondaryTexCoord || 0;
        const vertexColor = mesh.vertexColor || 0;
        const indexTypeSize = mesh.indexTypeSize;
        
        // Calculate stride
        let stride = 32;
        if (vertexColor > 0) stride += 4;
        if (texCoord2 > 0) stride += 8;

        // Use the binary data directly instead of fetching
        const dataView = new DataView(meshData.data.buffer);
        let offset = 0;

        // Lists for mesh data
        const faceList = [];
        const vertList = [];
        const uvList = [];
        const materialsList = [];

        // Process submeshes
        for (const subMesh of mesh.subMeshes) {
            const faces = [];
            const material = subMesh.material;
            const indexCount2 = subMesh.indexCount;
            const wireCount2 = subMesh.wireIndexCount;

            let faceCount = Math.floor((indexCount2 * indexTypeSize) / 6);
            if (indexTypeSize === 4) {
                faceCount = Math.floor((indexCount2 * indexTypeSize) / 12);
            }

            // Read faces
            for (let f = 0; f < faceCount; f++) {
                if (indexTypeSize === 2) {
                    faces.push([
                        dataView.getUint16(offset, true),
                        dataView.getUint16(offset + 2, true),
                        dataView.getUint16(offset + 4, true)
                    ]);
                    offset += 6;
                } else {
                    faces.push([
                        dataView.getUint32(offset, true),
                        dataView.getUint32(offset + 4, true),
                        dataView.getUint32(offset + 8, true)
                    ]);
                    offset += 12;
                }
            }

            faceList.push(faces);
            materialsList.push(material);
        }

        // Skip wire data
        offset += wireCount * indexTypeSize;

        // Read vertices
        for (let v = 0; v < vertexCount; v++) {
            // Position
            const pos = [
                dataView.getFloat32(offset, true),
                dataView.getFloat32(offset + 4, true),
                dataView.getFloat32(offset + 8, true)
            ];
            // Texcoord
            const texpos = [
                dataView.getFloat32(offset + 12, true),
                dataView.getFloat32(offset + 16, true)
            ];

            vertList.push(pos);
            uvList.push(texpos);
            offset += stride;
        }

        // Generate OBJ content
        let objContent = 'mtllib master.mtl\n\n';

        // Write vertices
        for (const vert of vertList) {
            objContent += `v ${vert[0]} ${vert[1]} ${vert[2]}\n`;
        }

        // Write texture coordinates
        for (const uv of uvList) {
            objContent += `vt ${uv[0]} ${uv[1]}\n`;
        }

        // Write faces
        for (let i = 0; i < faceList.length; i++) {
            objContent += `\ng ${name}\n`;
            objContent += `usemtl ${materialsList[i]}\n`;

            for (const face of faceList[i]) {
                objContent += `f ${face[0]+1}/${face[0]+1}/${face[0]+1} ${face[1]+1}/${face[1]+1}/${face[1]+1} ${face[2]+1}/${face[2]+1}/${face[2]+1}\n`;
            }
        }

        console.log('objContent', objContent);
        return {
            name: `${mesh.file}.obj`,
            data: objContent,
            type: 'text'
        };
    }
}

self.ModelExtractor = ModelExtractor; 