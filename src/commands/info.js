import {Command, Language, Time} from 'fca-dunnn'
import { Thread, User } from '../databases'
import InfoModel from '../models/info.model'

class Info extends Command {
    constructor(deploy) {
        super({
            name: 'info',
            description: "Xem thông tin của bot",
            usage: "<prefix>info <\"\" | box | @tag | reply>",
            author: "Dunn"
        }, deploy)
        this.model = new InfoModel(deploy);
    }

    async onCall({event, args}) {
        if(args.length === 0) return (await this.model.getBotInfo()).toString()
        const type = args[0].toLowerCase()
        switch(type) {
            case 'box':
                return (await this.model.getThreadInfo(event.threadID)).toString()
            default:
                return "Chưa hỗ trợ loại này " + type
        }
    }
}

export default Info