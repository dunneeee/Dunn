import {Command, Language, Logger} from 'fca-dunnn'
class Trans extends Command {
    constructor(dl) {
        super({
            name: "trans",
            description: "Dịch văn bản",
            author: "Dunnn",
            coolDown: 3000,
            usage: "<prefix>trans <ngôn ngữ> <văn bản | reply tin nhắn để dịch!>"
        }, dl)
    }

    async onCall({event, args}) {
        if(event.type == 'message_reply') {
            const msg = event.messageReply.body
            if(!msg) return "Không thể dịch tin nhắn này!"
            const lang = args[0] || "en"
            try {
                await this.api.sendMessage(await Language.translate(msg, lang), event.threadID, event.messageID)
            }catch(e) {
                Logger.setLabel("TRANS_SEND")
                .error("Tài khoản đã bị cấm chat!")
            }
            return;
        }
        const lang = args[0]
        if(!lang) return this.usage.replace("<prefix>", await this.hook.getPrefix(event))
        const text = args.slice(1).join(" ")
        if(!text) return this.usage.replace("<prefix>", await this.hook.getPrefix(event))
        try {
            await this.api.sendMessage(await Language.translate(text, lang), event.threadID, event.messageID)
        }catch(e) {
            Logger.setLabel("TRANS_SEND")
            .error("Tài khoản đã bị cấm chat!")
        }
        return;
    }
}

export default Trans;