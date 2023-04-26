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
}

export default MyFile;