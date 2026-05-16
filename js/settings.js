// =============================================
// settings.js — 설정 저장/불러오기 / 배경·색상 제어
// =============================================

/** localStorage 래퍼 (네임스페이스: 'suzren_') */
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

/**
 * body에 .game-active 클래스를 조건부 토글하여
 * 게임 중에만 배경 이미지를 표시한다.
 */
function updateGameBackgroundClass() {
    document.body.classList.toggle('game-active', gameActive && !!currentBgImage);
}

/**
 * CSS 변수 --bg-image에 url()을 주입하고 상태를 갱신한다.
 * @param {string} url  data-URL 또는 빈 문자열
 */
function applyBackgroundImage(url) {
    currentBgImage = url || '';
    const value = currentBgImage ? `url("${currentBgImage}")` : 'none';
    document.documentElement.style.setProperty('--bg-image', value);
    updateGameBackgroundClass();
}

/**
 * 게임 진행 여부를 알리고 배경 클래스를 갱신한다.
 * @param {boolean} active
 */
function setGameBackgroundActive(active) {
    gameActive = active;
    updateGameBackgroundClass();
}

/**
 * 배경 이미지 파일 선택 UI의 상태 문자열을 갱신한다.
 * @param {string} name  파일명 (없으면 빈 문자열)
 */
function updateBgStatus(name) {
    document.getElementById('bgStatus').textContent =
        name ? '선택됨: ' + name : '선택된 이미지 없음';
}

// ─── 색상 프리셋 ────────────────────────────────────────

/**
 * 선택된 프리셋의 CSS 변수를 :root에 적용한다.
 * @param {string} presetId  COLOR_PRESETS의 키
 */
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

// ─── 설정 저장/불러오기 ─────────────────────────────────

/** 현재 UI 상태를 localStorage에 저장한다. */
function saveSettings() {
    LS.set('time',  document.getElementById('time').value);
    LS.set('speed', document.getElementById('speed').value);
    LS.set('easy',  document.getElementById('optEasy').checked);
    LS.set('flip',  document.getElementById('optFlip').checked);
    LS.set('mute',  document.getElementById('optMute').checked);
    LS.set('preset', document.getElementById('colorPreset').value);
}

/** localStorage에서 설정을 읽어 UI와 CSS에 반영한다. */
function loadSettings() {
    document.getElementById('time').value  = LS.get('time',  '60');
    document.getElementById('speed').value = LS.get('speed', '1000');
    document.getElementById('optEasy').checked = LS.get('easy', 'false') === 'true';
    document.getElementById('optFlip').checked = LS.get('flip', 'false') === 'true';
    document.getElementById('optMute').checked = LS.get('mute', 'false') === 'true';

    const preset = LS.get('preset', 'classic');
    document.getElementById('colorPreset').value = preset;
    applyColorPreset(preset);

    const savedBg     = LS.get('bg',     '');
    const savedBgName = LS.get('bgName', '');
    applyBackgroundImage(savedBg);
    updateBgStatus(savedBgName);
}

// ─── 설정 패널 토글 ─────────────────────────────────────

/** 추가 설정 패널(모달)을 열고 닫는다. */
function initSettingsPanel() {
    const toggle = document.getElementById('settingsToggle');
    const overlay = document.getElementById('settingsOverlay');
    const closeBtn = document.getElementById('settingsClose');
    if (!toggle || !overlay) return;

    const setOpen = (open) => {
        if (open) {
            overlay.classList.add('open');
        } else {
            overlay.classList.remove('open');
        }
    };

    toggle.addEventListener('click', () => setOpen(true));
    if (closeBtn) {
        closeBtn.addEventListener('click', () => setOpen(false));
    }

    overlay.addEventListener('click', (e) => {
        // 모달 바깥 배경 클릭 시 닫기
        if (e.target === overlay) {
            setOpen(false);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
            setOpen(false);
        }
    });
}

// ─── 이벤트 바인딩 ──────────────────────────────────────

/** 설정 관련 모든 이벤트 리스너를 등록한다. */
function initSettingsListeners() {
    // 기본 옵션 변경 → 즉시 저장
    ['time', 'speed', 'optEasy', 'optFlip', 'optMute'].forEach(id => {
        document.getElementById(id).addEventListener('change', saveSettings);
    });

    // 색상 프리셋
    document.getElementById('colorPreset').addEventListener('change', () => {
        const presetId = document.getElementById('colorPreset').value;
        LS.set('preset', presetId);
        applyColorPreset(presetId);
    });

    // 배경 이미지 업로드
    document.getElementById('bgFile').addEventListener('change', e => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            LS.set('bg',     dataUrl);
            LS.set('bgName', file.name || '이미지');
            applyBackgroundImage(dataUrl);
            updateBgStatus(file.name || '이미지');
            if (gameActive) updateGameBackgroundClass();
        };
        reader.readAsDataURL(file);
    });

    // 배경 이미지 제거
    document.getElementById('bgClear').addEventListener('click', () => {
        LS.set('bg',     '');
        LS.set('bgName', '');
        applyBackgroundImage('');
        updateBgStatus('');
        document.getElementById('bgFile').value = '';
    });
}
