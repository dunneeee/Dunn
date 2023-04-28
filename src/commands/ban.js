import { Command } from "fca-dunnn";
import { Permission } from "fca-dunnn/src/components/Command";
import BanModel from "../models/ban.model";

class Ban extends Command {
    constructor(dl) {
        super({
            name: "ban",
            author: "Dunn",
            description: "Cấm thành viên sử dụng bot",
            usage: "<prefix>ban <@tag/reply> [time(phút)] : [lý do]",
            permission: Permission.MOD
        }, dl)

        this.model = new BanModel(dl)
    }

    async onCall({event, args}) {
        if(args.length === 1) {
            let flag = args[0]
            if(flag === "list") {
                return await BanModel.getListUserBanOfThreadText(event.threadID);
            }
        }

        let text = args.join(" ");
        let userIds = Object.keys(event.mentions)
        if(userIds.length === 0) {
            if(event.type !== "message_reply") return "❌ @tag hoặc reply tin nhắn của người dùng cần cấm sử dụng bot";
            const {messageReply} = event;
            if(messageReply.senderID === event.senderID) return "❌ Bạn không thể cấm chính mình";
            userIds = [messageReply.senderID]
        }
        const {time, reason} = BanModel.getBanInfo(text)
        if(time === null) return "Vui lòng nhập đúng cú pháp [thời gian][m/h/d/s] : [lý do] (Bắt buộc có \" : \")"
        return await this.model.banUser(userIds, event.threadID, {time,reason,authorID: event.senderID})
    }
}

export default Ban