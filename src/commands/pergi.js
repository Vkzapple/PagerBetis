const {getVoiceConnection} = require("@discordjs/voice");

module.exports = {
    name: "!pergi",
    execute(message){
        const conn = getVoiceConnection(message.guild.id);
        if (!conn) return message.reply("bot kaga di voice ya!");

        conn.destroy();
        message.reply("bot udah cabut dari voice!")
    }
};