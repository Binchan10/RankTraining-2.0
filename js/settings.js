// =============================================
// settings.js — 설정 저장/불러오기 / 모달 / 배경·색상 제어
// =============================================

const LS = {
    get: (key, def) => {
        const v = localStorage.getItem('suzren_' + key);
        return v !== null ? v : def;
    },
    set: (key, value) => localStorage.setItem('suzren_' + key, value)
};

// ─── 배경 이미지 ────────────────────────────────────────

let currentBgImage = '';
let gameActive     = false;
let bgDB           = null;

// IndexedDB 초기화
function initBgDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('SuzrenBgDB', 1);
        req.onupgradeneeded = e => {
            const d = e.target.result;
            if (!d.objectStoreNames.contains('bg')) {
                d.createObjectStore('bg', { keyPath: 'id' });
            }
        };
        req.onsuccess = e => { bgDB = e.target.result; resolve(); };
        req.onerror   = () => reject(req.error);
    });
}

function bgDBSave(blob, name) {
    return new Promise((resolve, reject) => {
        const tx  = bgDB.transaction('bg', 'readwrite');
        const req = tx.objectStore('bg').put({ id: 'current', blob, name });
        req.onsuccess = () => resolve();
        req.onerror   = () => reject(req.error);
    });
}

function bgDBLoad() {
    return new Promise((resolve, reject) => {
        const tx  = bgDB.transaction('bg', 'readonly');
        const req = tx.objectStore('bg').get('current');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror   = () => reject(req.error);
    });
}

function bgDBClear() {
    return new Promise((resolve, reject) => {
        const tx  = bgDB.transaction('bg', 'readwrite');
        const req = tx.objectStore('bg').delete('current');
        req.onsuccess = () => resolve();
        req.onerror   = () => reject(req.error);
    });
}

function updateGameBackgroundClass() {
    document.body.classList.toggle('game-active', gameActive && !!currentBgImage);
}

function applyBackgroundImage(url) {
    currentBgImage = url || '';
    const value = currentBgImage ? `url("${currentBgImage}")` : 'none';
    document.documentElement.style.setProperty('--bg-image', value);
    updateGameBackgroundClass();
}

function setGameBackgroundActive(active) {
    gameActive = active;
    updateGameBackgroundClass();
}

function updateBgStatus(name) {
    document.getElementById('bgStatus').textContent =
        name ? '선택됨: ' + name : '선택된 이미지 없음';
}

// ─── 판 색상 커스텀 ─────────────────────────────────────

// 현재 선택된 색상 id
let playerColorId = LS.get('playerColor', 'blue1');
let enemyColorId  = LS.get('enemyColor',  'red1');

// 내 판 / 상대 판 중 어느 쪽을 선택 중인지
let tileTarget = 'player'; // 'player' | 'enemy'

function getTileColor(id) {
    return TILE_COLORS.find(c => c.id === id) || TILE_COLORS[0];
}

function applyTileColors() {
    const p = getTileColor(playerColorId);
    const e = getTileColor(enemyColorId);
    const root = document.documentElement.style;
    root.setProperty('--player-grad',   p.grad);
    root.setProperty('--player-text',   p.text);
    root.setProperty('--player-border', p.border);
    root.setProperty('--enemy-grad',    e.grad);
    root.setProperty('--enemy-text',    e.text);
    root.setProperty('--enemy-border',  e.border);
}

function renderTileColorPicker() {
    const container = document.getElementById('tileColorGrid');
    if (!container) return;

    const currentId = tileTarget === 'player' ? playerColorId : enemyColorId;
    const blockedId = tileTarget === 'player' ? enemyColorId  : playerColorId;

    container.innerHTML = TILE_COLORS.map(c => {
        const isSelected = c.id === currentId;
        const isBlocked  = c.id === blockedId;
        return `<div class="tile-color-chip ${isSelected ? 'selected' : ''} ${isBlocked ? 'blocked' : ''}"
                     data-id="${c.id}"
                     style="background: ${c.grad};">
                    ${isBlocked ? '<span class="chip-block-x">✕</span>' : ''}
                </div>`;
    }).join('');

    container.querySelectorAll('.tile-color-chip:not(.blocked)').forEach(chip => {
        chip.addEventListener('click', () => {
            if (tileTarget === 'player') {
                playerColorId = chip.dataset.id;
                LS.set('playerColor', playerColorId);
            } else {
                enemyColorId = chip.dataset.id;
                LS.set('enemyColor', enemyColorId);
            }
            applyTileColors();
            renderTileColorPicker();
            updateTileTargetBtns();
        });
    });
}

function updateTileTargetBtns() {
    const pBtn   = document.getElementById('btnTilePlayer');
    const eBtn   = document.getElementById('btnTileEnemy');
    const pDot   = document.getElementById('dotPlayer');
    const eDot   = document.getElementById('dotEnemy');
    if (!pBtn || !eBtn) return;

    const p = getTileColor(playerColorId);
    const e = getTileColor(enemyColorId);

    pBtn.classList.toggle('active', tileTarget === 'player');
    eBtn.classList.toggle('active', tileTarget === 'enemy');

    if (pDot) pDot.style.background = p.grad;
    if (eDot) eDot.style.background = e.grad;
}

function initTileColorPicker() {
    const pBtn = document.getElementById('btnTilePlayer');
    const eBtn = document.getElementById('btnTileEnemy');
    if (!pBtn || !eBtn) return;

    pBtn.addEventListener('click', () => {
        tileTarget = 'player';
        updateTileTargetBtns();
        renderTileColorPicker();
    });

    eBtn.addEventListener('click', () => {
        tileTarget = 'enemy';
        updateTileTargetBtns();
        renderTileColorPicker();
    });

    // 탭 전환
    document.querySelectorAll('.custom-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.custom-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.custom-tab-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('panel' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1))?.classList.add('active');
        });
    });
}

// ─── 설정 저장/불러오기 ─────────────────────────────────

function saveSettings() {
    LS.set('time',      document.getElementById('time').value);
    LS.set('speed',     document.getElementById('speed').value);
    LS.set('easy',      document.getElementById('optEasy').checked);
    LS.set('flip',      document.getElementById('optFlip').checked);
    LS.set('mute',      document.getElementById('optMute').checked);
    LS.set('hideTimer', document.getElementById('optHideTimer').checked);
}

function loadSettings() {
    document.getElementById('time').value  = LS.get('time',  '60');
    document.getElementById('speed').value = LS.get('speed', '1000');
    document.getElementById('optEasy').checked      = LS.get('easy',      'false') === 'true';
    document.getElementById('optFlip').checked      = LS.get('flip',      'false') === 'true';
    document.getElementById('optMute').checked      = LS.get('mute',      'false') === 'true';
    document.getElementById('optHideTimer').checked = LS.get('hideTimer', 'false') === 'true';
    applyHideTimer(LS.get('hideTimer', 'false') === 'true');

    playerColorId = LS.get('playerColor', 'blue1');
    enemyColorId  = LS.get('enemyColor',  'red1');
    applyTileColors();
    initTileColorPicker();
    renderTileColorPicker();
    updateTileTargetBtns();

    // 배경이미지는 IndexedDB에서 비동기로 불러옴
    initBgDB().then(() => bgDBLoad()).then(row => {
        if (row && row.blob) {
            const url = URL.createObjectURL(row.blob);
            applyBackgroundImage(url);
            updateBgStatus(row.name || '이미지');
        }
    }).catch(() => {});
}

// ─── 모달 공통 로직 ─────────────────────────────────────

function openModal(overlayId) {
    document.getElementById(overlayId).classList.add('open');
}

function closeModal(overlayId) {
    document.getElementById(overlayId).classList.remove('open');
}

function initModals() {
    // 버튼 → 모달 연결
    const map = {
        'btnGameSettings': 'gameSettingsOverlay',
        'btnCustom':       'customOverlay',
        'btnShortcuts':    'shortcutsOverlay',
        'btnRank':         'rankTableOverlay',
        'btnHof':          'hofOverlay'
    };

    Object.entries(map).forEach(([btnId, overlayId]) => {
        const btn = document.getElementById(btnId);
        if (btn) btn.addEventListener('click', () => openModal(overlayId));
    });

    // 닫기 버튼
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const overlayId = btn.dataset.close;
            if (overlayId) closeModal(overlayId);
        });
    });

    // 오버레이 바깥 클릭 시 닫기
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeModal(overlay.id);
        });
    });

    // ESC 키
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.open').forEach(overlay => {
                closeModal(overlay.id);
            });
        }
    });
}

// ─── 이벤트 바인딩 ──────────────────────────────────────

function initSettingsListeners() {
    ['time', 'speed', 'optEasy', 'optFlip', 'optMute', 'optHideTimer'].forEach(id => {
        document.getElementById(id).addEventListener('change', saveSettings);
    });

    // 시간 숨김 실시간 반영
    document.getElementById('optHideTimer').addEventListener('change', e => {
        applyHideTimer(e.target.checked);
    });

    document.getElementById('bgFile').addEventListener('change', async e => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!bgDB) await initBgDB();
        await bgDBSave(file, file.name || '이미지');
        const url = URL.createObjectURL(file);
        applyBackgroundImage(url);
        updateBgStatus(file.name || '이미지');
        if (gameActive) updateGameBackgroundClass();
    });

    document.getElementById('bgClear').addEventListener('click', async () => {
        if (!bgDB) await initBgDB();
        await bgDBClear();
        applyBackgroundImage('');
        updateBgStatus('');
        document.getElementById('bgFile').value = '';
    });
}

// ─── 명예의 전당 ─────────────────────────────────────────

function saveHofRecord(totalHits, hitsPerMin, totalTime, isEasy) {
    const key = isEasy ? 'hof_easy' : 'hof_rank';
    const speed = document.getElementById('speed').value;
    let records = [];
    try { records = JSON.parse(LS.get(key, '[]')); } catch(e) { records = []; }
    records.push({
        hits: totalHits,
        hitsPerMin,
        totalTime,
        rank: getRank(hitsPerMin),
        speed,
        date: new Date().toLocaleDateString('ko-KR')
    });
    // 분당 환산 기준 내림차순, 동점이면 먼저 세운 기록이 위 (stable sort 활용)
    records.sort((a, b) => {
        const aHpm = a.hitsPerMin ?? a.hits; // 구버전 호환
        const bHpm = b.hitsPerMin ?? b.hits;
        return bHpm - aHpm;
    });
    records = records.slice(0, 5);
    LS.set(key, JSON.stringify(records));
}


/** 명전 speed 셀 텍스트 생성: 60초면 (vs N타), 초과면 (vs N타, N초) */
function hofSpeedLabel(r) {
    const t = r.totalTime ?? 60; // 구버전 호환
    if (t === 60) return `(vs ${r.speed || '?'}타)`;
    return `(vs ${r.speed || '?'}타, ${t}초)`;
}

function renderHofList(listId, isEasy) {
    const key = isEasy ? 'hof_easy' : 'hof_rank';
    let records = [];
    try { records = JSON.parse(LS.get(key, '[]')); } catch(e) { records = []; }

    const container = document.getElementById(listId);
    if (!container) return;

    if (records.length === 0) {
        container.innerHTML = '<div class="hof-empty">기록 없음</div>';
        return;
    }

    container.innerHTML = records.map((r, i) => {
        const rankClass = 'hof-rank-' + r.rank.replace('+', 'p');
        return `<div class="hof-row">
            <span class="hof-num">${i + 1}</span>
            <span class="hof-rank-badge ${rankClass}">${r.rank}</span>
            <span class="hof-hits">${r.hits}</span>
            <span class="hof-speed">${hofSpeedLabel(r)}</span>
            <span class="hof-date">${r.date}</span>
        </div>`;
    }).join('');
}

// ─── 시간 숨김 ──────────────────────────────────────────

function applyHideTimer(hide) {
    const timer = document.getElementById('timer');
    const gauge = document.getElementById('timeGaugeWrap');
    if (timer) timer.style.opacity = hide ? '0' : '';
    if (gauge) gauge.style.opacity = hide ? '0' : '';
}

// ─── 음악 UI 인터랙션 ───────────────────────────────────

function initMusicUI() {
    // 셔플 토글
    const shuffleBtn = document.getElementById('btnShuffleToggle');
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            const isOrder = shuffleBtn.dataset.mode === 'order';
            shuffleBtn.dataset.mode = isOrder ? 'shuffle' : 'order';
            document.getElementById('iconOrder').style.display  = isOrder ? 'none' : '';
            document.getElementById('iconShuffle').style.display = isOrder ? '' : 'none';
            shuffleBtn.classList.toggle('active', isOrder);
        });
    }

    // 반복 토글
    const repeatBtn = document.getElementById('btnRepeatToggle');
    if (repeatBtn) {
        repeatBtn.addEventListener('click', () => {
            const isAll = repeatBtn.dataset.mode === 'all';
            repeatBtn.dataset.mode = isAll ? 'one' : 'all';
            document.getElementById('iconRepeatAll').style.display = isAll ? 'none' : '';
            document.getElementById('iconRepeatOne').style.display = isAll ? '' : 'none';
            repeatBtn.classList.toggle('active', isAll);
        });
    }

    // 볼륨 슬라이더 → 음소거 아이콘 전환
    const volSlider = document.getElementById('musicVolume');
    const volNormal = document.getElementById('volIconNormal');
    const volMute   = document.getElementById('volIconMute');
    const volBtn    = document.getElementById('volIconBtn');

    function updateVolIcon() {
        const muted = parseInt(volSlider.value) === 0;
        volNormal.style.display = muted ? 'none' : '';
        volMute.style.display   = muted ? '' : 'none';
        volBtn.classList.toggle('muted', muted);
    }

    if (volSlider) {
        volSlider.addEventListener('input', updateVolIcon);
        updateVolIcon();
    }

    // 볼륨 아이콘 클릭 → 음소거 토글
    if (volBtn && volSlider) {
        volBtn.addEventListener('click', () => {
            if (parseInt(volSlider.value) === 0) {
                volSlider.value = 70;
            } else {
                volSlider.value = 0;
            }
            updateVolIcon();
        });
    }
}

// ─── 명예의 전당 모달 전용 렌더링 ───────────────────────

function renderHofModal() {
    renderHofListModal('hofRankListModal', false);
    renderHofListModal('hofEasyListModal', true);
}

function renderHofListModal(listId, isEasy) {
    const key = isEasy ? 'hof_easy' : 'hof_rank';
    let records = [];
    try { records = JSON.parse(LS.get(key, '[]')); } catch(e) { records = []; }

    const container = document.getElementById(listId);
    if (!container) return;

    if (records.length === 0) {
        container.innerHTML = '<div class="hof-empty">기록 없음</div>';
        return;
    }

    container.innerHTML = records.map((r, i) => {
        const rankClass = 'hof-rank-' + r.rank.replace('+', 'p');
        return `<div class="hof-row hof-row--modal">
            <span class="hof-num">${i + 1}</span>
            <span class="hof-rank-badge ${rankClass}">${r.rank}</span>
            <span class="hof-hits">${r.hits}</span>
            <span class="hof-speed">${hofSpeedLabel(r)}</span>
            <span class="hof-date">${r.date}</span>
        </div>`;
    }).join('');
}

// 트로피 버튼 클릭 시 모달 열고 렌더링
document.addEventListener('DOMContentLoaded', () => {
    const hofBtn = document.getElementById('btnHof');
    if (hofBtn) {
        hofBtn.addEventListener('click', () => {
            renderHofModal();
            openModal('hofOverlay');
        });
    }

    // 초기화 버튼
    const resetBtn = document.getElementById('btnHofReset');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('명예의 전당 기록을 모두 초기화할까요?')) {
                LS.set('hof_rank', '[]');
                LS.set('hof_easy', '[]');
                renderHofModal();
            }
        });
    }
});
