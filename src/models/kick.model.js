import { Action } from "fca-dunnn";

class KickModel extends Action{
    async isMod(senderID, threadID) {
      try {
        const threadInfo = await this.api.getThreadInfo(threadID)
        const admins = threadInfo.adminIDs
        return admins.includes(senderID)
      } catch(e) {
        return false;
      }     
    }

    async kickUser(threadID, userID) {
        try {
            await this.api.removeUserFromGroup(userID, threadID)
            return null;
        } catch(e) {
            return "Không thể kick người dùng này id: " + userID;  
        }
    }

    wait(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms)
        })
    }
}

export default KickModel