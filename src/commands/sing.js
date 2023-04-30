import { Command } from "fca-dunnn";
import * as dotenv from 'dotenv'
import SingModel from "../models/sing.model";
dotenv.config()
class Sing extends Command {
    constructor(dl, config) {
        super(config ? config : {
            name: "sing",
            description: "Nghe nhạc trên youtube",
            author: "Dunnn",
            coolDown: 15000,
            usage: "<prefix>sing <tên bài hát>"
        }, dl)
        this.model = new SingModel(dl, {api: process.env.YOUTUBE_API, maxResult: 6})
    }
    async onCall({event, args}) {
        const query = args.join(" ")
        if(!query) return this.usage.replace("<prefix>", await this.hook.getPrefix(event));
        const {msg, list} = await this.model.search({query})
        if(!list || !list.length) return msg;
        const info = await this.message.reply(msg, event.threadID, event.messageID)
        this.messageTemp.add({
            command: this,
            messageID: info.messageID,
            type: "message_reply",
            author: event.senderID,
            action: "search",
            data: list
        })
        return;
    }

    async onReply({event, args}, temp) {
        const {action, data} = temp;
        if(action == "search") {
            let index = parseInt(args[0])
            if(isNaN(index) || index < 1 || index > data.length) return "Vui lòng nhập số từ 1 đến " + data.length;
            index--;
            const audio = data[index]
            await this.api.unsendMessage(temp.messageID)
            const idTimeOut = setTimeout(() => {
                this.message.reply("🌍 Mạng đang nghẽn, vui lòng chờ...", event.threadID, event.messageID)
            }, 30*1000)
            const res = await this.message.reply("🔃 Đang xử lý...", event.threadID, event.messageID)
            const messageObj = await this.model.getMessageObject(audio)
            clearTimeout(idTimeOut);
            await this.api.unsendMessage(res.messageID)
            temp.delete()
            return messageObj;
        }
    }
}

export default Sing