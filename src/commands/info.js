import {Command, Language} from 'fca-dunnn'
import { Thread, User } from '../databases'

class Info extends Command {
    constructor(deploy) {
        super({
            name: 'info',
            description: "Xem thông tin của bot",
            usage: "<prefix>info",
            author: "Dunn"
        }, deploy)
    }

    async onCall({event}) {
        let text = ""
        let config = this.botConfig
        text += "🤖 Tên bot: " + config.name + "\n"
        text += "👉 Prefix: " + (await this.hook.getPrefix(event)) + "\n"
        text += "👉 Prefix mặc định: " + config.prefix + "\n"
        text += "📖 Ngôn ngữ: " + Language.language + "\n"
        text += "⏰ Độ trễ: " + this.message.delay + "\n"
        text += this.line + "\n"
        text += "📗 Có: " + this.commandManager.size + " lệnh\n"
        text += "📕 Có: " + (await Thread.getAll())?.length + " nhóm\n"
        text += "📙 Có: " + (await User.getAll())?.length + " người dùng\n"
        text += this.line + "\n"
        text += "🌱 Mô tả: " + config.description + "\n"
        return text;
    }
}

export default Info