import { Event, Time } from "fca-dunnn";
import { Fca } from "fca-dunnn/types/Fca";
import Thread from '../databases/Thread'
class LogForAdmin extends Event {
    constructor(dl) {
        super({
            eventType: ["log:subscribe", "log:unsubscribe"],
            name: "log_for_admin"
        }, dl)
    }

   /**
    * 
    * @param {Fca.MessageEvent} event 
    */
    async execute(event) {
        if(event.logMessageType == 'log:subscribe') {
            const {logMessageData} = event
            for(let item of logMessageData.addedParticipants) {
                if(item.userFbId == this.botUuid) {
                    const adminId = this.botConfig.admins[0]?.id
                    if(adminId) {
                        try {
                            const info = await this.api.getThreadInfo(event.threadID)
                            const dbInfo = await Thread.get(event.threadID)
                            let text = "📑 Bot được thêm vào nhóm: \n";
                            text += "📌 Tên nhóm: " + info.name + "\n";
                            text += "🪪 ID nhóm: " + info.threadID + "\n";
                            text += "🔢 Số thành viên: " + info.participantIDs.length + "\n";
                            text += "🔢 Số admin: " + info.adminIDs.length + "\n";
                            text += dbInfo ? "🔃 Nhóm đã được lưu trước đó\n" : "🔃 Nhóm chưa được lưu trước đó\n"
                            text += "⏲️ Thời gian: " + Time.format(Date.now())
                            await this.message.reply(text, adminId);
                        }catch(e) {
                            Logger.setLabel(this.name).error(e)
                        }

                    }
                }
            }
        }

        if(event.logMessageType == 'log:unsubscribe') {
            const {logMessageData} = event
            if(logMessageData.leftParticipantFbId == this.botUuid) {
                const adminId = this.botConfig.admins[0]?.id
                if(adminId) {
                    try {
                        const info = await this.api.getThreadInfo(event.threadID)
                        const dbInfo = await Thread.get(event.threadID)
                        let text = "📑 Bot bị xóa khỏi nhóm: \n";
                        text += "📌 Tên nhóm: " + info.name + "\n";
                        text += "🪪 ID nhóm: " + info.threadID + "\n";
                        text += "🔢 Số thành viên: " + info.participantIDs.length + "\n";
                        text += "🔢 Số admin: " + info.adminIDs.length + "\n";
                        text += dbInfo ? "🔃 Nhóm đã được lưu trước đó\n" : "🔃 Nhóm chưa được lưu trước đó\n"
                        text += "⏲️ Thời gian: " + Time.format(Date.now())
                        await this.message.reply(text, adminId);
                    }catch(e) {
                        Logger.setLabel(this.name).error(e)
                    }
                }
            }
        }
    }
}

export default LogForAdmin;