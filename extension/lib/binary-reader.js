class BinaryReader {
    constructor(buffer) {
        this.buffer = buffer;
        this.view = new DataView(buffer.buffer || buffer);
        this.position = 0;
    }

    readUInt32() {
        const value = this.view.getUint32(this.position, true);
        this.position += 4;
        return value;
    }

    readCString() {
        const buf = [];
        while (true) {
            const b = this.view.getInt8(this.position++);
            if (b === 0) {
                return String.fromCharCode(...buf);
            }
            buf.push(b);
        }
    }

    read(length) {
        const result = new Uint8Array(this.buffer.slice(this.position, this.position + length));
        this.position += length;
        return result;
    }
}

self.BinaryReader = BinaryReader; 