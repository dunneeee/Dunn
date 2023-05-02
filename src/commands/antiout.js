import { Command } from "fca-dunnn";
import { Permission } from "fca-dunnn/src/components/Command";
import AntiOutModel from "../models/antiout.model";

class Antiout extends Command {
    constructor(dl) {
        super({
            name: "antiout",
            description: "Bật/tắt chống out khỏi nhóm",
            usage: "<prefix>antiout <on/off>",
            permission: Permission.MOD
        }, dl)
        this.model = new AntiOutModel(dl)
    }

    async onCall({args, event}) {
        const status = args[0];
        if(!status) return "Vui lòng nhập on hoặc off";
        if(status == "on") {
            return await this.model.changeAntiout(event.threadID, "on");
        }
        else if(status == "off") {
            return await this.model.changeAntiout(event.threadID, "off");
        }
        else return "Vui lòng nhập on hoặc off";
    }

    async onEvery(event) {
        if(event.type == 'event') {
            if(event.logMessageType == 'log:unsubscribe') {
                const res = await this.model.handleEvent(event);
                if(res) {
                    await this.message.reply(res, event.threadID);
                }
            }
        }
    }
}

export default Antiout;