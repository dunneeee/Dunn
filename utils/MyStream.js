import axios from "axios"
import MyFile from "./MyFile"
import {join} from 'path'
class MyStream {
    /**
     * 
     * @param {string} url 
     * @param {string} filename 
     * @returns {Promise<MyFile>}
     */
    static async getStream(url, filename) {
        return new Promise((reslove, reject) => {
            const file = new MyFile(join(__dirname, "../temp/" + filename))
            if(!file.existsDir()) file.createDir();
            const stream = file.getWriteStream()
            axios.get(url, {responseType: 'stream'}).then((response) => {
                response.data.pipe(stream)
                stream.on('finish', () => {
                    reslove(file)
                })
                .on("error", (e) => {
                    reject(e)
                })
            }).catch(e => {
                reject(e)
            })
        })
    }
}

export default MyStream