import { Command } from "fca-dunnn";
import BsendModel from "../models/bsend.model";
import { Permission } from "fca-dunnn/src/components/Command";

class BSend extends Command {
    
    constructor(dl) {
        super({
            name:"bsend",
            author: "Dunn",
            coolDown: 5000,
            description: "Bật để gửi lại các tin nhắn bị gỡ trong 15p",
            usage: "<prefix>bsend <on/off> - Bật hoặc tắt chế độ gửi lại tin nhắn bị xoá",
            permission: Permission.MOD
        }, dl)
        this.model = new BsendModel(dl)
    }

    async onLoad() {
        await this.model.load();
        return "Đã load các nhóm bật bsend!"
    }

    async onCall({event, args}) {
        const type = args[0]
        if(!type) return this.usage;
        if(type == 'on') {
            if(this.model.isOn(event.threadID)) return "Chế độ gửi lại tin nhắn bị xoá đã bật"
            await this.model.setStatus(event.threadID, true)
            return "Đã bật chế độ gửi lại tin nhắn bị xoá"
        }else if(type == 'off') {
            if(!this.model.isOn(event.threadID)) return "Chế độ gửi lại tin nhắn bị xoá đã tắt"
            await this.model.setStatus(event.threadID, false)
            return "Đã tắt chế độ gửi lại tin nhắn bị xoá"
        }
        else return this.usage;
    }

    async onEvery(event) {
        if(event.type == 'message' || event.type == "message_reply") {
            const isOn = this.model.isOn(event.threadID)
            if(isOn) {
                this.model.addMessage(event.threadID, event)
            }
        }

        if(event.type == 'message_unsend') {
            const isOn = this.model.isOn(event.threadID)
            if(isOn) {
                const message = this.model.getMessage(event.threadID, event.messageID)
                if(message) {
                    const messageObj = await this.model.convertToMessageObject(message)
                    const author = await this.model.getName(message.senderID, event.threadID);
                    messageObj.body = `🔔 Tin nhắn của ${author} đã bị xoá:\n${messageObj.body}`
                    await this.message.reply(messageObj, event.threadID)
                    this.model.removeMessage(event.threadID, message.messageID);
                }
            }
        }
    }
}

export default BSend;