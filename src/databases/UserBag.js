import Datastore from "nedb-promises"

const db = Datastore.create({
    autoload: true,
    filename: "data/userbag.db"
})

class UserBag {
    constructor(data) {
        this._vkuCookie = data.vkuCookie
        this._id = data.id
    }

    get id() {
        return this._id || null;
    }

    async save() {
        await db.update({id: this.id}, {$set: this.getObject()}, {upsert: true})
    }

    async delete() {
        await db.remove({id: this.id})
    }

    get vkuCookie() {
        return this._vkuCookie || null;
    }

    getObject() {
        return {
            vkuCookie: this.vkuCookie 
        }
    }

    static async get(id) {
        const bag = await db.findOne({id})
        if(!bag) return null
        return new UserBag(bag)
    }

    static async create(id) {
        const bag = new UserBag({id})
        await bag.save()
        return bag
    }

    
}

export default UserBag