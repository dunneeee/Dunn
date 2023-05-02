import { Action } from "fca-dunnn";
import ThreadSetting from "../databases/ThreadSetting";

class AntiOutModel extends Action {
    async changeAntiout(threadID, status) {
        const threadInfo = await ThreadSetting.get(threadID)
        if(!threadInfo) return "Không tìm thấy nhóm này trong database";
        if(status == "on") {
            if(threadInfo.antiout === true) return "Chế độ chống out đã được bật";
            threadInfo._antiout = true;
            await threadInfo.save();
            return "Đã bật chế độ chống out";
        }
        else if(status == "off") {
            if(threadInfo.antiout === false) return "Chế độ chống out đã được tắt";
            threadInfo._antiout = false;
            await threadInfo.save();
            return "Đã tắt chế độ chống out";
        }
    }

    async handleEvent(event) {
        const userOut = event.logMessageData.leftParticipantFbId;
        const author = event.author;
        if(userOut == author) {
            const threadInfo = await ThreadSetting.get(event.threadID);
            if(!threadInfo) return;
            if(threadInfo.antiout === true) {
                try {
                    await this.api.addUserToGroup(userOut, event.threadID);
                    return "Chế độ chống out đã được bật, vì vậy bạn không thể rời nhóm"
                }catch(e) {
                    return "Không thể thêm thành viên vừa rời vào lại nhóm";
                }
            }
            return null;
        };
        return null;
    }
}

export default AntiOutModel;