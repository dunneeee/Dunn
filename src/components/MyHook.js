import {Hook} from 'fca-dunnn'
import { Thread } from '../databases'

export default class MyHook extends Hook {
    async getPrefix(event) {
        const thread = await Thread.get(event.threadID)
        return thread ? thread.prefix : this.botConfig.prefix || "/"
    }

    
}