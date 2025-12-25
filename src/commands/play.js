const play = require("play-dl");
const { createAudioResource } = require("@discordjs/voice");
const { join } = require("../utils/voiceState");

module.exports = {
  name: "!play",
  async execute(message, args) {
    if (!message.member.voice.channel) {
      return message.reply("Masuk voice dulu bang 🎧");
    }

    if (!args.length) {
      return message.reply("Kasih judul lagu bang.");
    }

    const state = join(message);

    const result = await play.search(args.join(" "), { limit: 1 });
    if (!result.length) {
      return message.reply("Lagunya kagak ketemu.");
    }

    const stream = await play.stream(result[0].url);
    const resource = createAudioResource(stream.stream, {
      inputType: stream.type
    });

    // PRIORITY MUSIC
    state.connection.subscribe(state.music);
    state.music.play(resource);
    state.mode = "music";

    message.reply(`🎶 Puter lagu: **${result[0].title}**`);
  }
};
