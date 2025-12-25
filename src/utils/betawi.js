const lines = [
  "Santuy bang",
  "Buset dah",
  "Jangan instalock ye",
  "Aim lu ke genteng",
  "Basecamp aman",
  "Kagak manusiawi itu",
  "Sabar bang, belum rejeki",
  "Mainnya pelan, jangan napsu",
  "Yaudeh udehh jangan nangis bang",
  "Sprayyy terosssssssss",
  "Ora danta pisan",
  "Monyet lu"
];

function randomBetawi() {
  return lines[Math.floor(Math.random() * lines.length)];
}

module.exports = {
  randomBetawi
};
