const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "../data/users.json");

function ensureFile() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify({}, null, 2));
  }
}

function loadData() {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

function saveData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function getUser(data, guildId, user) {
  if (!data[guildId]) data[guildId] = {};

  if (!data[guildId][user.id]) {
    data[guildId][user.id] = {
      username: user.username,
      points: 0,
      agent: 0,
      tarot: 0
    };
  }

  return data[guildId][user.id];
}

module.exports = {
  loadData,
  saveData,
  getUser
};
