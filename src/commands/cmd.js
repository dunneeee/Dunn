import { Command } from "fca-dunnn";
import { Permission } from "fca-dunnn/src/components/Command";
import { exec } from "child_process";
class Cmd extends Command {
    constructor(dl, config) {
        super(config ? config : {
            name: "cmd",
            description: "Thực thi các lệnh hệ thống",
            permission: Permission.SUPER_ADMIN,
            coolDown: 2000,
            author: "Dunn"
        }, dl)
    }

    async onCall({event,args}) {
        let cmdtext = args.join(" ");
        if (!cmdtext) return "Vui lòng nhập lệnh cần thực thi!";
        exec(cmdtext, (err, stdout, stderr) => {
            if(err) {
                this.message.reply(`Đã xảy ra lỗi khi thực thi lệnh: ${err.message}`, event.threadID, event.messageID)
                return;
            }
            if(stderr) {
                this.message.reply(`Đã xảy ra lỗi khi thực thi lệnh: ${stderr}`, event.threadID, event.messageID)
                return;
            }
            this.message.reply(`Đã thực thi lệnh: ${stdout}`, event.threadID, event.messageID)
        })
    }
}

export default Cmd;