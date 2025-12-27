const fs = require("fs");
const path = require("path");
const { loadData, saveData } = require("../utils/storage");

const tarot = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/tarot.json"), "utf-8")
);

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
  name: "!tarot",
  execute(message) {
    const guildId = message.guild.id;
    const userId = message.author.id;

    const result = random(tarot);
    const gainedPts = result.result === "MENANG" ? 10 : 3;

    const data = loadData();
    if (!data[guildId]) data[guildId] = {};
    if (!data[guildId][userId]) {
      data[guildId][userId] = {
        username: message.author.username,
        points: 0
      };
    }

    data[guildId][userId].points += gainedPts;
    saveData(data);

    message.reply(
      ` **TAROT COMPE PAMLORANT**\n` +
      ` Hasil: **${result.result}**\n` +
      ` Agent: **${result.agent}**\n` +
      ` Alasan: ${result.reason}\n` +
      ` **+${gainedPts} pts**`
    );
  }
};
