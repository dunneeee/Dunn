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
        await this.message.reply(msg, info.id);
        return "Đã gửi thông báo đến nhóm " + info.name;
    }
}

export default Noti;