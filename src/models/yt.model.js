import SingModel from "./sing.model";

class YtModel extends SingModel {

    async getMessageObject(video) {
        return await this.getResponse(video, "video");
    }
}

export default YtModel