const play = require("play-dl");
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
    const vc = message.member.voice.channel;
    if (!vc) return message.reply("Masuk voice dulu bang 🎧");

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

    const URL = "https://youtu.be/l0qOQs49c7s?si=ecQtWD_uPRFtDL3X"; 


    async function playLoop() {
      const stream = await play.stream(URL);
      const resource = createAudioResource(stream.stream, {
        inputType: stream.type
      });
      player.play(resource);
    }

    // loop terus
    player.on(AudioPlayerStatus.Idle, () => {
      playLoop();
    });

    await playLoop();
    message.reply("Radio nyala doel");
  }
};
