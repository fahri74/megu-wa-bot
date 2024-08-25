export default module.exports = {
    name: "help",
    description: "Help Command",
    execute: async (sock: any, from: any,commands: any) => {
        let text = `
        List of commands:
        `

        for (const command in commands) {
            text += `\n${commands[command].name} - ${commands[command].description}`
            console.log(commands[command].description)
        }
        sock.sendMessage(from, { text: text })
    }
}