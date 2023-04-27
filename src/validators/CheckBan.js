import { Validator } from "fca-dunnn";
import { Fca } from "fca-dunnn/types/Fca";
import { Ban, User } from "../databases";

class Checkban extends Validator {
  constructor(dl) {
    super(dl, {
      name: "check_ban",
    });
  }

  timeToDelay = 1000 * 60 * 5;

  /**
   * @type {
   * {
   * userID: string,
   * threadID: string,
   * delete(): void;
   * }[]
   * }
   */
  notieds = [];

  getNoti(userID, threadID) {
    return this.notieds.find(
      (noti) => noti.userID === userID && noti.threadID === threadID
    );
  }

  deleNoti(userID, threadID) {
    const noti = this.getNoti(userID, threadID);
    this.notieds.splice(this.notieds.indexOf(noti), 1);
  }

  addNoti(userID, threadID) {
    const newNoti = {
      userID,
      threadID,
      delete: () => {
        this.deleNoti(userID, threadID);
      },
    };
    this.notieds.push(newNoti);

    setTimeout(() => {
      newNoti.delete();
    }, this.timeToDelay);
  }

  /**
   *
   * @param {Fca.MessageType} event
   * @returns {Promise<import("fca-dunnn/src/managers/ValidatorManager").ValidatorResponse>}
   */
  async execute(event) {
    if(event.type === 'message' || event.type === 'message_reply') {
        const senderID = event.senderID;
        const threadID = event.threadID;
        const resUser = await this.handleBan(senderID, threadID);
        if(resUser.type !== 'success') return resUser;
        const resThread = await this.handleBan(threadID, threadID);
        return resThread; 
    }
    return {
        message: null,
        type: 'success'
    }
  }

  /**
   *
   * @param {string} senderID
   * @param {string} threadID
   * @returns {Promise<import("fca-dunnn/src/managers/ValidatorManager").ValidatorResponse>}
   */
  async handleBan(senderID, threadID) {
    const userBan = await Ban.get(senderID, threadID);
    if (userBan) {
      if (userBan.isOutTime()) {
        await userBan.delete();
        this.deleNoti(senderID, threadID);
        return {
          type: "success",
          message: "Bạn đã được giải phóng",
        };
      }
      if (!this.getNoti(senderID, threadID)) {
        this.addNoti(senderID, threadID);
        const time = userBan.getTimeText()
        const authorName = userBan.authorID
          ? (await User.get(userBan.authorID, threadID))?.name || ""
          : "";
        return {
          type: "error",
          message:
            (senderID == threadID ? "Nhóm bạn" : "Bạn") +
            " đã bị " +
            (authorName ? `${authorName}` : "bot") +
            ` cấm sử dụng bot trong ${time} nữa vì lý do: ${userBan.reason}`,
        };
      }
      return {
        type: "error",
        message: null,
      };
    }
    return {
      message: null,
      type: "success",
    };
  }
}

export default Checkban;
