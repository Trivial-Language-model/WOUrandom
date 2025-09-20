let markovChain = {};

document.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.getElementById('generateButton');

  // 辞書データを直接埋め込む
  const rawText = `
これ -> は
は -> わたし 君 岩昆虫
わたし -> の は
の -> 只 避難訓練 に 名前
只 -> の
避難訓練 -> だ
だ -> よ よ…
やめろ -> と
と -> 忠告し
忠告し -> た
た -> の ん
に -> な
順番 -> は
君 -> から
から -> 死ぬ
岩昆虫 -> の
名前 -> を
を -> 言っ
言っ -> た
ん -> だ
`;

  buildMarkovChainFromText(rawText);

  generateButton.addEventListener('click', () => {
    const sentence = generateText();
    showTextSlowly(sentence, 80); // 80msごとに1文字表示
  });
});

function buildMarkovChainFromText(text) {
  markovChain = {};
  const lines = text.trim().split('\n');

  for (let line of lines) {
    line = line.trim();
    if (line === '' || !line.includes('->')) continue;

    const [key, values] = line.split('->').map(part => part.trim());
    const nextWords = values.split(/\s+/).filter(word => word !== '');

    if (!markovChain[key]) {
      markovChain[key] = [];
    }
    markovChain[key].push(...nextWords);
  }
}

function generateText(length = 50) {
  const startWords = ["これ", "やめろ", "順番", "わたし"];
  let current = startWords[Math.floor(Math.random() * startWords.length)];
  let result = [current];

  for (let i = 0; i < length; i++) {
    const nextWords = markovChain[current];
    if (!nextWords || nextWords.length === 0) break;
    current = nextWords[Math.floor(Math.random() * nextWords.length)];
    result.push(current);
  }

  return result.join(''); // 分かち書きなし
}

function showTextSlowly(text, speed = 100) {
  const output = document.getElementById('output');
  output.textContent = '';
  let index = 0;

  const interval = setInterval(() => {
    output.textContent += text[index];
    index++;
    if (index >= text.length) {
      clearInterval(interval);
    }
  }, speed);
}
