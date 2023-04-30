import { Command } from "fca-dunnn";
import UnsendModel from "../models/unsend.model";

class Unsend extends Command {
    constructor(dl) {
        super({
        name: "unsend",
        description: "xoá tin nhắn của bot gửi đi!",
        author: "Dunn",
        usage: "\n<prefix>unsend(reply tin nhắn của bot)\n <prefix>unsend <onlymod/-om> [true/false] Bật chế độ chỉ có admin nhóm mới được gỡ tin nhắn!"            
        }, dl)
        this.model = new UnsendModel(dl)
    }

    async onCall({event, args}) {
        if(args.length) {
            const [key, value] = args;
            const isMod = await this.model.isMod(event.senderID, event.threadID);
            if(!isMod) return "Bạn không phải là quản trị viên nhóm không thể dùng lệnh này";
            return await this.model.handleSettings(key, value, event.threadID);
        }
        const onlyMod = await this.model.onlyMod(event.threadID);
        if(onlyMod)  {
            const isMod = await this.model.isMod(event.senderID, event.threadID);
            if(!isMod) return "Chế độ onlyMod đang bật, chỉ có quản trị viên nhóm mới có thể dùng lệnh này";
        }
        if(!event.messageReply) return "Vui lòng reply tin nhắn của bot";
        if(!event.messageReply.senderID == this.account.id) return "Không thể xoá tin nhắn của người khác";
        await this.api.unsendMessage(event.messageReply.messageID);
    }
}

export default Unsend;