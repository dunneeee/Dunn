import { Action } from "fca-dunnn";
import KickModel from "./kick.model";
import ThreadSetting from "../databases/ThreadSetting";

class UnsendModel extends Action {
    constructor(dl) {
        super(dl)
        this.kickModel = new KickModel(dl)
    }

    isMod(senderID, threadID) {
        return this.kickModel.isMod(senderID, threadID)
    }

    async onlyMod(threadID) {
        let settings = await ThreadSetting.get(threadID)
        if(!settings) return false
        return settings.unsend.onlyMod
    }

    async handleSettings(key, value, threadID) {
        if(!key) return "Thiếu thuộc tính cần thay đổi";
        if(!value) return "Thiếu giá trị cần thay đổi";
        const settings = await ThreadSetting.get(threadID)
        if(!settings) return "Chưa có cài đặt nào cho nhóm này";
        const {type,message} = settings.setUnsend(key, value)
        if(type == "error") return message
        if(type == "success") {
            await settings.save()
            return message
        }
    }

    async getKeys(threadID) {
        const settings = await ThreadSetting.get(threadID)
        if(!settings) return "Chưa có cài đặt nào cho nhóm này";
        return Object.keys(settings.unsend).join(", ");
    }

}

export default UnsendModel;