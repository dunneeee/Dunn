import { CheckPermission } from "fca-dunnn";
import { User } from "../databases";

class MyCheckPermission extends CheckPermission {

    async isAdmin(senderID, threadID) {
        const user = await User.get(senderID, threadID)
        if(!user) return false;
        return user.isAdmin;
    }
}

export default MyCheckPermission