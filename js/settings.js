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

// ─── 색상 프리셋 ────────────────────────────────────────

function applyColorPreset(presetId) {
    const preset = COLOR_PRESETS[presetId] || COLOR_PRESETS.classic;
    const root   = document.documentElement.style;
    root.setProperty('--player-grad',   preset.player.grad);
    root.setProperty('--player-text',   preset.player.text);
    root.setProperty('--player-border', preset.player.border);
    root.setProperty('--enemy-grad',    preset.enemy.grad);
    root.setProperty('--enemy-text',    preset.enemy.text);
    root.setProperty('--enemy-border',  preset.enemy.border);
}

// ─── 프리셋 미리보기 렌더링 ─────────────────────────────

const PRESET_NAMES = {
    classic: '클래식 (Classic)',
    aurora:  '오로라 (Aurora)',
    solar:   '솔라 (Solar)',
    forest:  '포레스트 (Forest)',
    mono:    '모노 (Mono)'
};

function renderPresetList(currentPreset) {
    const container = document.getElementById('presetList');
    if (!container) return;
    container.innerHTML = '';

    Object.keys(COLOR_PRESETS).forEach(key => {
        const preset = COLOR_PRESETS[key];
        const item = document.createElement('div');
        item.className = 'preset-item' + (key === currentPreset ? ' active' : '');
        item.dataset.preset = key;

        const chips = document.createElement('div');
        chips.className = 'preset-chips';

        const pChip = document.createElement('div');
        pChip.className = 'preset-chip';
        pChip.style.background = preset.player.grad;
        pChip.title = '내 판';

        const eChip = document.createElement('div');
        eChip.className = 'preset-chip';
        eChip.style.background = preset.enemy.grad;
        eChip.title = '상대 판';

        chips.appendChild(pChip);
        chips.appendChild(eChip);

        const label = document.createElement('span');
        label.className = 'preset-name';
        label.textContent = PRESET_NAMES[key];

        item.appendChild(chips);
        item.appendChild(label);

        item.addEventListener('click', () => {
            document.querySelectorAll('.preset-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            LS.set('preset', key);
            applyColorPreset(key);
        });

        container.appendChild(item);
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
    LS.set('preset', LS.get('preset', 'classic'));
}

function loadSettings() {
    document.getElementById('time').value  = LS.get('time',  '60');
    document.getElementById('speed').value = LS.get('speed', '1000');
    document.getElementById('optEasy').checked      = LS.get('easy',      'false') === 'true';
    document.getElementById('optFlip').checked      = LS.get('flip',      'false') === 'true';
    document.getElementById('optMute').checked      = LS.get('mute',      'false') === 'true';
    document.getElementById('optHideTimer').checked = LS.get('hideTimer', 'false') === 'true';
    applyHideTimer(LS.get('hideTimer', 'false') === 'true');

    const preset = LS.get('preset', 'classic');
    applyColorPreset(preset);
    renderPresetList(preset);

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
