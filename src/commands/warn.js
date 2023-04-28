import { Command } from "fca-dunnn";
import { Permission } from "fca-dunnn/src/components/Command";

class Warn extends Command {
    constructor(dl) {
        super({
            name: "warn",
            author: "Dunnn",
            description: "Cảnh cáo thành viên",
            usage: "<prefix>warn <@tag/reply> [lý do]",
            coolDown: 5000,
            permission: Permission.MOD
        }, dl)
    }

    async onCall({}) {
        return "📈 Chức năng này đang được phát triển"
    }
}   

export default Warn;