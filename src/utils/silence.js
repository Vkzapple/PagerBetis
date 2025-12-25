const {createAudioResource, StreamType} = require("@discordjs/voice")
const { Readable} = require("stream");

function createSilenceResource(){
    const silence = new Readable({
        read(){
            this.push(Buffer.from([0xF8, 0xFF, 0xFE]));
        }
    });

return createAudioResource(silence, {
    inputType:  StreamType.Opus
});

}

module.exports = { createSilenceResource };

