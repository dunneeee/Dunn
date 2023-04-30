import { Event, Language, Logger } from "fca-dunnn";
import { Fca } from "fca-dunnn/types/Fca";

class ChangeNickname extends Event {
    constructor(dl) {
        super({
            name: "change_nickname",
            eventType: ["log:subscribe"]
        }, dl)
    }


    /**
     * 
     * @param {Fca.MessageEvent} event 
     */
    async execute(event) {
        const {logMessageData} = event
        for(let item of logMessageData.addedParticipants) {
            if(item.userFbId == this.botUuid) {
                try {
                    await this.api.changeNickname(`[ ${this.botConfig.prefix} ] - ${this.botConfig.name} (${this.botConfig.description})`, event.threadID, this.botUuid)
                    let thread = await this.api.getThreadInfo(event.threadID)
                    Logger.setLabel("NOTIFICATION").info(await Language.handleText("Bot được thêm vào nhóm: " + thread.name + " (" + thread.threadID + ")"))
                    this.message.reply(`Chào ${thread.name} 👋. Bot đã sẵn sàng được sử dụng. Vui lòng chat ${this.botConfig.prefix}help để xem cách sử dụng. Chúc các bạn có một ngày vui vẻ!`, event.threadID)
                }catch(e) {
                    Logger.setLabel(this.name).error(e)
                }
            }
        }
    }
}

export default ChangeNickname