import { Action } from "fca-dunnn";
import { Thread, User } from "../databases";
import ThreadSetting from "../databases/ThreadSetting";

class DbModel extends Action{
    static async resetAll() {
        await Thread.resetData()
        await ThreadSetting.resetData()
        await User.resetData()
    }
}

export default DbModel