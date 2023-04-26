import { Command } from "fca-dunnn";
import AddModel from "../models/add.model";

class Add extends Command {
    constructor(dl) {
        super({
            name: "add",
            author: "Dunn",
            usage: "<prefix>add <username>/<link>/<uuid>",
            description: "Thêm người dùng vào nhóm từ username/link/uuid"
        }, dl)
        this.model = new AddModel(dl);
    }

    async onCall({event, args}) {
        const params = args[0];
        if(!params) return "Vui lòng nhập username/link/uuid";
        const type = AddModel.checkType(params);
        if(!type) return "Đầu vào không hợp lệ";
        if(type === 1) {
            const id = await AddModel.getFacebookId(params);
            if(!id) return "Không tìm thấy người dùng này";
            const res = await this.model.addUser(id, event.threadID);
            if(res) return res;
        }

        if(type === 2) {
            const res = await this.model.addUser(params, event.threadID);
            if(res) return res;
        }
    }
}

export default Add;