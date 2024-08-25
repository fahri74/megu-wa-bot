import os from 'os'

export default module.exports = {
    name: "info",
    description: "Get information about the bot.",
    execute: async (sock: any, from: any) => {
        const text = `
    -----------------------------------------------
    Bot Information

    Name: Megu Bot
    Version: 1.0.0
    Author: @fahri74

    Source: https://github.com/fahri74/megu-wa-bot
    -------------------------------------------------
    Status: Online

    Platform: ${os.platform()}

    Device: ${os.hostname()}

    CPU: ${os.cpus()[0].model}

    RAM: ${os.totalmem() / 1024 / 1024 / 1024} GB

    Uptime: ${os.uptime()}

    Node: ${process.version}

    OS: ${os.release()}
    -------------------------------------------------
        `
        sock.sendMessage(from, { image: { url: '../assets/megumin.jpeg' }, caption: text })
    }
}