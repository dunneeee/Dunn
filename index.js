import {Account, Logger, Facebook, Language} from 'fca-dunnn'
import {existsSync, readFileSync} from 'fs'
import Deploy from './src/components/Deploy';

const start = async () => {
    if(!existsSync('appstate.json')) return Logger.setLabel("START").error("appstate.json not found");
    const appState = JSON.parse(readFileSync('appstate.json')) 
    try {
        const account = await Account.login(appState)
        const facebook = new Facebook(account, {
            admins: [
                {
                    id: "100080943310950",
                    name: "Lê Thế Dũng"
                },
                {
                    id: "1000852925237134",
                    name: "Accout Test"
                }
            ],
            description: "Dunn Bot - Made by Dunn",
            prefix: "/",
            name: "Dunn Bot",
        })

        const deploy = new Deploy(facebook);
        await deploy.start({
            devMode: true,
            language: "vi",
            logRecievedMessage: true,
            translateMessage: true
        })
        console.log(Language.language)
    }catch(e) {
        Logger.setLabel("START").error(e)
    }
}

start()