import { Command } from "fca-dunnn";
import { Permission } from "fca-dunnn/src/components/Command";
import { Thread, User } from "../databases";

class Noti extends Command {
    constructor(dl) {
        super({
            name: "noti",
            author: "Dunnn",
            coolDown: 5000,
            description: "Gửi thông báo đến nhóm",
            permission: Permission.ADMIN,
            usage: "<prefix>noti <uid> <nội dung>"
        }, dl)
    }

    async onCall({event, args}) {
        const uid = args[0];
        const content = args.slice(1).join(" ");
        if(!uid || !content) return this.usage.replace("<prefix>", await this.hook.getPrefix(event));
        if(isNaN(uid)) return "Vui lòng nhập uid là số";
        const info = await Thread.get(uid);
        const admin = await User.get(event.senderID, event.threadID);
        if(!info) return "Không tìm thấy nhóm trong database";
        if(!admin) return "Không tìm thấy thông tin của bạn trong database";
        let msg = ""
        msg += "📢 Thông báo từ admin\n"
        msg += this.line + "\n"
        msg += "👉 " + content + "\n"
        msg += "👤 Người gửi: " + admin.name + "\n"
        msg += this.line + "\n"
        msg += "📃 Reply tin nhắn này để trả lời, có tác dụng trong 5 phút\n"
        const resInfo = await this.message.reply(msg, info.id);
        if(!resInfo) return "Không thể gửi thông báo đến nhóm này";
        this.messageTemp.add({
            command: this,
            messageID: resInfo.messageID,
            type: "message_reply",
            action: "reply",
            data: event.threadID
        })
        return "Đã gửi thông báo đến nhóm " + info.name;
    }

    async onReply({event, args}, temp) {
        const {action, data: reciver} = temp;
        if(action == "reply") {
            let message = ""
            message += "📢 Phản hồi\n",
            message += this.line + "\n"
            message += "👉 " + args.join(" ") + "\n"
            message += "👤 Người gửi: " + (await User.get(event.senderID, event.threadID))?.name  + " - " + event.senderID + "\n"
            message += this.line + "\n"
            message += "📃 Reply tin nhắn này để trả lời, có tác dụng trong 5 phút\n"
            const res = await this.message.reply(message, reciver);
            if(!res) return "Không thể gửi phản hồi đến admin này!";
            this.messageTemp.add({
                command: this,
                messageID: res.messageID,
                type: "message_reply",
                action: "admin_reply",
                data: event.threadID
            })
        }
    }
}

export default Noti;