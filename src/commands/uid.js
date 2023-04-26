import { Command } from "fca-dunnn";
import AddModel from "../models/add.model";

class Uid extends Command {
    constructor(dl) {
        super({
            name: "uid",
            author: "Dunn",
            description: "Lấy uid của người dùng",
            usage: "<prefix>uid <@tag/link>"
        }, dl)
    }

    async onCall({event, args}) {
        const data = Object.entries(event.mentions);
        if(data.length) {
            let text = ""
            for(const [id, info] of data) {
                text += `${info.slice(1)} - ${id}\n`
            }
            return text;
        }
        const link = args[0];
        if(!link) return "Vui lòng nhập @tag/link";
        const type = AddModel.checkType(link);
        if(type !== 1) return "Link facebook không được để trống!"
        const id = await AddModel.getFacebookId(link);
        if(!id) return "Không tìm thấy người dùng này";
        return id;
    }
}

export default Uid;