import { Action } from "fca-dunnn";
import { Thread } from "../databases";
class ThreadModel extends Action {

    async getThreadList() {
        const threads = await Thread.getAll()
        if(!threads) return {
            data: [],
            toString() {
                return "Có lỗi xảy ra hoặc không có thread nào tồn tại trong database"
            }
        }
        const line = this.line;
        return {
            data: threads,
            toString() {
                let text ="📃 Danh sách các thread hiện có:\n";
                text += line + "\n";
                threads.forEach((thread, index) => {
                    text += `${index+1}. ${thread.name} - ${thread.id}\n`
                })
                return text;
            }
        }
    }

    async outThread(uids, threadID) {
        let success = []
        let fail = []
        for(const uid of uids) {
            if(!uid || isNaN(uid)) {
                fail.push({
                    id: uid,
                    name: "Không hợp lệ"
                })
                continue;
            }
            if(uid == threadID) {
                fail.push({
                    id: uid,
                    name: "Không thể out thread mà bạn đang thao tác!"
                })
                continue;
            }
            const thread = await Thread.get(uid)
            if(!thread) {
                fail.push({
                    id: uid,
                    name: "Không tồn tại"
                })
                continue;
            }
            try {
                await this.message.reply("Bot nhận được yêu cầu out thread từ admin, đang tiến hành out thread...", thread.id)
                await new Promise((reslove) => setTimeout(reslove, 1000))
                await this.api.removeUserFromGroup(this.botUuid, thread.id)
                success.push({
                    id: uid,
                    name: thread.name,
                })
            }catch(e) {
                fail.push({
                    id: uid,
                    name: thread.name,
                })
            }
        }
        const line = this.line;
        return {
            data: {
                success,
                fail
            },
            toString() {
                if(success.length == 0 && fail.length == 0) return "Không có uid nào được nhập vào";
                let text = success.length !== 0 ? "📃 Danh sách các thread out thành công:\n" + line + "\n" : "";
                success.forEach((thread, index) => {
                    text += `${index+1}. ${thread.name} - ${thread.id}\n`
                })
                text += fail.length !== 0 ? "\n📃 Danh sách các thread out thất bại:\n" + line + "\n" : "";
                fail.forEach((thread, index) => {
                    text += `${index+1}. ${thread.name} - ${thread.id}\n`
                })
                return text;
            }
        }
    }
}

export default ThreadModel;