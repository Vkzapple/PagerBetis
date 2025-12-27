const fs = require("fs");
const path = require("path");
const { loadData, saveData } = require("../utils/storage");

const agents = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/agents.json"), "utf-8")
);

// pool role per server
const partyPools = new Map();

const DEFAULT_POOL = [
  "duelist",
  "duelist",
  "sentinel",
  "controller",
  "initiator"
];

const ROLE_POINTS = {
  duelist: 10,
  controller: 8,
  initiator: 7,
  sentinel: 6
};

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
  name: "!agent",
  execute(message) {
    const guildId = message.guild.id;
    const userId = message.author.id;

    // init pool
    if (!partyPools.has(guildId) || partyPools.get(guildId).length === 0) {
      partyPools.set(guildId, [...DEFAULT_POOL]);
    }

    const pool = partyPools.get(guildId);

    // ambil role random
    const roleIndex = Math.floor(Math.random() * pool.length);
    const role = pool.splice(roleIndex, 1)[0];

    const agent = random(agents[role]);
    const gainedPts = ROLE_POINTS[role];

    // simpan poin
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
      `**Agent:** **${agent}**\n` +
      ` **Role:** ${role.toUpperCase()}\n` +
      ` **+${gainedPts} pts**\n` +
      ` Slot party tersisa: ${pool.length}`
    );
  }
};
