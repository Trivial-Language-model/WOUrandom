let markovChain = {};
let typingIntervalId = null;
let isCooling = false;

document.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.getElementById('generateButton');
  const output = document.getElementById('output');

  // 辞書データ
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

  // 「追跡する」ボタン（generateButton）押下時の挙動
  generateButton.addEventListener('click', () => {
    if (isCooling) return;

    const charA = document.getElementById('charA');
    const charB = document.getElementById('charB');

    // B が選択されている場合は文章生成を行わず emoji のみ表示
    if (charB && charB.checked) {
      // クールタイム開始
      setCoolingState(true, generateButton);

      // 既存の表示中 interval をクリア
      if (typingIntervalId !== null) {
        clearInterval(typingIntervalId);
        typingIntervalId = null;
      }

      // 👿🦎🍂 を表示（既存の文字送りと同じ挙動）
      output.textContent = '';
      showTextSlowly('👿🦎🍂', 80, output, () => {
        setCoolingState(false, generateButton);
      });
      return;
    }

    // A が選択されているか未選択の場合の開始語選択
    let startWords;
    if (charA && charA.checked) {
      startWords = ["これ", "わたし"];
    } else {
      startWords = ["これ", "やめろ", "順番", "わたし"];
    }

    const sentence = generateText(50, startWords);

    // ボタンを無効化（クールタイム開始）
    setCoolingState(true, generateButton);

    // 既存の表示中 interval をクリアしてから新しい表示を開始
    if (typingIntervalId !== null) {
      clearInterval(typingIntervalId);
      typingIntervalId = null;
    }

    // 表示完了時にコールバックでボタンを復活させる
    showTextSlowly(sentence, 80, output, () => {
      setCoolingState(false, generateButton);
    });
  });
});

function buildMarkovChainFromText(text) {
  markovChain = {};
  const lines = text.trim().split('\n');
  for (let line of lines) {
    line = line.trim();
    if (line === '' || !line.includes('->')) continue;
    const [key, values] = line.split('->').map(part => part.trim());
    const nextWords = values.split(/\s+/).filter(w => w !== '');
    if (!markovChain[key]) markovChain[key] = [];
    markovChain[key].push(...nextWords);
  }
}

function generateText(length = 50, startWords = ["これ", "やめろ", "順番", "わたし"]) {
  let current = startWords[Math.floor(Math.random() * startWords.length)];
  let result = [current];
  for (let i = 0; i < length; i++) {
    const nextWords = markovChain[current];
    if (!nextWords || nextWords.length === 0) break;
    current = nextWords[Math.floor(Math.random() * nextWords.length)];
    result.push(current);
  }
  return result.join('');
}

/**
 * showTextSlowly(text, speed, outputElement, onComplete)
 * - onComplete は全テキスト表示完了時に呼ばれるコールバック
 */
function showTextSlowly(text, speed = 100, outputElement, onComplete) {
  outputElement.textContent = '';
  let index = 0;

  // 既存 interval があればクリア
  if (typingIntervalId !== null) {
    clearInterval(typingIntervalId);
    typingIntervalId = null;
  }

  typingIntervalId = setInterval(() => {
    if (index >= text.length) {
      clearInterval(typingIntervalId);
      typingIntervalId = null;
      if (typeof onComplete === 'function') onComplete();
      return;
    }
    outputElement.textContent += text[index];
    index++;
  }, speed);
}

function setCoolingState(isOn, buttonElement) {
  isCooling = isOn;
  if (buttonElement) buttonElement.disabled = !!isOn;

  let label = document.getElementById('cooldownLabel');
  if (!label) {
    label = document.createElement('span');
    label.id = 'cooldownLabel';
    label.style.marginLeft = '8px';
    if (buttonElement) buttonElement.insertAdjacentElement('afterend', label);
    else document.body.appendChild(label);
  }
  label.textContent = isOn ? ' (表示中...)' : '';
}
