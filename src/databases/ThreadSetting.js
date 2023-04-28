import Datastore from 'nedb-promises'

const db = new Datastore({
    filename: 'src/data/ThreadSetting.db',
    autoload: true
})

class ThreadSetting {
    constructor(data) {
        this.id = data.id;
        this._unsend = data.unsend;
        this._bsend = data.bsend;
        this._notiJoin = data.notiJoin;
        this._notiLeave = data.notileave
    }

    get unsend() {
        return {
            onlyMod: this._unsend?.onlyMod || false,
        }
    }

    get bsend() {
        return this._bsend || false;
    }

    get notiJoin() {
        return this._notiJoin ?? true;
    }

    get notiLeave() {
        return this._notiLeave ?? true;
    }

    async save() {
        await db.update({id: this.id}, {$set: this.getObject()}, {upsert: true})
        return this;
    }

    async delete() {
        await db.remove({id: this.id})
        return this;
    }   

    getObject() {
        return {
            id: this.id,
            unsend: this.unsend,
            bsend: this.bsend,
            notiJoin: this.notiJoin,
            notiLeave: this.notiLeave
        }
    }

    static async get(id) {
        let data = await db.findOne({id})
        if(!data) return null
        return new ThreadSetting(data)
    }


    /**
     * 
     * @returns {Promise<ThreadSetting[] | null>}
     */
    static async getAll() {
        let data = await db.find({})
        if(!data) return null
        return data.map(e => new ThreadSetting(e))
    }

    static async create({id, unsend, bsend}) {
        if(await this.has(id)) return null
        if(!unsend) unsend = {
            onlyMod: false
        }

        if(typeof bsend !== 'boolean') bsend = false;

        let data = await db.insert({id, unsend, bsend})
        return new ThreadSetting(data)
    }

    static async has(id) {
        let data = await db.findOne({id})
        if(!data) return false
        return true
    }
}

export default ThreadSetting;