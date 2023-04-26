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
        switch(key) {
            case "onlymod":
            case "onlyMod":
            case "-om":
                if(value == 'true') {
                    settings.unsend.onlyMod = true
                    await settings.save()
                    return "Đã bật chế độ chỉ có quản trị viên mới có thể dùng lệnh này";
                }   
                else if(value == 'false') {
                    settings.unsend.onlyMod = false
                    await settings.save()
                    return "Đã tắt chế độ chỉ có quản trị viên mới có thể dùng lệnh này";
                }
                else {
                    return "Giá trị chỉ có thể là true hoặc false";
                }
            default:
                return "Không tồn tại thuộc tính " + key + "Các thuộc tính có thể thay đổi: " + await this.getKeys(threadID);
        }
    }

    async getKeys(threadID) {
        const settings = await ThreadSetting.get(threadID)
        if(!settings) return "Chưa có cài đặt nào cho nhóm này";
        return Object.keys(settings.unsend).join(", ");
    }
}

export default UnsendModel;