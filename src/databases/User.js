import Datastore from "nedb-promises";
import { Logger } from "fca-dunnn";
const db = Datastore.create({
  autoload: true,
  filename: "src/data/User.db",
});

export default class User {
  constructor({ id, name, threadID, money, isAdmin, gender }) {
    this.id = id;
    this.name = name;
    this.threadID = threadID;
    this.money = money;
    this.isAdmin = isAdmin;
    this.gender = gender;
  }

  getObject() {
    return {
      id: this.id,
      name: this.name,
      threadID: this.threadID,
      money: this.money,
      isAdmin: this.isAdmin,
      gender: this.gender,
    };
  }

  async save() {
    await db.update(
      { id: this.id, threadID: this.threadID },
      this.getObject(),
      { upsert: true }
    );
    return this;
  }

  async delete() {
    await db.remove({ id: this.id, threadID: this.threadID });
    return this;
  }

  static async get(id, threadID) {
    let data = await db.findOne({ id, threadID });
    if (!data) return null;
    return new User(data);
  }

  static async getAll() {
    let data = await db.find({});
    if (!data) return null;
    return data.map((e) => new User(e));
  }

  static async create({ id, name, threadID, money, isAdmin, gender }) {
    if (!money) money = 0;
    if (typeof isAdmin !== "boolean") isAdmin = false;
    let data = await db.insert({ id, name, threadID, money, isAdmin, gender });
    return new User(data);
  }

  static async createWithInfo(info, senderID, threadID) {
    const user = await User.create({
      id: senderID,
      threadID,
      name: info.name,
      gender: info.gender,
    });
    Logger.setLabel("CREATE_USER").success(
      `Created user ${user.name} (${user.id}) in ${user.threadID}`
    );
    return user;
  }

  static async getAllUserInThread(threadID) {
    let data = await db.find({ threadID });
    if (!data) return null;
    return data.map((e) => new User(e));
  }

  static async has(id, threadID) {
    let data = await db.findOne({ id, threadID });
    if (!data) return false;
    return true;
  }

  static async getsWithTypes(id, types) {
    if (!types || typeof types !== "object" || Array.isArray(types)) return [];
    let data = await db.find({ id, ...types });
    if (!data) return [];
    return data.map((e) => new User(e));
  }
  static async resetData() {
    await db.remove({}, { multi: true });
  }
}
