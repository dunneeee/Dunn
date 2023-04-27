import { Action } from "fca-dunnn";
import YoutubeModel from "./youtube.model";

class SingModel extends Action{
    constructor(dl, {api, maxResult}) {
        super(dl)
        this.youtube = api ? new YoutubeModel(api) : null
        this.maxResult = maxResult || 6
    }

    async search(query) {
        if(!this.youtube) return {
            msg: "Chưa cấu hình api youtube, vui lòng liên hệ admin!",
            list: []
        }
        let results;
        try {
            results = await this.youtube.search(query, this.maxResult)
        }catch(e) {
            return {
                msg: "Đã xảy ra lỗi khi tìm kiếm, vui lòng thử lại sau!",
                list: []
            }
        }
        if(!results || !results.length) return {
            msg: "Không tìm thấy kết quả nào!",
            list: []
        }
        let msg = "🔍 Kết quả tìm kiếm cho từ khóa: " + query + "\n"
        msg += this.line + "\n"
        for(let i = 0; i < results.length; i++) {
            msg += `🧾 ${i + 1}. ${results[i].title}\n`
            msg += `👤 ${results[i].channel}\n`
            msg += this.line + "\n"
        }
        msg += "📝 Reply số thứ tự của bài hát để nghe nhạc!";
        return {
            msg: msg,
            list: results
        }
    }
    
    async getMessageObject(audio) {
        return await this.getResponse(audio, "audio");
    }

    async getResponse(media, type) {
        const id = media.id 
        if(!id) return "Tham số truyền vào không hợp lệ! Vui lòng liên hệ admin!"
        try {
            const file = await this.youtube.download(id, type)
            return {
                body: media.title + " - " + media.channel + "\n" + this.line + "\n",
                attachment: file.getReadStream().on('close', () => {
                    file.dispose()
                })
            }
        }catch(e) {
            return "Có lỗi xảy ra khi tải xuống: " + e.des
        }
    }
}

export default SingModel