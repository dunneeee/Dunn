import Datastore from 'nedb-promises'
const db = Datastore.create({
    autoload: true,
    filename: 'src/data/Thread.db'
})

export default class Thread {
    constructor({id, name, prefix}) {
        this.id = id
        this.name = name
        this.prefix = prefix
    }

    getObject() {
        return {
            id: this.id,
            name: this.name,
            prefix: this.prefix,
        }
    }

    async save() {
        await db.update({id: this.id}, {$set: this.getObject()}, {upsert: true})
        return this;
    }

    async delete() {
        await db.remove({id: this.id})
        return this;
    }

    static async get(id) {
        let data = await db.findOne({id})
        if(!data) return null
        return new Thread(data)
    }

    static async getAll() {
        let data = await db.find({})
        if(!data) return null
        return data.map(e => new Thread(e))
    }

    static async create({id, name, prefix}) {
        if(!prefix) prefix = "/"
        let data = await db.insert({id, name, prefix})
        return new Thread(data)
    }

    static async has(id) {
        let data = await db.findOne({id})
        if(!data) return false
        return true
    }
    static async resetData() {
        await db.remove({}, {multi: true})
    }
}