import { Action } from "fca-dunnn";
import { Ban, User } from "../databases";

class BanModel extends Action {
  static getBanInfo(text) {
    let reg = /(\d+)(m|ph|min|h|hour|d|s|)?\s*:(.*)/g;
    let match = reg.exec(text);
    if (!match)
      return {
        time: null,
        reason: text,
      };
    let time = match[1];
    let reason = match[3];
    if (match[2] == "m" || match[2] == "ph" || match[2] == "min") {
      time = parseInt(time) * 60;
    }

    if (match[2] == "h" || match[2] == "hour") {
      time = parseInt(time) * 60 * 60;
    }

    if (match[2] == "d") {
      time = parseInt(time) * 24 * 60 * 60;
    }

    if (match[2] == "s") {
      time = parseInt(time);
    }

    return {
      time: time,
      reason: reason,
    };
  }

  static  async getListUserBanOfThreadText(threadID) {
    const list = await Ban.getAllBanInThread(threadID);
    if(!list) return "Không có thông tin cấm sử dụng bot"
    if(list.length === 0) return "Không có thành viên nào bị cấm sử dụng bot"
    let msg = "📝 Thông tin cấm sử dụng bot:\n";
    msg += "\n";
    for (let ban of list) {
        msg += await ban.getInfoText()
        msg += "\n"
    }
    return msg
  }

  async validUsers(userIDs, threadID) {
    let result = [];
    for (let userID of userIDs) {
      const user = await User.get(userID, threadID);
      if (!user) {
        result.push({
          userID: userID,
          message: "Không tìm thấy người dùng này trong nhóm",
          user: null,
          status: false,
        });
        continue;
      }
      if(await Ban.get(userID, threadID)) {
        result.push({
            userID: userID,
            message: "Người dùng này đã bị cấm sử dụng bot",
            user: user,
            status: false,
          });
          continue;
      }
      result.push({
        userID: userID,
        message: "Người dùng này không bị cấm sử dụng bot",
        user: user,
        status: true,
      });
    }

    return result;
  }

  async banUser(userIDs, threadID, { time, reason, authorID }) {
    const result = await this.validUsers(userIDs, threadID);
    let success = [];
    let error = []
    for (let item of result) {
        const user = item.user
        if(item.status) {
            if(this.botConfig.admins?.some(ad => ad.id == user.id)) {
                error.push(`👤 ${user.name} (${user.id}): Người dùng này là admin của bot, không thể cấm sử dụng bot\n`)
                continue;
            }
            const ban = new Ban({
                id: item.userID,
                threadID,
                authorID,
                reason: reason,
                time: Date.now() + time * 1000,
            })
            await ban.save()
            user.banStatus = true
            success.push( `👤 ${user.name} (${user.id})\n`)
            continue;
        }
        if(user) {
            error.push(`👤 ${user.name} (${user.id}): ${item.message}\n`)
            continue;
        }
        error.push(`👤 ${item.userID}: ${item.message}\n`)
    }
    let msg = "📝 Thông tin cấm sử dụng bot:\n";
    if(!success.length && !error.length) return "Không có người dùng nào được cấm sử dụng bot"
    if(success.length) msg += "✅ Thành công:\n" + success.join("")
    if(error.length) msg += "❌ Thất bại:\n" + error.join("")
    return msg
  }

  async unbanUser(userIDs, threadID) {
        const result = await this.validUsers(userIDs, threadID);
        let success = [];
        let error = []
        for (let item of result) {
            const user = item.user
            if(!item.status && user) {
                success.push(`👤 ${user.name} (${user.id})\n`)
                const ban = await Ban.get(user.id, threadID)
                if(ban) {
                    await ban.delete()
                    user.banStatus = false
                }else {
                    error.push(`👤 ${user.name} (${user.id}): Người dùng này chưa bị cấm sử dụng bot\n`)
                }
                continue;
            }
            if(item.status && user) {
                error.push(`👤 ${user.name} (${user.id}): ${item.message}\n`)
                continue;
            }
            error.push(`👤 ${item.userID}: ${item.message}\n`)
        }
        let msg = "📝 Thông tin bỏ cấm sử dụng bot:\n";
        if(!success.length && !error.length) return "Không có người dùng nào được bỏ cấm sử dụng bot"
        if(success.length) msg += "✅ Thành công:\n" + success.join("")
        if(error.length) msg += "❌ Thất bại:\n" + error.join("")
        return msg
  }
}

export default BanModel;
