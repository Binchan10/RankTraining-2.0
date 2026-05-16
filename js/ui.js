// =============================================
// ui.js — DOM 렌더링 / 게이지 / 카운트다운 / 라이브 카운트
// =============================================

// ─── 타일 그리드 렌더링 ─────────────────────────────────

/**
 * tiles 배열을 읽어 #grid를 전부 다시 그린다.
 * @param {boolean} showText  단어 텍스트 표시 여부 (카운트다운 중에는 false)
 */
function renderAll(showText = true) {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    tiles.forEach((t, i) => {
        const container = document.createElement('div');
        container.id        = 'tile-container-' + i;
        container.className = 'tile ' + t.owner;
        container.style.transform = `rotateY(${t.rotation}deg)`;

        const front = document.createElement('div');
        front.className = 'tile-face tile-front';
        front.textContent = showText ? t.word : '';

        const back = document.createElement('div');
        back.className = 'tile-face tile-back';
        back.textContent = showText ? t.word : '';

        container.appendChild(front);
        container.appendChild(back);
        grid.appendChild(container);
    });
}

// ─── 타이머 텍스트 ──────────────────────────────────────

/**
 * 타이머 텍스트를 갱신하고 위험(10초 이하) 스타일을 적용한다.
 * @param {number} timeLeft  남은 초
 */
function updateTimerDisplay(timeLeft) {
    const el = document.getElementById('timer');
    el.textContent = '남은 시간: ' + timeLeft + '초';
    if (timeLeft <= 10) el.classList.add('danger');
    else                el.classList.remove('danger');
}

// ─── 시간 게이지 ────────────────────────────────────────

/**
 * 남은 시간 비율에 따라 게이지 너비·색상을 갱신한다.
 * @param {number} timeLeft   남은 초
 * @param {number} totalTime  전체 초
 */
function updateGauge(timeLeft, totalTime) {
    const fill = document.getElementById('timeGaugeFill');
    const pct  = (timeLeft / totalTime) * 100;
    fill.style.width = pct + '%';

    if (timeLeft <= 10) {
        fill.classList.remove('half');
        fill.classList.add('danger');
    } else if (timeLeft <= totalTime / 2) {
        fill.classList.remove('danger');
        fill.classList.add('half');
    } else {
        fill.classList.remove('half', 'danger');
    }
}

// ─── 라이브 카운트 (정타 수) ────────────────────────────

/**
 * 화면 상단의 정타 수 표시를 갱신한다.
 * @param {number} count  현재 누적 정타 수
 */
function updateLiveCount(count) {
    document.getElementById('liveCount').textContent = count;
}

// ─── 카운트다운 ─────────────────────────────────────────

/**
 * 3→2→1 카운트다운을 표시한 뒤 onStart 콜백을 호출한다.
 * @param {Function} onStart  카운트다운 완료 후 실행할 함수
 */
function runCountdown(onStart) {
    let c  = 3;
    const cd = document.getElementById('countdown');
    cd.textContent = c;

    const iv = setInterval(() => {
        c--;
        if (c > 0) {
            cd.textContent = c;
        } else {
            clearInterval(iv);
            cd.textContent = '';
            onStart();
        }
    }, 1000);
}

// ─── 게임 UI 표시/숨김 ──────────────────────────────────

/** 게임 시작 시 필요한 UI 요소를 표시한다. */
function showGameUI() {
    document.getElementById('bottom').style.display        = 'flex';
    document.getElementById('timeGaugeWrap').style.display = 'block';
    document.getElementById('liveCount').style.display     = 'block';
}

/** 인트로 화면을 숨기고 게임 레이아웃 전환을 준비한다. */
function hideIntro() {
    document.getElementById('intro').style.display  = 'none';
    document.getElementById('bottom').style.display = 'none';
}
