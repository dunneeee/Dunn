import {CheckCoolDown, CheckPermission, Deploy as Dunn, Logger} from 'fca-dunnn'
import {join} from 'path'
import MyHook from './MyHook'
import { CheckBan } from '../validators'
import { Thread, User } from '../databases'
import ThreadSetting from '../databases/ThreadSetting'


export default class Deploy extends Dunn {

    async load() {
        this.customHook(new MyHook(this))
        // this.message.setDeplay(10);
        await this.loadCommands(join(__dirname, "../commands"))
        await this.loadEvents(join(__dirname, "../events"))
        this.addValidator(new CheckBan(this, {name: "check_ban"}))
        this.addValidator(new CheckPermission(this, {name: "check_permission"}))
        this.addValidator(new CheckCoolDown(this, {name: "check_cooldown"}))
    }

    async onHook(event) {
        if(event.type == "message" || event.type == "message_reply") {
            // check and create thread
            const {threadID, senderID} = event
            if(!(await Thread.has(threadID))) {
                const info = await this.api.getThreadInfo(threadID);
                await Thread.createWithInfo({...info, threadID})
            }
            //check and create settings 

            if(!(await ThreadSetting.has(threadID))) {
                const settings = await ThreadSetting.create({id: threadID})
                Logger.setLabel("CREATE_SETTINGS").success(`Created settings for thread ${threadID}`)
            }

            // check and create user
            if(!(await User.has(senderID, threadID))) {
                const ret = await this.api.getUserInfo(senderID)
                const info = ret[senderID]
                await User.createWithInfo(info, senderID,threadID)
            }

        }
    }
}