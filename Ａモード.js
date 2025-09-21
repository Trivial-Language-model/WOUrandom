// ---------- Aモード用 ----------

let markovChain={};

// マルコフ連鎖の初期化
const rawA=`これ -> は
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
ん -> だ`;

rawA.trim().split('\n').forEach(l=>{
    const [k,v] = l.split('->').map(s=>s.trim());
    (markovChain[k]||(markovChain[k]=[])).push(...v.split(/\s+/));
});

// Aモード文章生成
function generateText(len=50, starts=["これ","やめろ","順番","わたし"]){
    let cur = starts[Math.floor(Math.random()*starts.length)], res=[cur];
    for(let i=0;i<len;i++){
        const next = markovChain[cur]; if(!next||!next.length) break;
        cur = next[Math.floor(Math.random()*next.length)];
        res.push(cur);
    }
    return res.join('');
}

// Aモード表示用
function showSentenceA(out, btn, speed=80){
    const s = generateText(50);
    setCoolingState(true, btn);
    showTextSlowly(s, speed, out, ()=>setCoolingState(false, btn));
}

