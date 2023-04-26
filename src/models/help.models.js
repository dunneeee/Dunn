import { Action } from "fca-dunnn";

class HelpModel extends Action{
    static splitPage(list, page = 1, limit = 10) {
        let start = (page - 1) * limit;
        let end = start + limit;
        return list.slice(start, end);
    }

    getCommandInfo(commandName) {
        const command = this.commandManager.get(commandName);
        if(!command) return null;
        let text = ""
        text += "🌱 Tên lệnh: " + command.name + "\n"
        text += "🎓 Tác giả: " + command.author + "\n"
        text += "⏰ Thời gian chờ: " + (command.coolDown / 1000) + " giây\n"
        text += "👤 Quyền hạn: " + command.permission + "\n"
        text += this.line + "\n"
        text += "🧾 Mô tả: " + command.description + "\n"
        text += "📝 Cách sử dụng: " + command.usage + "\n"
        return text;
    }

    getMenu(page = 1) {
        let text = ""
        let list = this.commandManager.values
        let result = HelpModel.splitPage(list, page)
        if(!result.length) return "Không tồn tại trang này!"
        text += "🌱 Danh sách lệnh: \n"
        text += this.line + "\n"
        for(let i = 0; i < result.length; i++) {
            let command = result[i]
            text += `🔰 <prefix>${command.name} - ${command.description}\n`
        }
        text += this.line + "\n"
        text += "📝 Để xem chi tiết lệnh, hãy chat <prefix>help <tên lệnh> \n"
        text += "📝 Để xem trang tiếp theo, hãy chat <prefix>help <số trang> \n"
        text += "🔢  Hiện tại có " + list.length + " lệnh có thể dùng\n"
        text +="📟 Trang: [" + page + "/" + Math.ceil(list.length / 10) + "]\n"
        return text;
    }
}

export default HelpModel