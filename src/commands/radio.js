const {
  joinVoiceChannel,
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require("@discordjs/voice");

let player;

module.exports = {
  name: "!radio",
  async execute(message) {
    const play = require("play-dl");

    const vc = message.member.voice.channel;
    if (!vc) return message.reply("Masuk voice dulu bang 🎧");

    // 🔒 URL HARD-CODE (AMAN)
    const RADIO_URL = "https://www.youtube.com/watch?v=0w9jYtZ9lUw";
    if (!RADIO_URL) {
      return message.reply("❌ URL radio belum diset.");
    }

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

    async function loop() {
      const stream = await play.stream(RADIO_URL);
      const resource = createAudioResource(stream.stream, {
        inputType: stream.type
      });
      player.play(resource);
    }

    // bersihin listener biar ga dobel
    player.removeAllListeners(AudioPlayerStatus.Idle);
    player.on(AudioPlayerStatus.Idle, loop);

    await loop();
    message.reply("Radio nyala. Lagu diloop terus.");
  }
};
