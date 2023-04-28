import { Command } from "fca-dunnn";
import BanModel from "../models/ban.model";
import { User } from "../databases";

class Remind extends Command {
    constructor(dl) {
        super({
            name: "remind",
            author: "Dunnn",
            description: "Hẹn giờ nhắc nhở",
            usage: "<prefix>remind <thời gian>(s|m|d|h):<nội dung>",
        }, dl)
    }

    async onCall({event, args}) {
        let text = args.join(" ");
        const {time,reason} = BanModel.getBanInfo(text)
        if(!time) return "⚠️ Vui lòng nhập đúng định dạng "
        if(!reason) return "⚠️ Vui lòng nhập nội dung nhắc nhở"
        setTimeout(async () => {
            const user = await User.get(event.senderID, event.threadID)
            await this.api.sendMessage({
                body: `⏰ @${user.name || user.id} Bạn đã đặt nhắc nhở: ${reason}`,
                mentions: [{
                    tag: "@" + (user.name || user.id),
                    id: event.senderID
                }]
            }, event.threadID)
        }
        , time * 1000);
        return "⏰ Đã đặt nhắc nhở! Bạn sẽ nhận được thông báo sau " + time + " giây";
    }
}

export default Remind;