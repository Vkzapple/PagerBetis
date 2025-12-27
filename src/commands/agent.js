const fs = require("fs");
const path = require("path");

const agents = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/agents.json"), "utf-8")
);

const USERS_PATH = path.join(__dirname, "../data/users.json");

if (!fs.existsSync(USERS_PATH)) {
  fs.writeFileSync(USERS_PATH, JSON.stringify({}, null, 2));
}

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

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
  name: "!agent",
  execute(message) {
    const guildId = message.guild.id;
    const userId = message.author.id;

    const users = JSON.parse(fs.readFileSync(USERS_PATH, "utf-8"));
    if (!users[userId]) {
      users[userId] = { points: 0 };
    }

    if (!partyPools.has(guildId) || partyPools.get(guildId).length === 0) {
      partyPools.set(guildId, [...DEFAULT_POOL]);
    }

    const pool = partyPools.get(guildId);

    const roleIndex = Math.floor(Math.random() * pool.length);
    const role = pool.splice(roleIndex, 1)[0];

    const agent = getRandom(agents[role]);

    const gainedPts = ROLE_POINTS[role] || 5;
    users[userId].points += gainedPts;

    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
    partyPools.set(guildId, pool);

    message.reply(
      ` **Agent:** **${agent}**\n` +
      ` **Role:** ${role.toUpperCase()}\n` +
      ` **+${gainedPts} pts**\n` +
      ` Slot party tersisa: ${pool.length}`
    );
  }
};
