import { Command } from "fca-dunnn";
import { Permission } from "fca-dunnn/src/components/Command";
import KickModel from "../models/kick.model";

class Kick extends Command {
    constructor(dl) {
        super({
            name: "kick",
            author: "Dunn",
            permission: Permission.MOD,
            description: "Kick người dùng khỏi nhóm",
            usage: "<prefix>kick <@tag>",
        }, dl)
        this.model = new KickModel(dl)
    }

    async onCall({event}) {
        if(! (await this.model.isMod(this.account.uuid, event.threadID))) return "Bot không có quyền kick thành viên";
        const keys = Object.keys(event.mentions);
        if(!keys.length) return "Vui lòng tag người dùng cần kick";
        for(let id of keys) {
            const err = await this.model.kickUser(event.threadID, id);
            if(err) return this.message.reply(err, event.threadID);
            await this.model.wait(1000);
        }
    }

}

export default Kick