import { Command } from "fca-dunnn";
import { Permission } from "fca-dunnn/src/components/Command";
import TkbModel from "../models/tkb.model";
import MyTime from "../../utils/MyTime";

class Tkb extends Command {
    constructor(dl) {
        super({
            name: "tkb",
            description: "Xem thời khóa biểu của admin",
            author: "Dunn",
            permission: Permission.SUPER_ADMIN,
            usage: "tkb <t2|t3|t4|t5|t6|t7|cn>"
        },dl)
        this.model = new TkbModel(dl)
    }

    async onLoad() {
        await this.model.init();
        return "Đã load tự động update thời khoá biểu của admin!"
    }

    async onCall({event, args}) {
        if(!args[0]) {
            return await this.model.getTkb()
        }
        if(args[0] === "tomorrow") {
            const time = MyTime.getDay() + 1;
            return await this.model.getTkb(time)
        }
        switch(args[0]) {
            case "t2": return await this.model.getTkb(1)
            case "t3": return await this.model.getTkb(2)
            case "t4": return await this.model.getTkb(3)
            case "t5": return await this.model.getTkb(4)
            case "t6": return await this.model.getTkb(5)
            case "t7": return await this.model.getTkb(6)
            case "cn": return await this.model.getTkb(0)
            default : return "Không tìm thấy ngày học"
        }
    }
}

export default Tkb