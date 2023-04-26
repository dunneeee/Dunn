import { Event, Language, Logger } from "fca-dunnn";
import { Fca } from "fca-dunnn/types/Fca";

class LogEvent extends Event {
    constructor(dl) {
        super({
            name: "log_event",
            eventType: ["log:unsubscribe"]
        }, dl)
    }

    /**
     * 
     * @param {Fca.MessageEvent} event 
     */
    async execute(event) {
        if(event.logMessageData.leftParticipantFbId == this.botUuid) {
            try {
                let thread = await this.api.getThreadInfo(event.threadID)
            Logger.setLabel("NOTIFICATION").info(await Language.handleText("Bot đã bị xóa khỏi nhóm: " + thread.name + " (" + thread.threadID + ")"))
            }
            catch(e) {
                Logger.setLabel(this.name).error(e)
            }
        }
    }
}

export default LogEvent;