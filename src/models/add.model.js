import axios from "axios";
import { Action } from "fca-dunnn";

class AddModel extends Action{
    static checkType(text) {
        if(!text) return 0;
        let regfbLink = /https:\/\/(www|m)\.facebook\.com\/(profile|groups)\/([0-9a-zA-Z.]+)\/?/g
        let regfbID = /([0-9a-zA-Z.]+)/g
        let regfbLink2 = /https:\/\/(www|m)\.facebook\.com\/([0-9a-zA-Z.]+)\/?/g
        if(text.match(regfbLink) || text.match(regfbLink2)) return 1;
        if(text.match(regfbID)) return 2;
        return 0;
    }

    async addUser(id, threadID) {
        try {
            await this.api.addUserToGroup(id, threadID)
            return;
        }catch(e) {
            return "Không thể thêm người dùng này vào nhóm! id: " + id; 
        }
    }

    static async getFacebookId(link) {
        let url = "https://id.traodoisub.com/api.php"
        try {
            const formData = new FormData()
            formData.append("link", link)
            const {data} = await axios.post(url, formData)
            if(data.code === 200) return data.id;
            return null;
        }catch(e) {
            return null;
        }
    }
}

export default AddModel