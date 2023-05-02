import { Command } from "fca-dunnn";
import { Permission } from "fca-dunnn/src/components/Command";
import PrefixModel from "../models/prefix.models";

class Prefix extends Command {
    constructor(dl) {
        super({
            name: "prefix",
            author: "Dunn",
            coolDown: 5000,
            description: "Đặt prefix mới cho nhóm!",
            permission: Permission.MOD,
            usage: "<prefix>prefix <prefix mới>"
        }, dl)

        this.model = new PrefixModel(dl)
    }

    async onCall({args, event}) {
        const newPrefix = args[0];
        if(!newPrefix) return "Prefix mới không được để trống";
        if(newPrefix.length > 5) return "Prefix mới không được dài quá 5 kí tự";
        const res = await this.model.changePrefix(event.threadID, newPrefix);
        return res;
    }

    async onEvery(event) {
        // const res = await this.model.handleText(event);
        // if(res && (event.type == "message" || event.type == "message_reply")) {
        //     await this.message.reply(res, event.threadID, event.messageID)
        // }
    }
}

export default Prefix