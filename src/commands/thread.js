import { Command } from "fca-dunnn";
import { Permission } from "fca-dunnn/src/components/Command";
import ThreadModel from "../models/thread.model";
class Thread extends Command {
    constructor(dl) {
        super({
            name: "thread",
            description: "Xem thông tin các thread, và thao tác",
            author: "Dunn",
            usage: "<prefix>thread <list|ls|out + uid>\n uid cách nhau bởi dấu cách",
            coolDown: 2000,
            permission: Permission.ADMIN,
        }, dl)
        this.model = new ThreadModel(dl)
    }

    async onCall({event, args}) {
        const flag = args[0]
        if(!flag) return "Không đúng cú pháp, vui lòng gõ <prefix>help thread để xem hướng dẫn".replace(/<prefix>/g, await this.hook.getPrefix(event))
        if(flag == "list" || flag == "ls") {
            return (await this.model.getThreadList()).toString()
        }
        else if(flag == "out") {
            const uids = args.slice(1)
            if(uids.length == 0) return "Vui lòng nhập uid cần out"
            return (await this.model.outThread(uids, event.threadID)).toString()
        }

        else {
            return "Không đúng cú pháp, vui lòng gõ <prefix>help thread để xem hướng dẫn".replace(/<prefix>/g, await this.hook.getPrefix(event))
        }
    }
}

export default Thread;