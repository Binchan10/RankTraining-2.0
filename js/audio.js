// =============================================
// audio.js — Web Audio API 사운드 생성
// =============================================

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/** 음소거 여부 확인 */
function isMuted() {
    return document.getElementById('optMute').checked;
}

/** AudioContext 일시정지 해제 (브라우저 정책 대응) */
function resumeAudio() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

/**
 * 정타 성공 시 재생되는 2음 상승 효과음
 */
function playSuccessSound() {
    if (isMuted()) return;
    resumeAudio();

    const t = audioCtx.currentTime;
    [[0, 880, 0.18], [0.11, 1108, 0.22]].forEach(([delay, freq, dur]) => {
        // 기본 사인파
        const osc = audioCtx.createOscillator();
        const gn  = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + delay);
        gn.gain.setValueAtTime(0.0, t + delay);
        gn.gain.linearRampToValueAtTime(0.13, t + delay + 0.006);
        gn.gain.exponentialRampToValueAtTime(0.001, t + delay + dur);

        // 3배음 (배음 질감)
        const osc2 = audioCtx.createOscillator();
        const gn2  = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 3.0, t + delay);
        gn2.gain.setValueAtTime(0.0, t + delay);
        gn2.gain.linearRampToValueAtTime(0.03, t + delay + 0.006);
        gn2.gain.exponentialRampToValueAtTime(0.001, t + delay + dur * 0.4);

        osc.connect(gn);   gn.connect(audioCtx.destination);
        osc2.connect(gn2); gn2.connect(audioCtx.destination);
        osc.start(t + delay);  osc.stop(t + delay + dur);
        osc2.start(t + delay); osc2.stop(t + delay + dur);
    });
}

/**
 * 적이 타일을 뒤집을 때 재생되는 둔탁한 타격음
 */
function playFlipSound() {
    if (isMuted()) return;
    resumeAudio();

    const t = audioCtx.currentTime;

    // 노이즈 버스트 (타격감)
    const bufSize = Math.floor(audioCtx.sampleRate * 0.06);
    const buf  = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
        const env = Math.exp(-i / (bufSize * 0.15));
        data[i] = (Math.random() * 2 - 1) * env;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buf;
    const bpf = audioCtx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.value = 900;
    bpf.Q.value = 0.5;
    const ng = audioCtx.createGain();
    ng.gain.setValueAtTime(1.1, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    noise.connect(bpf); bpf.connect(ng); ng.connect(audioCtx.destination);
    noise.start(t); noise.stop(t + 0.06);

    // 피치 다운 사인파 (묵직함)
    const osc = audioCtx.createOscillator();
    const og  = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.12);
    og.gain.setValueAtTime(0.18, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.connect(og); og.connect(audioCtx.destination);
    osc.start(t); osc.stop(t + 0.14);
}
