class MViewExtractor {
    constructor() {
        this.folder = '';
    }

    async extract(input) {
        this.folder = input instanceof File ? 
            input.name.split('.')[0] : 
            input.split('/').pop().split('.')[0];

        const bin = await this.load(input);
        const reader = new BinaryReader(bin);
        
        const extractedFiles = [];
        
        while (reader.position < bin.length) {
            const name = reader.readCString();
            const ftype = reader.readCString();
            const c = reader.readUInt32();
            const d = reader.readUInt32();
            const e = reader.readUInt32();

            let data = reader.read(d);

            if (c & 1) {
                data = this.decompress(data, e);
            }

            extractedFiles.push({
                name: name,
                type: ftype,
                data: data
            });
            
            console.log(name, ftype);
        }

        console.log("COMPLETED!!!");
        return extractedFiles;
    }

    async load(input) {
        if (input instanceof File) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(new Uint8Array(reader.result));
                reader.onerror = reject;
                reader.readAsArrayBuffer(input);
            });
        } else {
            const response = await fetch(input);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const buffer = await response.arrayBuffer();
            return new Uint8Array(buffer);
        }
    }

    decompress(a, b) {
        const c = new Uint8Array(b);
        let d = 0;
        const e = new Array(4096).fill(0);
        const f = new Array(4096).fill(0);
        let g = 256;
        const h = a.length;
        let k = 0;
        let l = 1;
        let m = 0;
        let n = 1;

        c[d] = a[0];
        d++;

        let r = 1;
        while (true) {
            n = r + (r >> 1);
            if ((n + 1) >= h) break;
            
            m = a[n + 1];
            n = a[n];
            let p = (r & 1) ? (m << 4 | n >> 4) : ((m & 15) << 8 | n);
            
            if (p < g) {
                if (256 > p) {
                    m = d;
                    n = 1;
                    c[d] = p;
                    d++;
                } else {
                    m = d;
                    n = f[p];
                    p = e[p];
                    let q = p + n;
                    while (p < q) {
                        c[d] = c[p];
                        d++;
                        p++;
                    }
                }
            } else if (p === g) {
                m = d;
                n = l + 1;
                p = k;
                let q = k + l;
                while (p < q) {
                    c[d] = c[p];
                    d++;
                    p++;
                }
                c[d] = c[k];
                d++;
            } else {
                break;
            }

            e[g] = k;
            f[g] = l + 1;
            g++;
            k = m;
            l = n;
            g = 4096 <= g ? 256 : g;
            r++;
        }

        return d === b ? c : null;
    }
}

self.MViewExtractor = MViewExtractor; 