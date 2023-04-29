import { Action } from "fca-dunnn";
import { Ban, Thread, User } from "../databases";
import MyFile from "../../utils/MyFile";
import { join } from "path";
import MyTime from "../../utils/MyTime";
class InfoModel extends Action {
  constructor(deploy) {
    super(deploy);
    this.pakage = new MyFile(join(__dirname, "../../package.json")).readJson();
  }
  async getBotInfo() {
    const { admins, description, name, prefix } = this.botConfig;
    const uid = this.botUuid;
    const uptime = MyTime.getUptime().toString();
    const threadCount = (await Thread.getAll()).length;
    const userCount = (await User.getAll()).length;
    const commandCount = this.commandManager.size;
    const eventCount = this.eventManager.size;
    const version = this.pakage.version;
    const line = this.line;
    return {
      admins,
      description,
      name,
      prefix,
      uid,
      uptime,
      threadCount,
      userCount,
      commandCount,
      eventCount,
      toString() {
        let text = "";
        text += `🤖 Tên: ${name}\n`;
        text += `🪪 Uid: ${uid}\n`;
        text += `📚 Phiên bản: ${version}\n`;
        text += `📝 Prefix: ${prefix}\n`;
        text += `👑 Admins: ${admins.map((e) => e.name).join(", ")}\n`;
        text += line + "\n";
        text += `📌 Số nhóm: ${threadCount}\n`;
        text += `📌 Số người dùng: ${userCount}\n`;
        text += line + "\n";
        text += `📚 Tổng lệnh: ${commandCount}\n`;
        text += `📚 Tổng sự kiện: ${eventCount}\n`;
        text += line + "\n";
        text += `🕰️ Thời gian hoạt động: ${uptime}\n`;
        text += line + "\n";
        text += `📝 Mô tả: ${description}\n`;
        return text;
      },
    };
  }

  async getThreadInfo(threadID) {
    const threadInfo = await this.api.getThreadInfo(threadID)
    const thread = await Thread.get(threadID)
    if(!thread) return null
    const {id,name,prefix} = thread
    const {adminIDs,participantIDs,messageCount} = threadInfo
    const line = this.line
    const userBans = await Ban.getAllBanInThread(threadID)
    return {
        id,
        name,
        prefix,
        adminCount: adminIDs.length,
        participantCount: participantIDs.length,
        messageCount,
        toString() {
            let text = ""
            text += `👥 Tên: ${name}\n`
            text += `🦴 Prefix: ${prefix}\n`
            text += line + "\n"
            text += `👥 Số admin: ${adminIDs.length}\n`
            text += `🔢 Số thành viên: ${participantIDs.length}\n`
            text += `🔢 Số tin nhắn: ${messageCount}\n`
            if(userBans) {
                text += line + "\n"
                text += `🧑 Số người bị ban: ${userBans.length}\n`
            }
            return text
        }
    }
  }
}

export default InfoModel;
