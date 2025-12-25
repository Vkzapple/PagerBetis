const agents = require("../data/agents.json");
const { loadData, saveData, getUser } = require("../utils/storage");
const { addPoints } = require("../utils/points");
const { randomBetawi } = require("../utils/betawi");

module.exports = {
  name: "!agent",
  execute(message, args) {
    const role = args[0]?.toLowerCase();
    let pool = [];

    if (role && agents[role]) {
      pool = agents[role];
    } else {
      pool = Object.values(agents).flat();
    }

    const pick = pool[Math.floor(Math.random() * pool.length)];

    const data = loadData();
    const user = getUser(data, message.guild.id, message.author);

    user.agent += 1;
    addPoints(user, 5);
    saveData(data);

    message.reply(
      `🎭 Agent lu: **${pick}**\n${randomBetawi()} (+5 pts)`
    );
  }
};
