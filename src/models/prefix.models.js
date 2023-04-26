import { Action } from "fca-dunnn";
import { Thread } from "../databases";

class PrefixModel extends Action{
    keywords = ["prefix", "setprefix", "help", "bot"]

    async changePrefix(threadID, newPrefix) {
        const thread = await Thread.get(threadID)
        if(!thread) return "Không tồn tại thông tin của nhóm này!"
        const oldPrefix = thread.prefix
        thread.prefix = newPrefix
        await thread.save()
        return `Đã đổi prefix của nhóm này từ ${oldPrefix} thành ${newPrefix}`
    }

    async handleText(event) {
        if(event.type == "message" || event.type == "message_reply") {
            const prefix = await this.hook.getPrefix(event)
            if(!event.body) return null;
            if(event.body.startsWith(prefix)) return null;
            for(let key of this.keywords) {
                if(event.body.toLowerCase().includes(key)) return "Bạn có thể sử dụng lệnh " + prefix + "help để xem danh sách lệnh của bot"
            }
        }
        return null;
    }

}

export default PrefixModel