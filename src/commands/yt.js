import * as dotenv from 'dotenv'
import Sing from './sing'
import YtModel from '../models/yt.model';
dotenv.config()
class Yt extends Sing {
    constructor(dl) {
       super(dl, {
        name: "yt",
        description: "Xem video trên youtube - (Khó gửi video)",
        author: "Dunnn",
        coolDown: 15000,
        usage: "<prefix>yt <tên video>"
    });
    this.model = new YtModel(dl, {api: process.env.YOUTUBE_API, maxResult: 6})
    }
}



export default Yt