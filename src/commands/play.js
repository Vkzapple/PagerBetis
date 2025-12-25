const play = require("play-dl");
const {
  joinVoiceChannel,
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require("@discordjs/voice");

const { createSilenceResource } = require("../utils/silence");

// pakai player global yang sama
let player;

module.exports = {
  name: "!play",
  async execute(message, args) {
    const vc = message.member.voice.channel;
    if (!vc) return message.reply("Masuk voice dulu bang 🎧");

    if (!args.length) {
      return message.reply("Kasih judul lagu atau link bang.");
    }

    const query = args.join(" ");

    const search = await play.search(query, { limit: 1 });
    if (!search.length) {
      return message.reply("Lagu kagak ketemu 😅");
    }

    const song = search[0];
    const stream = await play.stream(song.url);

    const resource = createAudioResource(stream.stream, {
      inputType: stream.type
    });

    let connection = getVoiceConnection(vc.guild.id);
    if (!connection) {
      connection = joinVoiceChannel({
        channelId: vc.id,
        guildId: vc.guild.id,
        adapterCreator: vc.guild.voiceAdapterCreator,
        selfDeaf: false
      });
    }

    if (!player) {
      player = createAudioPlayer();
      connection.subscribe(player);
    }

    // ▶️ PLAY MUSIC (silent otomatis berhenti)
    player.play(resource);

    message.reply(`🎶 Puter lagu: **${song.title}**`);

    // 🔁 kalau lagu selesai → balik ke silent keep-alive
    player.once(AudioPlayerStatus.Idle, () => {
      player.play(createSilenceResource());
    });
  }
};
