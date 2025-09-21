let typingIntervalId=null, isCooling=false;

function showTextSlowly(text, interval=100, out, done){
    out.value=''; let i=0;
    if(typingIntervalId) clearInterval(typingIntervalId), typingIntervalId=null;
    typingIntervalId=setInterval(()=>{
        if(i>=text.length){
            clearInterval(typingIntervalId); typingIntervalId=null;
            if(typeof done==='function') done(); return;
        }
        out.value += text[i++];
    }, interval);
}

function setCoolingState(on, btn){
    isCooling = !!on; if(btn) btn.disabled = isCooling;
    let lbl = document.getElementById('cooldownLabel');
    if(!lbl){
        // 既にHTMLにあるので作成不要
        return;
    }
}

document.addEventListener('DOMContentLoaded', ()=>{
    const btn = document.getElementById('generateButton'),
          out = document.getElementById('output'),
          speedSlider = document.getElementById('speedSlider'),
          speedValue = document.getElementById('speedValue');

    // スライダー値表示
    if(speedSlider && speedValue){
        speedValue.textContent = speedSlider.value;
        speedSlider.addEventListener('input', ()=>{
            speedValue.textContent = speedSlider.value;
        });
    }

    btn.addEventListener('click', ()=>{
        if(isCooling) return;

        // ここでスライダー値を取得して interval に変換
        let speed = speedSlider ? parseInt(speedSlider.value) || 50 : 50;
        let interval = 200 - speed * 2;
        if(interval < 1) interval = 1;

        const a = document.getElementById('charA'),
              b = document.getElementById('charB');

        if(b && b.checked){
            showSentenceB(out, btn, interval);
        } else {
            showSentenceA(out, btn, interval);
        }
    });
});
