import fs from 'fs'
import path from 'path';
class MyFile {
    constructor(path) {
        this.path = path;
    }

    exists() {
        return fs.existsSync(this.path)
    }

    existsDir() {
        return fs.existsSync(path.dirname(this.path))
    }

    createDir() {
        fs.mkdirSync(path.dirname(this.path), {recursive: true});
    }

    read() {
        return fs.readFileSync(this.path, 'utf8');
    }

    readJson() {
        return JSON.parse(this.read());
    }

    getReadStream() {
        return fs.createReadStream(this.path);
        
    }

    getWriteStream() {
        return fs.createWriteStream(this.path);
    }

    write(data) {
        return fs.writeFileSync(this.path, data, 'utf-8');
    }

    dispose() {
        fs.unlinkSync(this.path);
    }

    getFileSize(type) {
        const stats = fs.statSync(this.path);
        const fileSizeInBytes = stats.size;
        switch (type) {
            case 'KB':
                return fileSizeInBytes / 1024;
            case 'MB':
                return fileSizeInBytes / (1024 * 1024);
            case 'GB':
                return fileSizeInBytes / (1024 * 1024 * 1024);
            default:
                return fileSizeInBytes;
        }
    }

    static createRandomName(ext) {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + ext;
    }
}

export default MyFile;