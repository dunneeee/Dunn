import MyStream from "./MyStream";
class FbMessage {
    static async convertToMessageObj(message){
        const body = message.body
        const attachment = []
        const mentions = []
        for(let item of message.attachments) {
            let extend = "";
            switch(item.type) {
                case "photo":
                    extend = "png"
                    break;
                case "video":
                    extend = "mp4"
                    break;
                case "audio":
                    extend = "mp4"
                    break;
                default:
                    extend = item.filename.split(".").pop();
            }
            try {
                const file = await MyStream.getStream(item.url, "temp"+ Date.now() + Math.floor(Math.random() * 10000) + "." + extend)
            if(file) {
                attachment.push(file.getReadStream().on('close', () => {
                    file.dispose()
                }))
            }
            }catch(e) {
                Logger.setLabel("MESSAGE_CONVERT").error(e)
            }
        }

        // console.log(attachment)

        for(let [id, name] of Object.entries(message.mentions) ) {
            mentions.push({
                id,
                tag: "@" + name
            })
        }

        return {
            body,
            attachment,
            mentions
        }
    }
}

export default FbMessage;