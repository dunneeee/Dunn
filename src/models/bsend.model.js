import { Action, Logger } from "fca-dunnn";
import ThreadSetting from "../databases/ThreadSetting";
import MyStream from "../../utils/MyStream";
import { User } from "../databases";

class BsendModel extends Action {
    threads = new Map()
    timeout = 15 * 60 * 1000
    isload = false
    addMessage(threadID, message) {
        let thread = this.threads.get(threadID)
        if(!thread) thread = new Map()
        thread.set(message.messageID, message)
        this.threads.set(threadID, thread)
        setTimeout(() => {
            thread.delete(message.messageID)
        }, this.timeout)
        return this; 
    }

    async load() {
        this.isload = true;
        const settings = await ThreadSetting.getAll()
        if(settings) {
            for(let setting of settings) {
                if(setting.bsend) {
                    this.threads.set(setting.id, new Map())
                }
            }
        }
    }

    getMessage(threadID, messageID) {
        const thread = this.threads.get(threadID)
        if(!thread) return null;
        return thread.get(messageID)
    }

    removeMessage(threadID, messageID) {
        const thread = this.threads.get(threadID)
        if(!thread) return null;
        thread.delete(messageID)
        return this;
    }

    isOn(threadID) {
        const thread = this.threads.get(threadID)
        return !!thread
    }

    async setStatus(threadID, status) {
        if(status === true && !this.isOn(threadID)) this.threads.set(threadID, new Map())
        if(status === false && this.isOn(threadID)) this.threads.delete(threadID)
        const settings = await ThreadSetting.get(threadID)
        if(!settings) return null;
        if(!status || status === false) {
                this.threads.delete(threadID)       
        }
        settings._bsend = status
        await settings.save()
        return this;
    }

    async convertToMessageObject(message) {
        const body = message.body
        const attachment = []
        const mentions = []
        for(let item of message.attachments) {
            let extend = "";
            switch(item.type) {
                case "photo":
                    extend = "png"
                    break;
                case "video":
                    extend = "mp4"
                    break;
                case "audio":
                    extend = "mp4"
                    break;
                default:
                    extend = item.filename.split(".").pop();
            }
            try {
                const file = await MyStream.getStream(item.url, "temp"+ Date.now() + Math.floor(Math.random() * 10000) + "." + extend)
            if(file) {
                attachment.push(file.getReadStream().on('close', () => {
                    file.dispose()
                }))
            }
            }catch(e) {
                Logger.setLabel("BSEND_MODEL").error(e)
            }
        }

        // console.log(attachment)

        for(let [id, name] of Object.entries(message.mentions) ) {
            mentions.push({
                id,
                tag: "@" + name
            })
        }

        return {
            body,
            attachment,
            mentions
        }
    }

    async getName(userID, threadID) {
        const user = await User.get(userID, threadID)
        if(user) return user.name
        try {
            const ret = await this.api.getUserInfo(userID)
            if(!ret[userID]) return userID;
            const name = ret[userID].name
            return name;
        }catch(e) {
            return userID;
        }
    }
}

export default BsendModel;