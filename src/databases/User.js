import Datastore from 'nedb-promises'
const db = Datastore.create({
    autoload: true,
    filename: 'src/data/User.db'
})

export default class User {
    constructor({id, name, threadID, banStatus, money, isAdmin, gender}) {
        this.id = id
        this.name = name
        this.threadID = threadID
        this.banStatus = banStatus
        this.money = money
        this.isAdmin = isAdmin
        this.gender = gender
    }

    getObject() {
        return {
            id: this.id,
            name: this.name,
            threadID: this.threadID,
            banStatus: this.banStatus,
            money: this.money,
            isAdmin: this.isAdmin,
            gender: this.gender
        }
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
        return new User(data)
    }

    static async getAll() {
        let data = await db.find({})
        if(!data) return null
        return data.map(e => new User(e))
    }

    static async create({id, name, threadID, banStatus, money, isAdmin, gender}) {
        if(!money) money = 0
        if(typeof banStatus !== 'boolean') banStatus = false
        if(typeof isAdmin !== 'boolean') isAdmin = false
        let data = await db.insert({id, name, threadID, banStatus, money, isAdmin, gender})
        return new User(data)
    }

    static async getAllUserInThread(threadID) {
        let data = await db.find({threadID})
        if(!data) return null
        return data.map(e => new User(e))
    }

    static async has(id, threadID) {
        let data = await db.findOne({id, threadID})
        if(!data) return false
        return true
    }
}