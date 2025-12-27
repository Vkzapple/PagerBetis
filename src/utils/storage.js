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
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    if (!raw.trim()) return {};
    return JSON.parse(raw);
  } catch {
    fs.writeFileSync(DATA_PATH, JSON.stringify({}, null, 2));
    return {};
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

module.exports = { loadData, saveData };
