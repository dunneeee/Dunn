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
            try {
                if(err) return this.api.sendMessage(`Đã xảy ra lỗi: ${err}`, event.threadID, event.messageID);
                if(stderr) return this.api.sendMessage(`Đã xảy ra lỗi: ${stderr}`, event.threadID, event.messageID);
                if(stdout) return this.api.sendMessage(`${stdout}`, event.threadID, event.messageID);
            }catch(e) {
                console.log(e)
            }
        })
    }
}

export default Cmd;