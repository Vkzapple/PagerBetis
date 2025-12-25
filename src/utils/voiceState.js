const {
  joinVoiceChannel,
  getVoiceConnection,
  createAudioPlayer,
  AudioPlayerStatus
} = require("@discordjs/voice");

const { createSilenceResource } = require("./silence");

const states = {};

function getState(guild) {
  if (!states[guild.id]) {
    const keepAlive = createAudioPlayer();
    const music = createAudioPlayer();

    states[guild.id] = {
      connection: null,
      keepAlive,
      music,
      mode: "idle"
    };

    // kalau musik selesai → balik silent
    music.on(AudioPlayerStatus.Idle, () => {
      const s = states[guild.id];
      if (s.connection) {
        s.connection.subscribe(s.keepAlive);
        s.keepAlive.play(createSilenceResource());
        s.mode = "idle";
      }
    });
  }

  return states[guild.id];
}

function join(message) {
  const vc = message.member.voice.channel;
  const guild = message.guild;

  const state = getState(guild);

  if (!state.connection) {
    state.connection = joinVoiceChannel({
      channelId: vc.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false
    });
  }

  // default: silent keep alive
  state.connection.subscribe(state.keepAlive);
  state.keepAlive.play(createSilenceResource());
  state.mode = "idle";

  return state;
}

module.exports = { join, getState };
