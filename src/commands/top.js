const { loadData } = require("../utils/storage");

module.exports = {
  name: "!top",
  execute(message) {
    const data = loadData();
    const guildId = message.guild.id;

    if (!data[guildId]) {
      return message.reply("Belom ada data bang.");
    }

    const users = Object.values(data[guildId]);
    if (users.length === 0) {
      return message.reply("Belom ada data bang.");
    }

    const sorted = users
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);

    let text = "🏆 **Top Basecamp PAMLORANT**\n";
    sorted.forEach((u, i) => {
      text += `${i + 1}. ${u.username} — ${u.points} pts\n`;
    });

    message.reply(text);
  }
};
