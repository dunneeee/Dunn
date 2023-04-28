import { Command } from "fca-dunnn";
import { Permission } from "fca-dunnn/src/components/Command";
import DbModel from "../models/db.model";

class Db extends Command {
    constructor(dl) {
        super({
            name: "db",
            author: "Dunnn",
            coolDown: 3000,
            description: "Thao tác với database của bot",
            permission: Permission.SUPER_ADMIN,
            usage: "<prefix>db <reset>"
        }, dl)
        this.model = new DbModel(dl)
    }

    async onCall({args, event}) {
        const action = args[0];
        if(!action) return this.usage.replace("<prefix>", await this.hook.getPrefix(event));
        switch(action) {
            case 'reset':
                const res = await this.message.reply("Bạn có chắc chắn muốn reset database không? (yes/no)(reply)", event.threadID, event.messageID);
                this.messageTemp.add({
                    command: this,
                    messageID: res.messageID,
                    type: "message_reply",
                    action: "reset",
                    author: event.senderID
                })
                break;
            default:
                break;
        }
    }

    async onReply({args}, temp) {
        const {action} = temp
        switch(action) {
            case 'reset':
                if(!args[0]) return "Vui lòng nhập yes hoặc no";
                if(args[0].toLowerCase() == "yes") {
                    await DbModel.resetAll();
                    await this.api.unsendMessage(temp.messageID)
                temp.delete()
                    return "Đã reset database thành công"
                }
                await this.api.unsendMessage(temp.messageID)
                temp.delete()
                return "Đã hủy thao tác"
            default:
                break;
        }
    }
}

export default Db