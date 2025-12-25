const tarot = require("../data/tarot.json");
const { loadData, saveData, getUser } = require("../utils/storage");
const { addPoints } = require("../utils/points");

module.exports = {
  name: "!tarot",
  execute(message) {
    const draw = tarot[Math.floor(Math.random() * tarot.length)];

    const data = loadData();
    const user = getUser(data, message.guild.id, message.author);

    user.tarot += 1;
    addPoints(user, 3);
    saveData(data);

    message.reply(
      `🔮 **Tarot Ranked**\n` +
      `Hasil: **${draw.result}**\n` +
      `Penyebab: **${draw.agent}** (${draw.reason})\n` +
      `(+3 pts)`
    );
  }
};
