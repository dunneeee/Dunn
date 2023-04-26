import  Datastore from 'nedb-promises'
const db = Datastore.create({
    autoload: true,
    filename: 'src/data/Ban.db'
})

export default class Ban {
    constructor({id, threadID, reason, time, authorID}) {
        this.id = id
        this.threadID = threadID
        this.reason = reason
        this.time = time
        this.authorID = authorID
    }

    getObject() {
        return {
            id: this.id,
            threadID: this.threadID,
            reason: this.reason,
            time: this.time,
            authorID: this.authorID
        }
    }

    getTimeCount() {
        let time = this.time - Date.now()
        let day = Math.floor(time / (1000 * 60 * 60 * 24))
        let hour = Math.floor(time / (1000 * 60 * 60) % 24)
        let minute = Math.floor(time / (1000 * 60) % 60)
        let second = Math.floor(time / 1000 % 60)
        return {day, hour, minute, second}
    }

    isOutTime() {
        return Date.now() >= this.time
    }

    async save() {
        await db.update({id: this.id, threadID: this.threadID}, this.getObject(), {upsert: true})
        return this;
    }

    async delete() {
        await db.remove({id: this.id, threadID: this.threadID})
        return this;
    }

    static async get(id, threadID) {
        let data = await db.findOne({id, threadID})
        if(!data) return null
        return new Ban(data)
    }

    static async getAll() {
        let data = await db.find({})
        if(!data) return null
        return data.map(e => new Ban(e))
    }

    static async create({id, threadID, reason, time, authorID}) {
        let data = await db.insert({id, threadID, reason, time, authorID})
        return new Ban(data)
    }

    static async getAllBanInThread(threadID) {
        let data = await db.find({threadID})
        if(!data) return null
        return data.map(e => new Ban(e))
    }

    static async getAllBanInThreadByAuthor(threadID, authorID) {
        let data = await db.find({threadID, authorID})
        if(!data) return null
        return data.map(e => new Ban(e))
    }

    static async getAllBanInThreadByUser(threadID, id) {
        let data = await db.find({threadID, id})
        if(!data) return null
        return data.map(e => new Ban(e))
    }

    static async getAllBanInThreadByUserAndAuthor(threadID, id, authorID) {
        let data = await db.find({threadID, id, authorID})
        if(!data) return null
        return data.map(e => new Ban(e))
    }

}