import { Command } from "fca-dunnn";

class Rename extends Command {
    constructor(dl) {
        super({
            name: "rename",
            author: "Dunnn",
            description: "Đổi tên nhóm, người dùng",
            usage: "<prefix>rename <@tag :/\"\"/me> <new name>",
        }, dl)
    }

    wait(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, ms)
        })
    }

    async onCall({args, event}) {
        const type = args[0]
        if(type == 'me') {
            if(args.length === 1) return "Vui lòng nhập tên mới"
            const name = args.slice(1).join(" ")
            await this.api.changeNickname(name, event.threadID, event.senderID)
            return "Đã đổi tên của bạn thành " + name
        }
        const userids = Object.keys(event.mentions)
        if(userids.length === 0) {
            if(args.length === 0) return this.usage.replace("<prefix>", await this.hook.getPrefix(event))
            const name = args.join(" ")
            await this.api.setTitle(name, event.threadID)
            return "Đã đổi tên nhóm bạn thành " + name
        }
        const preIndex = args.findIndex(e => e== ":")
        if(preIndex === -1) return "Có vẻ bạn nhập sai cú pháp: @tag : <Biệt danh>"
        const name = args.slice(preIndex + 1).join(" ")
        for(let i = 0; i < userids.length; i++) {
            await this.api.changeNickname(name, event.threadID, userids[i])
            await this.wait(1000)
        }
    }
}

export default Rename;