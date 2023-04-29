import {Account, Logger, Facebook} from 'fca-dunnn'
import {existsSync, readFileSync} from 'fs'
import Deploy from './src/components/Deploy';

const start = async () => {
    if(!existsSync('appstate.json')) return Logger.setLabel("START").error("appstate.json not found");
    const appState = JSON.parse(readFileSync('appstate.json')) 
    try {
        const account = await Account.login(appState)
        const facebook = new Facebook(account, {
            admins: [],
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
    }catch(e) {
        Logger.setLabel("START").error(e)
    }
}

start()