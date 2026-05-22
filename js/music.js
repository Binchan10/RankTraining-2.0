// =============================================
// music.js — 음악 재생 / UI / 상태 저장
// =============================================

const TRACKS = [
    // ── 기본 시작곡 ──────────────────────────────────────
    { file: 'Raindrop_Flower.mp3',             name: 'Raindrop Flower',             gain: 1.0 },
    // ── ABC 순 ───────────────────────────────────────────
    { file: 'Above_the_Treetops.mp3',          name: 'Above the Treetops',          gain: 1.2 },
    { file: 'Amoria.mp3',                      name: 'Amoria',                      gain: 1.0 },
    { file: 'Aquarium.mp3',                    name: 'Aquarium',                    gain: 1.0 },
    { file: 'Beachway.mp3',                    name: 'Beachway',                    gain: 1.0 },
    { file: 'Blue_World.mp3',                  name: 'Blue World',                  gain: 1.0 },
    { file: 'Cava_Bien.mp3',                   name: 'Cava Bien',                   gain: 1.0 },
    { file: 'ChewChew_MainTheme.m4a',          name: 'ChewChew Main Theme',         gain: 1.0 },
    { file: 'Coke_Town.mp3',                   name: 'Coke Town',                   gain: 1.0 },
    { file: 'Come_with_Me.mp3',                name: 'Come with Me',                gain: 1.0 },
    { file: 'DarkMountain.mp3',                name: 'Dark Mountain',               gain: 1.0 },
    { file: 'Deep_Sea.mp3',                    name: 'Deep Sea',                    gain: 1.0 },
    { file: 'Fairytale_diffvers.mp3',          name: 'Fairytale',                   gain: 1.0 },
    { file: 'Fantasia.mp3',                    name: 'Fantasia',                    gain: 1.0 },
    { file: 'Fantastic_Thinking.mp3',          name: 'Fantastic Thinking',          gain: 1.0 },
    { file: 'Finding_Forest.mp3',              name: 'Finding Forest',              gain: 1.0 },
    { file: 'Floral_Life.mp3',                 name: 'Floral Life',                 gain: 1.0 },
    { file: 'Flying_in_a_Blue_Dream.mp3',      name: 'Flying in a Blue Dream',      gain: 1.0 },
    { file: 'High_Enough.mp3',                 name: 'High Enough',                 gain: 1.0 },
    { file: 'Ignition_Full_Moon_Party.mp3',    name: 'Ignition Full Moon Party',    gain: 1.0 },
    { file: 'Illiyard_Moor.mp3',               name: 'Illiyard Moor',               gain: 1.0 },
    { file: 'Jungle_Book.mp3',                 name: 'Jungle Book',                 gain: 1.0 },
    { file: 'Karotte.mp3',                     name: 'Karotte',                     gain: 1.0 },
    { file: 'Kerning_Square.mp3',              name: 'Kerning Square',              gain: 1.0 },
    { file: 'Leafre.mp3',                      name: 'Leafre',                      gain: 1.0 },
    { file: 'Lets_Hunt_Aliens.mp3',            name: "Let's Hunt Aliens",           gain: 1.0 },
    { file: 'LucidDream2.m4a',                 name: 'Lucid Dream',                 gain: 1.0 },
    { file: 'Luens_House.mp3',                 name: "Luen's House",                gain: 1.0 },
    { file: 'Missing_You.mp3',                 name: 'Missing You',                 gain: 1.0 },
    { file: 'Mushroom_Castle.mp3',             name: 'Mushroom Castle',             gain: 1.0 },
    { file: 'Nautilus.mp3',                    name: 'Nautilus',                    gain: 1.0 },
    { file: 'Night_Market.mp3',                name: 'Night Market',                gain: 1.0 },
    { file: 'Orbis_Shinin_Harbor.mp3',         name: "Orbis Shinin' Harbor",        gain: 1.0 },
    { file: 'Out_of_the_Wilderness.mp3',       name: 'Out of the Wilderness',       gain: 1.0 },
    { file: 'Outlaw_of_the_Lonely_Island.mp3', name: 'Outlaw of the Lonely Island', gain: 1.0 },
    { file: 'Queens_Garden.mp3',               name: "Queen's Garden",              gain: 1.0 },
    { file: 'Secret_Flower.mp3',               name: 'Secret Flower',               gain: 1.0 },
    { file: 'Skyscraper.mp3',                  name: 'Skyscraper',                  gain: 1.0 },
    { file: 'Snow_Drop.mp3',                   name: 'Snow Drop',                   gain: 1.0 },
    { file: 'Snowy_Village.mp3',               name: 'Snowy Village',               gain: 1.0 },
    { file: 'Subway.mp3',                      name: 'Subway',                      gain: 1.0 },
    { file: 'The_Knight_of_Sharenian.m4a',     name: 'The Knight of Sharenian',     gain: 1.0 },
    { file: 'The_Land_of_Peach_Blossoms.mp3',  name: 'The Land of Peach Blossoms',  gain: 1.0 },
    { file: 'The_Lost_City_Among_the_Clouds.mp3', name: 'The Lost City Among the Clouds', gain: 1.0 },
    { file: 'Tower_of_Goddess.mp3',            name: 'Tower of Goddess',            gain: 1.0 },
    { file: 'Upon_the_Sky.mp3',                name: 'Upon the Sky',                gain: 1.0 },
    { file: 'Urban_Street.mp3',                name: 'Urban Street',                gain: 1.0 },
    { file: 'When_the_Morning_Comes.mp3',      name: 'When the Morning Comes',      gain: 1.0 },
    { file: 'Where_Stars_Rest_B.mp3',          name: 'Where Stars Rest',            gain: 1.0 },
    { file: 'White_Christmas.mp3',             name: 'White Christmas',             gain: 1.0 },
];

// ─── 상태 ───────────────────────────────────────────────

const MLS = {
    get: (key, def) => { const v = localStorage.getItem('suzren_music_' + key); return v !== null ? v : def; },
    set: (key, val) => localStorage.setItem('suzren_music_' + key, val)
};

let audio         = new Audio();
let currentIndex  = -1;
let isPlaying     = false;
let isShuffle     = MLS.get('shuffle', 'false') === 'true';
let repeatMode    = MLS.get('repeat', 'all');   // 'all' | 'one'
let volume        = parseFloat(MLS.get('volume', '0.7'));
let audioUnlocked = false;

// 체크 상태 (기본: 전체 true)
let checkedTracks = (() => {
    try { return JSON.parse(MLS.get('checked', 'null')) || TRACKS.map(() => true); }
    catch { return TRACKS.map(() => true); }
})();

// ─── 재생 목록 ──────────────────────────────────────────

function getPlaylist() {
    return TRACKS.map((t, i) => i).filter(i => checkedTracks[i]);
}

function getNextIndex(current) {
    const pl = getPlaylist();
    if (!pl.length) return -1;
    if (repeatMode === 'one') return current;
    if (isShuffle) return pl[Math.floor(Math.random() * pl.length)];
    const pos = pl.indexOf(current);
    return pl[(pos + 1) % pl.length];
}

function getPrevIndex(current) {
    const pl = getPlaylist();
    if (!pl.length) return -1;
    if (isShuffle) return pl[Math.floor(Math.random() * pl.length)];
    const pos = pl.indexOf(current);
    return pl[(pos - 1 + pl.length) % pl.length];
}

// ─── 재생 ───────────────────────────────────────────────

function playTrack(index) {
    if (index < 0 || index >= TRACKS.length) return;
    currentIndex = index;
    const t = TRACKS[index];
    audio.src = 'music/' + t.file;
    audio.volume = Math.min(1, volume * t.gain);
    audio.play().catch(() => {});
    isPlaying = true;
    MLS.set('playing', 'true');
    MLS.set('lastIndex', index);
    updateNowPlaying();
    updatePlayBtn();
    updateTrackList();
}

function togglePlay() {
    if (!audioUnlocked) return;
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        MLS.set('playing', 'false');
    } else {
        if (currentIndex < 0) {
            const pl = getPlaylist();
            if (pl.length) playTrack(pl[0]);
            return;
        }
        audio.play().catch(() => {});
        isPlaying = true;
        MLS.set('playing', 'true');
    }
    updatePlayBtn();
}

function playNext() {
    const next = getNextIndex(currentIndex);
    if (next >= 0) playTrack(next);
}

function playPrev() {
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    const prev = getPrevIndex(currentIndex);
    if (prev >= 0) playTrack(prev);
}

// 자동 다음 곡
audio.addEventListener('ended', () => {
    if (repeatMode === 'one') { audio.play(); return; }
    playNext();
});

// ─── 브라우저 잠금 해제 (수련 시작 버튼에서 호출) ────────

function unlockAndPlay() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    const shouldPlay = MLS.get('playing', 'true') === 'true';
    if (!shouldPlay) return;
    const pl = getPlaylist();
    if (!pl.length) return;
    const last = parseInt(MLS.get('lastIndex', '-1'));
    const startIdx = pl.includes(last) ? last : pl[0];
    playTrack(startIdx);
}

// ─── UI 업데이트 ────────────────────────────────────────

function updateNowPlaying() {
    const el = document.getElementById('musicTitle');
    if (el) el.textContent = currentIndex >= 0 ? TRACKS[currentIndex].name : '— 음악 없음 —';
}

function updatePlayBtn() {
    const play  = document.getElementById('iconPlay');
    const pause = document.getElementById('iconPause');
    if (!play || !pause) return;
    play.style.display  = isPlaying ? 'none' : '';
    pause.style.display = isPlaying ? '' : 'none';
}

function updateTrackList() {
    document.querySelectorAll('.track-item').forEach((el, i) => {
        el.classList.toggle('playing', i === currentIndex);
    });
}

function updateShuffleBtn() {
    const btn = document.getElementById('btnShuffleToggle');
    if (!btn) return;
    btn.classList.toggle('active', isShuffle);
    document.getElementById('iconOrder').style.display   = isShuffle ? 'none' : '';
    document.getElementById('iconShuffle').style.display = isShuffle ? '' : 'none';
}

function updateRepeatBtn() {
    const btn = document.getElementById('btnRepeatToggle');
    if (!btn) return;
    const isOne = repeatMode === 'one';
    btn.classList.toggle('active', isOne);
    document.getElementById('iconRepeatAll').style.display = isOne ? 'none' : '';
    document.getElementById('iconRepeatOne').style.display = isOne ? '' : 'none';
}

function updateVolIcon() {
    const val    = parseInt(document.getElementById('musicVolume')?.value || 70);
    const normal = document.getElementById('volIconNormal');
    const mute   = document.getElementById('volIconMute');
    const btn    = document.getElementById('volIconBtn');
    if (!normal || !mute) return;
    const muted = val === 0;
    normal.style.display = muted ? 'none' : '';
    mute.style.display   = muted ? '' : 'none';
    if (btn) btn.classList.toggle('muted', muted);
}

// ─── 곡 목록 렌더링 ─────────────────────────────────────

function renderTrackList() {
    const container = document.getElementById('trackList');
    if (!container) return;

    const checkedCount = checkedTracks.filter(Boolean).length;
    const header = document.getElementById('trackListHeader');
    if (header) header.textContent = `곡 목록 (${checkedCount}/${TRACKS.length})`;

    container.innerHTML = TRACKS.map((t, i) => `
        <div class="track-item ${i === currentIndex ? 'playing' : ''}" data-index="${i}">
            <label class="track-check">
                <input type="checkbox" class="track-checkbox" data-index="${i}" ${checkedTracks[i] ? 'checked' : ''}>
                <span class="track-checkmark"></span>
            </label>
            <span class="track-name">${t.name}</span>
            <button class="track-play-btn" data-index="${i}" title="바로 재생">▶</button>
        </div>
    `).join('');

    // 체크박스 이벤트
    container.querySelectorAll('.track-checkbox').forEach(cb => {
        cb.addEventListener('change', e => {
            const idx = parseInt(e.target.dataset.index);
            checkedTracks[idx] = e.target.checked;
            MLS.set('checked', JSON.stringify(checkedTracks));
            const header = document.getElementById('trackListHeader');
            if (header) header.textContent = `곡 목록 (${checkedTracks.filter(Boolean).length}/${TRACKS.length})`;
        });
    });

    // 즉시 재생 버튼
    container.querySelectorAll('.track-play-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            if (!audioUnlocked) { audioUnlocked = true; }
            const idx = parseInt(e.currentTarget.dataset.index);
            playTrack(idx);
            isPlaying = true;
            MLS.set('playing', 'true');
        });
    });
}

// ─── 아코디언 토글 ──────────────────────────────────────

function initTrackListToggle() {
    const toggleBtn = document.getElementById('trackListToggle');
    const body      = document.getElementById('trackListBody');
    if (!toggleBtn || !body) return;

    toggleBtn.addEventListener('click', () => {
        const isOpen = body.classList.toggle('open');
        toggleBtn.querySelector('.accordion-arrow').textContent = isOpen ? '▲' : '▼';
        if (isOpen) renderTrackList();
    });
}

// ─── 전체 초기화 ────────────────────────────────────────

function initMusicUI() {
    // 볼륨 슬라이더 초기값
    const volSlider = document.getElementById('musicVolume');
    if (volSlider) {
        volSlider.value = Math.round(volume * 100);
        volSlider.addEventListener('input', e => {
            volume = parseInt(e.target.value) / 100;
            MLS.set('volume', volume);
            if (currentIndex >= 0) audio.volume = Math.min(1, volume * TRACKS[currentIndex].gain);
            updateVolIcon();
        });
    }

    // 재생/정지
    document.getElementById('musicPlay')?.addEventListener('click', togglePlay);

    // 이전/다음
    document.getElementById('musicPrev')?.addEventListener('click', playPrev);
    document.getElementById('musicNext')?.addEventListener('click', playNext);

    // 셔플 토글
    document.getElementById('btnShuffleToggle')?.addEventListener('click', () => {
        isShuffle = !isShuffle;
        MLS.set('shuffle', isShuffle);
        updateShuffleBtn();
    });

    // 반복 토글
    document.getElementById('btnRepeatToggle')?.addEventListener('click', () => {
        repeatMode = repeatMode === 'all' ? 'one' : 'all';
        MLS.set('repeat', repeatMode);
        updateRepeatBtn();
    });

    // 볼륨 아이콘 클릭 → 음소거 토글
    document.getElementById('volIconBtn')?.addEventListener('click', () => {
        if (parseInt(volSlider?.value) === 0) {
            volSlider.value = 70; volume = 0.7;
        } else {
            volSlider.value = 0; volume = 0;
        }
        MLS.set('volume', volume);
        if (currentIndex >= 0) audio.volume = Math.min(1, volume * TRACKS[currentIndex].gain);
        updateVolIcon();
    });

    // 아코디언
    initTrackListToggle();

    // 초기 UI 상태
    updateShuffleBtn();
    updateRepeatBtn();
    updateVolIcon();
    updateNowPlaying();
    updatePlayBtn();
}
