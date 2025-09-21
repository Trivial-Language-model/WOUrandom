// ---------- Bモード用 ----------

let chain={}, words={};

const rawSymbol=`
A->B C C B
B->A A E
C->D E I G L D M
D->C B C
E->F C
F->G G
G->_END _END _END
H->C
I->J
J->K K
K->C F
L->_END
M->J`;

const rawWords=`
A=これ わたし わたし 君
B=は は は
C=の の の と に から を
D=只 順番 名前
E=避難訓練 岩昆虫
F=だ だ
G=よ よ… な
H=やめろ
I=忠告し
J=た た
K=の ん
L=死ぬ
M=言っ`;

rawSymbol.trim().split('\n').forEach(l=>{
    const [k,v]=l.split('->').map(s=>s.trim());
    chain[k]=v.split(/\s+/);
});
rawWords.trim().split('\n').forEach(l=>{
    const [k,v]=l.split('=').map(s=>s.trim());
    words[k]=v.split(/\s+/);
});

// Bモード文章生成
function genSentence(max=50){
    let cur=['A','D','H'][Math.floor(Math.random()*3)],res=[];
    for(let i=0;i<max && cur!=='_END';i++){
        const w=words[cur]; if(w) res.push(w[Math.floor(Math.random()*w.length)]);
        const next=chain[cur]; if(!next) break;
        cur=next[Math.floor(Math.random()*next.length)];
    }
    return res.join('');
}

// Bモード表示用
function showSentenceB(out, btn, speed=80){
    const s = genSentence();
    setCoolingState(true, btn);
    showTextSlowly(s, speed, out, ()=>setCoolingState(false, btn));
}
