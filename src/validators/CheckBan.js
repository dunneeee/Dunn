import { Validator } from "fca-dunnn";
import { Ban, Thread, User } from "../databases";

class Checkban extends Validator {
    notied = [];
    timeToSendNoti = 1000 * 60 * 5;
    async execute(event) {
        if(this.notied.find(item => item.threadID == event.threadID && item.senderID == (event.isGroup ? event.threadID : event.senderID))) return {
            type: "error",
            message: "",
        };

        const thread = await Thread.get(event.threadID)
        if(thread) {
            if(!thread.banStatus) {
                return {
                    type: "warning",
                    message: "Nhóm này không bị cấm sử dụng bot"
                }
            }
    
            const banInfo = await Ban.get(event.threadID, event.threadID)
            if(!banInfo) return {
                type: "warning",
                message: "Không tồn tại thông tin cấm sử dụng bot của nhóm này"
            }
    
            if(banInfo.isOutTime()) {
                await banInfo.delete()
                return {
                    type: "success",
                    message: "Thời gian cấm sử dụng bot của nhóm này đã hết"
                }
            }
    
            const times = banInfo.getTimeCount()
            
            this.notied.push(() => {
                const data = {
                    threadID: event.threadID,
                    senderID: event.threadID,
                    delete: () => {
                        this.notied = this.notied.filter(item => item.senderID != event.senderID)
                    },
                    time: Date.now() + this.timeToSendNoti
                }

                setTimeout(() => {
                    data.delete()
                }, this.timeToSendNoti)

                return data;
            })


            return {
                type: "error",
                message: `⌚ Nhóm này bị cấm sử dụng bot trong ${times.day} ngày ${times.hour} giờ ${times.minute} phút ${times.second} giây.\n📝 Lý do: ${banInfo.reason}\n`
            }
        }

        const user = await User.get(event.senderID, event.threadID)
        if(user) {
            if(!user.banStatus) {
                return {
                    type: "warning",
                    message: "Người dùng này không bị cấm sử dụng bot"
                }
            }
    
            const banInfo = await Ban.get(event.senderID, event.threadID)
            if(!banInfo) return {
                type: "warning",
                message: "Không tồn tại thông tin cấm sử dụng bot của người dùng này"
            }
    
            if(banInfo.isOutTime()) {
                await banInfo.delete()
                return {
                    type: "success",
                    message: "Thời gian cấm sử dụng bot của người dùng này đã hết"
                }
            }

            this.notied.push(() => {
                const data = {
                    threadID: event.threadID,
                    senderID: event.senderID,
                    delete: () => {
                        this.notied = this.notied.filter(item => item.senderID != event.senderID)
                    },
                    time: Date.now() + this.timeToSendNoti
                }

                setTimeout(() => {
                    data.delete()
                }, this.timeToSendNoti)

                return data;
            })

            const times = banInfo.getTimeCount()
            return {
                type: "error",
                message: `⌚ Người dùng này bị cấm sử dụng bot trong ${times.day} ngày ${times.hour} giờ ${times.minute} phút ${times.second} giây.\n📝 Lý do: ${banInfo.reason}\n`
            }
        }
        
        return {
            type: "success",
            message: "Không có thông tin cấm sử dụng bot của nhóm này"
        }
    }
}

export default Checkban;