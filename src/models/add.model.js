import axios from "axios";
import { Action } from "fca-dunnn";
import FbAction from "../../utils/FbAction";

class AddModel extends Action{
    static checkType(text) {
        return FbAction.checkType(text)
    }

    async addUser(id, threadID) {
        try {
            await this.api.addUserToGroup(id, threadID)
            return;
        }catch(e) {
            return "Không thể thêm người dùng này vào nhóm! id: " + id; 
        }
    }

    static async getFacebookId(link) {
        return await FbAction.getFacebookId(link)
    }
}

export default AddModel