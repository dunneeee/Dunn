import { Command } from "fca-dunnn";
import HelpModel from "../models/help.models";

export default class Help extends Command {
    constructor(dl) {
        super({
            name: "help",
            description: "Xem hướng dẫn sử dụng",
            usage: "<prefix>help <tên lệnh> hoặc <prefix>help <số trang>",
            author: "Dunn",
            coolDown: 5000
        }, dl)
        this.model = new HelpModel(dl);
    }

    async onCall({args, event}) {
        const flag = args[0];
        const prefix = await this.hook.getPrefix(event);
        if(!flag) {
            return this.model.getMenu().replace(/<prefix>/g, prefix);
        }
        if(!isNaN(flag)) {
            return this.model.getMenu(flag).replace(/<prefix>/g, prefix);
        }
        const command = this.model.getCommandInfo(flag);
        if(!command) return "Không tìm thấy lệnh này";
        return command.replace(/<prefix>/g, prefix);
    }
}
