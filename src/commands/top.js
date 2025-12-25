const { loadData } = require("../utils/storage");

module.exports = {
  name: "!top",
  execute(message) {
    const data = loadData();
    const guild = data[message.guild.id];

    if (!guild) return message.reply("Belom ada data bang.");

    const sorted = Object.values(guild)
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);

    let text = "🏆 **Top Basecamp PAMLORANT**\n";
    sorted.forEach((u, i) => {
      text += `${i + 1}. ${u.username} — ${u.points} pts\n`;
    });

    message.reply(text);
  }
};
