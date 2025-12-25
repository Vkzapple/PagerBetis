const {
  joinVoiceChannel,
  getVoiceConnection,
  VoiceConnectionStatus,
  entersState,
  createAudioPlayer,
  AudioPlayerStatus
} = require("@discordjs/voice");

const {createSilenceResource} = require("../utils/silence");

let player;

module.exports = {
  name: "!jaga",
  execute(message) {
    const vc = message.member.voice.channel;
    if (!vc) return message.reply("Masuk voice dulu bang");

    const existing = getVoiceConnection(vc.guild.id);
    if (existing) {
      return message.reply("Bot udah jaga voice bang");
    }

    const connection = joinVoiceChannel({
      channelId: vc.id,
      guildId: vc.guild.id,
      adapterCreator: vc.guild.voiceAdapterCreator,
      selfDeaf: true
    });


    if (!player){
      player = createAudioPlayer();
    }
    // play silentnya 
    connection.subscribe(player);
    player.play(createSilenceResource());

    player.on(AudioPlayerStatus.Idle, ()=> {
      player.play(createSilenceResource());
    });
    message.reply("bot udah masuk, selaww aja bang!");
  }
};