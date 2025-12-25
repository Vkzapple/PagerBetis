const { join } = require("../utils/voiceState");

module.exports = {
  name: "!jaga",
  execute(message) {
    if (!message.member.voice.channel) {
      return message.reply("Masuk voice dulu bang 🗣️");
    }

    join(message);
    message.reply("👮 Bot jaga basecamp. Mau kosong mau rame, gua stay.");
  }
};
