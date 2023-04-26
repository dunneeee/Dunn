import Datastore from 'nedb-promises'
const db = Datastore.create({
    autoload: true,
    filename: 'src/data/Thread.db'
})

export default class Thread {
    constructor({id, name, prefix, banStatus}) {
        this.id = id
        this.name = name
        this.prefix = prefix
        this.banStatus = banStatus
    }

    getObject() {
        return {
            id: this.id,
            name: this.name,
            prefix: this.prefix,
            banStatus: this.banStatus
        }
    }

    async save() {
        await db.update({id: this.id}, this.getObject(), {upsert: true})
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

    static async create({id, name, prefix, banStatus}) {
        if(!prefix) prefix = "/"
        if(typeof banStatus !== 'boolean') banStatus = false
        let data = await db.insert({id, name, prefix, banStatus})
        return new Thread(data)
    }

    static async has(id) {
        let data = await db.findOne({id})
        if(!data) return false
        return true
    }
}