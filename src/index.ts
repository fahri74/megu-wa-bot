import makeWaSocket, { DisconnectReason,useMultiFileAuthState, } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import fs from 'fs'
import path from 'path'

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))

const commandsPath = path.join(__dirname, 'commands')

const commands: any = {}

fs.readdirSync(commandsPath).forEach(file => {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)

    commands[command.name] = command

    console.log(`Loaded command ${command.name}`)
})

async function main() {
    const { state, saveCreds } = await useMultiFileAuthState('../auth_info')
    const sock = makeWaSocket({
        auth: state,
        printQRInTerminal: true,
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
            if(shouldReconnect) {
                main()
            }
        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return

        const from = String(messages[0].key.remoteJid)
        const message = messages[0].message

        if (from === 'status@broadcast') return
        
        const prefix = config['BOT']['prefix']
        if (message?.conversation?.slice(0, 4) === prefix + 'ask') {
            console.log(message?.conversation?.slice(4))
            commands['ask'].execute(sock, from,message)
        }
        
        switch (message?.conversation) {
            case prefix + 'help':
                commands['help'].execute(sock, from,commands)
                break;
            case prefix + 'info':
                commands['info'].execute(sock, from)
                break;
            default:
                break;
        }  
    })


    sock.ev.on('creds.update', saveCreds)
}

main()