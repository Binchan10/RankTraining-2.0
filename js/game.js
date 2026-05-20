// =============================================
// game.js — 핵심 게임 로직
//   타일 상태 / 적 AI / 타이머 / 입력 처리 / 재시작
// =============================================

// ─── 게임 상태 ──────────────────────────────────────────

let tiles         = [];    // { owner, word, rotation, blockedUntil? }
let started       = false;
let paused        = false;
let resuming      = false;   // 재개 카운트다운 진행 중 여부

// 통계
let totalHits     = 0;
let totalMisses   = 0;
let enemyFlips    = 0;

// 시간
let timeLeft      = 0;
let totalTime     = 0;

// 구간별 정타
let segmentHits     = [];
let segmentDuration = 0;
let segmentIndex    = 0;

// 타이머 핸들
let enemyTimer   = null;
let segmentTimer = null;

// 키 입력
const pressedKeys   = new Set();
let   restartLocked = false;

// ─── 단어 풀 ────────────────────────────────────────────

/**
 * 현재 타일에 없는 단어를 랜덤으로 반환한다.
 * Easy Mode일 때는 3글자 이하만 사용한다.
 * @returns {string}
 */
function rand() {
    const isEasy       = document.getElementById('optEasy').checked;
    const pool         = isEasy ? WORDS.filter(w => w.length <= 3) : WORDS;
    const currentWords = tiles.map(t => t.word);
    let word;
    do { word = pool[Math.floor(Math.random() * pool.length)]; }
    while (currentWords.includes(word));
    return word;
}

// ─── 타일 뒤집기 ────────────────────────────────────────

/**
 * 인덱스 index의 타일을 newOwner 소유로 뒤집는다.
 * 플레이어가 뒤집은 타일은 FLIP_DURATION 동안 적의 타깃에서 제외된다.
 *
 * @param {number}   index     tiles 배열 인덱스
 * @param {string}   newOwner  'player' | 'enemy'
 * @param {Function} [afterFlip]  애니메이션 완료 후 콜백 (옵션)
 */
function flip(index, newOwner, afterFlip) {
    tiles[index].owner    = newOwner;
    tiles[index].word     = rand();
    tiles[index].rotation += 180;

    if (newOwner === 'player') {
        tiles[index].blockedUntil = Date.now() + FLIP_DURATION;
    }

    const container = document.getElementById('tile-container-' + index);
    if (container) {
        container.style.transform = `rotateY(${tiles[index].rotation}deg)`;
        setTimeout(() => {
            container.className = 'tile ' + newOwner;
            container.querySelectorAll('.tile-face').forEach(f => {
                f.textContent = tiles[index].word;
            });
        }, 170);
    }

    if (afterFlip) setTimeout(afterFlip, FLIP_DURATION);
}

// ─── 적 AI ──────────────────────────────────────────────

/**
 * 재귀 setTimeout으로 적의 타이핑을 시뮬레이션한다.
 * - 플레이어 타일 중 짧은 단어(≤3자)를 70% 확률로 우선 선택
 * - 목표 속도와 ±17% 분산으로 딜레이를 계산
 */
function enemy() {
    if (!started || paused) return;
    clearTimeout(enemyTimer);

    const now      = Date.now();
    const pIndices = tiles
        .map((t, i) => (t.owner === 'player' && !(t.blockedUntil && t.blockedUntil > now)) ? i : -1)
        .filter(i => i !== -1);

    if (!pIndices.length) {
        enemyTimer = setTimeout(enemy, 500);
        return;
    }

    const short     = pIndices.filter(i => tiles[i].word.length <= 3);
    const targetIdx = (Math.random() < 0.70 && short.length)
        ? short[Math.floor(Math.random() * short.length)]
        : pIndices[Math.floor(Math.random() * pIndices.length)];

    const baseSpeed     = parseInt(document.getElementById('speed').value);
    const variance      = 1 - (0.03 + Math.random() * 0.17);
    const adjustedSpeed = baseSpeed * variance;
    const delay         = ((tiles[targetIdx].word.length * 2.7) / (adjustedSpeed / 60)) * 1000;

    enemyTimer = setTimeout(() => {
        if (!started) return;
        if (tiles[targetIdx].owner !== 'player') { enemy(); return; }
        flip(targetIdx, 'enemy');
        playFlipSound();
        enemyFlips++;
        enemy();
    }, delay);
}

// ─── 구간 타이머 ────────────────────────────────────────

/** segmentDuration마다 segmentIndex를 증가시킨다. */
function segmentTick() {
    if (!started) return;
    segmentTimer = setTimeout(() => {
        segmentIndex = Math.min(segmentIndex + 1, 9);
        segmentTick();
    }, segmentDuration * 1000);
}

// ─── 메인 타이머 ────────────────────────────────────────

/** 1초마다 호출되어 타이머 UI를 갱신하고 시간이 다 되면 게임을 종료한다. */
function tick() {
    if (!started || paused) return;
    updateTimerDisplay(timeLeft);
    updateGauge(timeLeft, totalTime);
    if (timeLeft > 0) {
        timeLeft--;
        setTimeout(tick, 1000);
    } else {
        end();
    }
}

// ─── 게임 준비 (prep) ───────────────────────────────────

/**
 * 새 게임을 준비한다.
 * UI를 전환하고 타일을 생성한 뒤 카운트다운을 시작한다.
 */
function prep() {
    started = false;

    // 상태 초기화
    tiles         = [];
    totalHits     = 0;
    totalMisses   = 0;
    enemyFlips    = 0;
    totalTime     = parseInt(document.getElementById('time').value);
    segmentDuration = totalTime / 10;
    segmentHits   = new Array(10).fill(0);
    segmentIndex  = 0;
    timeLeft      = totalTime;

    hideIntro();
    updateTimerDisplay(timeLeft);
    updateGauge(timeLeft, totalTime);
    updateLiveCount(totalHits);
    setGameBackgroundActive(true);

    // 타일 생성
    const isFlipped = document.getElementById('optFlip').checked;
    for (let i = 0; i < 60; i++) {
        const col         = i % 12;
        const isPlayerCol = isFlipped ? (col >= 6) : (col < 6);
        tiles.push({ owner: isPlayerCol ? 'player' : 'enemy', word: '', rotation: 0 });
        tiles[i].word = rand();
    }

    renderAll(false);
    runCountdown(start);
}

// ─── 게임 시작 (start) ──────────────────────────────────

/** 카운트다운 완료 후 실제 게임을 시작한다. */
function start() {
    started = true;
    showGameUI();
    document.getElementById('input').focus();
    renderAll(true);
    timeLeft = totalTime;
    tick();
    enemy();
    segmentTick();
}

// ─── 게임 종료 (end) ────────────────────────────────────

/** 타이머 만료 시 호출 — 모든 루프를 멈추고 결과창을 표시한다. */
function end() {
    started = false;
    clearTimeout(enemyTimer);
    clearTimeout(segmentTimer);

    showResult({
        totalHits,
        totalMisses,
        enemyFlips,
        segmentHits,
        segmentDuration,
        totalTime,
        tileCounts: [
            tiles.filter(t => t.owner === 'player').length,
            tiles.filter(t => t.owner === 'enemy').length
        ],
        isEasy: document.getElementById('optEasy').checked
    });
}

// ─── 홈으로 ─────────────────────────────────────────────

/** 게임 상태만 리셋하고 메인화면으로 (음악 유지) */
function goHome() {
    started = false;
    paused  = false;
    clearTimeout(enemyTimer);
    clearTimeout(segmentTimer);

    // 오버레이 정리
    document.getElementById('pauseOverlay').classList.remove('active');
    document.getElementById('result').style.display = 'none';

    // UI 초기화
    document.getElementById('intro').style.display       = 'flex';
    document.getElementById('bottom').style.display      = 'none';
    document.getElementById('timeGaugeWrap').style.display = 'none';
    document.getElementById('liveCount').style.display   = 'none';
    document.getElementById('timer').textContent         = '';
    document.getElementById('countdown').textContent     = '';
    document.getElementById('grid').innerHTML            = '';
    document.getElementById('input').value               = '';
    document.getElementById('input').classList.remove('error');

    setGameBackgroundActive(false);

    // 시간 숨김 설정 재적용
    const hideTimer = document.getElementById('optHideTimer')?.checked;
    applyHideTimer(hideTimer);
}

// ─── 재시작 ─────────────────────────────────────────────

/** 게임 중 ↑+R 단축키로 즉시 재시작한다. */
function restartGame() {
    if (!started) return;
    clearTimeout(enemyTimer);
    clearTimeout(segmentTimer);
    document.getElementById('result').style.display = 'none';
    document.getElementById('input').value = '';
    document.getElementById('input').classList.remove('error');
    prep();
}

// ─── 입력 이벤트 바인딩 ─────────────────────────────────

/** 게임 관련 모든 키보드 이벤트를 등록한다. */
function initGameListeners() {
    // Enter / Space → 단어 제출
    document.getElementById('input').addEventListener('keydown', e => {
        // 카운트다운 중(resuming)이거나 일시정지 중이면 제출 무시
        if ((e.key === 'Enter' || e.key === ' ') && started && !paused && !resuming) {
            e.preventDefault();
            const v = e.target.value.trim();
            if (!v) return;

            const idx = tiles.findIndex(t => t.word === v && t.owner === 'enemy');
            if (idx !== -1) {
                playSuccessSound();
                flip(idx, 'player');
                totalHits++;
                segmentHits[segmentIndex]++;
                updateLiveCount(totalHits);
            } else {
                totalMisses++;
                const inp = document.getElementById('input');
                inp.classList.add('error');
                setTimeout(() => inp.classList.remove('error'), 300);
            }
            e.target.value = '';
        }
    });

    // ESC → 일시정지 / 홈으로
    let escPressedOnce = false;
    let escTimer = null;

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            const anyModalOpen = document.querySelector('.modal-overlay.open');
            if (anyModalOpen) return;

            if (!started && !paused) return;

            if (!paused) {
                // 게임 중 ESC → 일시정지
                e.preventDefault();
                paused = true;
                document.getElementById('pauseOverlay').classList.add('active');
                clearTimeout(enemyTimer);
                clearTimeout(segmentTimer);
                escPressedOnce = false;
            } else {
                // 일시정지 중 ESC → 홈으로
                e.preventDefault();
                goHome();
            }
        }

        // 일시정지 중 Enter/Space → 2초 카운트다운 후 재개
        // resuming 플래그로 카운트다운 중복 생성 방지
        if (paused && !resuming && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            resuming = true;
            document.getElementById('pauseOverlay').classList.remove('active');
            const cd = document.getElementById('countdown');
            let c = 2;
            cd.textContent = c;
            const iv = setInterval(() => {
                c--;
                if (c > 0) {
                    cd.textContent = c;
                } else {
                    clearInterval(iv);
                    cd.textContent = '';
                    paused = false;
                    resuming = false;
                    // 기존 타이머 정리 후 재시작 (중복 실행 방지)
                    clearTimeout(enemyTimer);
                    clearTimeout(segmentTimer);
                    tick();
                    enemy();
                    segmentTick();
                }
            }, 1000);
        }
    });

    // ↑ + R → 재시작
    document.addEventListener('keydown', e => {
        pressedKeys.add(e.code);
        if (!started) return;
        if (pressedKeys.has('ArrowUp') && pressedKeys.has('KeyR') && !restartLocked) {
            restartLocked = true;
            e.preventDefault();
            restartGame();
        }
    });

    document.addEventListener('keyup', e => {
        pressedKeys.delete(e.code);
        if (!(pressedKeys.has('ArrowUp') && pressedKeys.has('KeyR'))) {
            restartLocked = false;
        }
    });

    // 시작 버튼
    document.getElementById('startBtn').addEventListener('click', () => {
        if (typeof unlockAndPlay === 'function') unlockAndPlay();
        prep();
    });
}
