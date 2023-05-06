import { Action } from "fca-dunnn";
import AdminTableTime from "./AdminTableTime.model";
import * as dotnev from "dotenv";
dotnev.config()
class TkbModel extends Action{
    constructor(dl) {
        super(dl)
        this.tkb = new AdminTableTime(process.env.VKU_COOKIE)
    }

    async init() {
        await this.tkb.init()
    }

    async getTkb(day) {
        const data = typeof day === 'undefined' ? this.tkb.getNow() : this.tkb.getDay(day) 
        const time = data.time
        const datas = data.datas
        if(datas.every(e => e.lesson === 0)) return "Hôm nay không có tiết nào cả"
        return this.handleText(datas, time)            

    }

    handleText(datas, time) {
        let text = ""
        text += `📒 Thời khoá biểu ${time.day} ${time.dd}/${time.mm}/${time.yyyy}\n`
        for(let i = 0; i < datas.length; ++i) {
            const e = datas[i]
            if(e.lesson === 0) continue
            text += `📌 ${e.lessonName} (${e.start.h}:${e.start.m})\n`
            text += `🔹 Môn ${e.name}\n`
            text += `🔸 Phòng ${e.room}\n`
            text += this.line + "\n"
        }
        return text
    }
}

export default TkbModel;