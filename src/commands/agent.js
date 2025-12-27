const fs = require("fs");
const path = require("path");

const agents = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/agents.json"), "utf-8")
);

const partyPools = new Map();

const DEFAULT_POOL = [
  "duelist",
  "duelist",
  "sentinel",
  "controller",
  "initiator"
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
  name: "!agent",
  execute(message) {
    const guildId = message.guild.id;

    if (!partyPools.has(guildId) || partyPools.get(guildId).length === 0) {
      partyPools.set(guildId, [...DEFAULT_POOL]);
    }

    const pool = partyPools.get(guildId);

    const roleIndex = Math.floor(Math.random() * pool.length);
    const role = pool.splice(roleIndex, 1)[0];

    const agentList = agents[role];
    const agent = getRandom(agentList);

    partyPools.set(guildId, pool);

    message.reply(
      ` **Agent Lu:** **${agent}**\n` +
      ` **Role:** ${role.toUpperCase()}\n` +
      ` Slot tersisa: ${pool.length}`
    );
  }
};
