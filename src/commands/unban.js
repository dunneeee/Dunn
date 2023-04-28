import { Command } from "fca-dunnn";
import { Permission } from "fca-dunnn/src/components/Command";
import BanModel from "../models/ban.model";

class Unban extends Command {
    constructor(dl) {
        super({
            name: "unban",
            description: "Bỏ cấm thành viên sử dụng bot",
            author: "Dunn",
            coolDown: 5000,
            permission: Permission.MOD,
            usage: "<prefix>unban <@tag/reply>"
        }, dl)
        this.model = new BanModel(dl);
    }

    async onCall({event, args}) {
        const userIds = Object.keys(event.mentions);
        if(userIds.length === 0) {
            if(event.type !== "message_reply") return "❌ @tag hoặc reply tin nhắn của người dùng cần bỏ cấm sử dụng bot";
            const {messageReply} = event;
            if(messageReply.senderID === event.senderID) return "❌ Bạn không thể bỏ cấm chính mình";
            userIds = [messageReply.senderID]
        }
        return await this.model.unbanUser(userIds, event.threadID)
    }
}

export default Unban;