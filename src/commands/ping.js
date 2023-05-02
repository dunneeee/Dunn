import { Command } from "fca-dunnn";
import { Permission } from "fca-dunnn/src/components/Command";

class Ping extends Command {
    constructor(dl) {
        super({
            name: "ping",
            description: "Tag tất cả thành viên trong nhóm",
            usage: "<prefix>ping",
        }, dl)
    }

    async onCall({event}) {
        let message = "@all";
        try {
            const info = await this.api.getThreadInfo(event.threadID);
            const ids = info.participantIDs;
            const mentions = []
            for(let id of ids) {
                mentions.push({tag: message, id})
            }
            if(mentions.length > 0) {
               await this.api.sendMessage({body: message, mentions}, event.threadID, event.messageID)
               return;
            }
            return "Lỗi không xác định!"
        }catch(e) {
            return "Không thể lấy thông tin nhóm!"
        }
    }
}

export default Ping