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

// ─── 내 음악 (로컬 업로드) ──────────────────────────────

// activePlaylist: 'default' | 'local'
let activePlaylist = MLS.get('activePlaylist', 'default');

// 로컬 트랙 목록 (IndexedDB에서 불러온 { id, name, objectUrl } 배열)
let localTracks = [];
let checkedLocalTracks = [];

// 현재 재생 중인 로컬 트랙 인덱스 (-1이면 없음)
let currentLocalIndex = -1;

// ─── IndexedDB 초기화 ───────────────────────────────────

let db = null;

function initDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('SuzrenMusicDB', 1);
        req.onupgradeneeded = e => {
            const d = e.target.result;
            if (!d.objectStoreNames.contains('tracks')) {
                d.createObjectStore('tracks', { keyPath: 'id', autoIncrement: true });
            }
        };
        req.onsuccess = e => { db = e.target.result; resolve(); };
        req.onerror   = () => reject(req.error);
    });
}

function dbGetAll() {
    return new Promise((resolve, reject) => {
        const tx  = db.transaction('tracks', 'readonly');
        const req = tx.objectStore('tracks').getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror   = () => reject(req.error);
    });
}

function dbAdd(name, blob) {
    return new Promise((resolve, reject) => {
        const tx  = db.transaction('tracks', 'readwrite');
        const req = tx.objectStore('tracks').add({ name, blob });
        req.onsuccess = () => resolve(req.result); // 새 id 반환
        req.onerror   = () => reject(req.error);
    });
}

function dbDelete(id) {
    return new Promise((resolve, reject) => {
        const tx  = db.transaction('tracks', 'readwrite');
        const req = tx.objectStore('tracks').delete(id);
        req.onsuccess = () => resolve();
        req.onerror   = () => reject(req.error);
    });
}

// ─── 로컬 트랙 불러오기 ─────────────────────────────────

async function loadLocalTracks() {
    if (!db) return;
    const rows = await dbGetAll();
    // 기존 objectUrl 해제
    localTracks.forEach(t => { if (t.objectUrl) URL.revokeObjectURL(t.objectUrl); });
    localTracks = rows.map(row => ({
        id: row.id,
        name: row.name,
        objectUrl: URL.createObjectURL(row.blob),
        gain: 1.0
    }));
    // 체크 상태 복원
    const saved = (() => {
        try { return JSON.parse(MLS.get('checkedLocal', 'null')); } catch { return null; }
    })();
    checkedLocalTracks = localTracks.map((_, i) => saved ? (saved[i] !== false) : true);
}

// ─── 재생 목록 ──────────────────────────────────────────

function getPlaylist() {
    if (activePlaylist === 'local') {
        return localTracks.map((_, i) => i).filter(i => checkedLocalTracks[i]);
    }
    return TRACKS.map((_, i) => i).filter(i => checkedTracks[i]);
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
    if (activePlaylist === 'local') {
        if (index < 0 || index >= localTracks.length) return;
        currentLocalIndex = index;
        currentIndex = -1;
        const t = localTracks[index];
        audio.src = t.objectUrl;
        audio.volume = Math.min(1, volume * t.gain);
        audio.play().catch(() => {});
        isPlaying = true;
        MLS.set('playing', 'true');
        MLS.set('lastLocalIndex', index);
    } else {
        if (index < 0 || index >= TRACKS.length) return;
        currentIndex = index;
        currentLocalIndex = -1;
        const t = TRACKS[index];
        audio.src = 'music/' + t.file;
        audio.volume = Math.min(1, volume * t.gain);
        audio.play().catch(() => {});
        isPlaying = true;
        MLS.set('playing', 'true');
        MLS.set('lastIndex', index);
    }
    updateNowPlaying();
    updatePlayBtn();
    updateTrackList();
    updateLocalTrackList();
}

function togglePlay() {
    if (!audioUnlocked) return;
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        MLS.set('playing', 'false');
    } else {
        if (activePlaylist === 'local' ? currentLocalIndex < 0 : currentIndex < 0) {
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
    const idx = activePlaylist === 'local' ? currentLocalIndex : currentIndex;
    const next = getNextIndex(idx);
    if (next >= 0) playTrack(next);
}

function playPrev() {
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    const idx = activePlaylist === 'local' ? currentLocalIndex : currentIndex;
    const prev = getPrevIndex(idx);
    if (prev >= 0) playTrack(prev);
}

audio.addEventListener('ended', () => {
    if (repeatMode === 'one') { audio.play(); return; }
    playNext();
});

// ─── 브라우저 잠금 해제 ─────────────────────────────────

function unlockAndPlay() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    const shouldPlay = MLS.get('playing', 'true') === 'true';
    if (!shouldPlay) return;

    if (activePlaylist === 'local') {
        const pl = getPlaylist();
        if (!pl.length) return;
        const last = parseInt(MLS.get('lastLocalIndex', '-1'));
        playTrack(pl.includes(last) ? last : pl[0]);
    } else {
        const pl = getPlaylist();
        if (!pl.length) return;
        const last = parseInt(MLS.get('lastIndex', '-1'));
        playTrack(pl.includes(last) ? last : pl[0]);
    }
}

// ─── 플레이리스트 전환 ──────────────────────────────────

function switchPlaylist(target) {
    if (target === activePlaylist) return;
    audio.pause();
    isPlaying = false;
    currentIndex = -1;
    currentLocalIndex = -1;
    activePlaylist = target;
    MLS.set('activePlaylist', target);
    MLS.set('playing', 'false');
    updateNowPlaying();
    updatePlayBtn();
    updatePlaylistHeaders();
    updateTrackList();
    updateLocalTrackList();
}

function updatePlaylistHeaders() {
    const defHeader   = document.getElementById('trackListToggle');
    const localHeader = document.getElementById('localTrackListToggle');
    const radioDefault = document.getElementById('radioDefault');
    const radioLocal   = document.getElementById('radioLocal');
    if (!defHeader || !localHeader) return;

    if (activePlaylist === 'default') {
        defHeader.classList.add('playlist-active');
        localHeader.classList.remove('playlist-active');
        radioDefault?.classList.add('selected');
        radioLocal?.classList.remove('selected');
    } else {
        defHeader.classList.remove('playlist-active');
        localHeader.classList.add('playlist-active');
        radioDefault?.classList.remove('selected');
        radioLocal?.classList.add('selected');
    }
}

// ─── UI 업데이트 ────────────────────────────────────────

function updateNowPlaying() {
    const el = document.getElementById('musicTitle');
    if (!el) return;
    if (activePlaylist === 'local' && currentLocalIndex >= 0) {
        el.textContent = localTracks[currentLocalIndex].name;
    } else if (activePlaylist === 'default' && currentIndex >= 0) {
        el.textContent = TRACKS[currentIndex].name;
    } else {
        el.textContent = '— 음악 없음 —';
    }
}

function updatePlayBtn() {
    const play  = document.getElementById('iconPlay');
    const pause = document.getElementById('iconPause');
    if (!play || !pause) return;
    play.style.display  = isPlaying ? 'none' : '';
    pause.style.display = isPlaying ? '' : 'none';
}

function updateTrackList() {
    document.querySelectorAll('#trackList .track-item').forEach((el, i) => {
        el.classList.toggle('playing', activePlaylist === 'default' && i === currentIndex);
    });
}

function updateLocalTrackList() {
    document.querySelectorAll('#localTrackList .track-item').forEach((el, i) => {
        el.classList.toggle('playing', activePlaylist === 'local' && i === currentLocalIndex);
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

// ─── 기본 곡 목록 렌더링 ────────────────────────────────

function renderTrackList() {
    const container = document.getElementById('trackList');
    if (!container) return;

    const checkedCount = checkedTracks.filter(Boolean).length;
    const header = document.getElementById('trackListHeader');
    if (header) header.textContent = `곡 목록 (${checkedCount}/${TRACKS.length})`;

    container.innerHTML = TRACKS.map((t, i) => `
        <div class="track-item ${activePlaylist === 'default' && i === currentIndex ? 'playing' : ''}" data-index="${i}">
            <label class="track-check">
                <input type="checkbox" class="track-checkbox" data-index="${i}" ${checkedTracks[i] ? 'checked' : ''}>
                <span class="track-checkmark"></span>
            </label>
            <span class="track-name">${t.name}</span>
            <button class="track-play-btn" data-index="${i}" title="바로 재생">▶</button>
        </div>
    `).join('');

    container.querySelectorAll('.track-checkbox').forEach(cb => {
        cb.addEventListener('change', e => {
            const idx = parseInt(e.target.dataset.index);
            checkedTracks[idx] = e.target.checked;
            MLS.set('checked', JSON.stringify(checkedTracks));
            const h = document.getElementById('trackListHeader');
            if (h) h.textContent = `곡 목록 (${checkedTracks.filter(Boolean).length}/${TRACKS.length})`;
        });
    });

    container.querySelectorAll('.track-play-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            if (activePlaylist !== 'default') switchPlaylist('default');
            if (!audioUnlocked) audioUnlocked = true;
            playTrack(parseInt(e.currentTarget.dataset.index));
            isPlaying = true;
            MLS.set('playing', 'true');
        });
    });
}

// ─── 내 음악 목록 렌더링 ────────────────────────────────

function renderLocalTrackList() {
    const container = document.getElementById('localTrackList');
    if (!container) return;

    const checkedCount = checkedLocalTracks.filter(Boolean).length;
    const header = document.getElementById('localTrackListHeader');
    if (header) header.textContent = `내 음악 (${checkedCount}/${localTracks.length})`;

    if (localTracks.length === 0) {
        container.innerHTML = '<div class="track-empty">추가된 음악이 없어요</div>';
        return;
    }

    container.innerHTML = localTracks.map((t, i) => `
        <div class="track-item ${activePlaylist === 'local' && i === currentLocalIndex ? 'playing' : ''}" data-index="${i}">
            <label class="track-check">
                <input type="checkbox" class="track-checkbox local-track-checkbox" data-index="${i}" ${checkedLocalTracks[i] ? 'checked' : ''}>
                <span class="track-checkmark"></span>
            </label>
            <span class="track-name">${t.name}</span>
            <button class="track-play-btn" data-index="${i}" title="바로 재생">▶</button>
            <button class="track-delete-btn" data-id="${t.id}" data-index="${i}" title="삭제">✕</button>
        </div>
    `).join('');

    container.querySelectorAll('.local-track-checkbox').forEach(cb => {
        cb.addEventListener('change', e => {
            const idx = parseInt(e.target.dataset.index);
            checkedLocalTracks[idx] = e.target.checked;
            MLS.set('checkedLocal', JSON.stringify(checkedLocalTracks));
            const h = document.getElementById('localTrackListHeader');
            if (h) h.textContent = `내 음악 (${checkedLocalTracks.filter(Boolean).length}/${localTracks.length})`;
        });
    });

    container.querySelectorAll('.track-play-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            if (activePlaylist !== 'local') switchPlaylist('local');
            if (!audioUnlocked) audioUnlocked = true;
            playTrack(parseInt(e.currentTarget.dataset.index));
            isPlaying = true;
            MLS.set('playing', 'true');
        });
    });

    container.querySelectorAll('.track-delete-btn').forEach(btn => {
        btn.addEventListener('click', async e => {
            const id  = parseInt(e.currentTarget.dataset.id);
            const idx = parseInt(e.currentTarget.dataset.index);
            // 현재 재생 중인 곡이면 정지
            if (activePlaylist === 'local' && currentLocalIndex === idx) {
                audio.pause(); isPlaying = false; currentLocalIndex = -1;
                updateNowPlaying(); updatePlayBtn();
            }
            await dbDelete(id);
            await loadLocalTracks();
            renderLocalTrackList();
            updateLocalTrackListHeader();
        });
    });
}

function updateLocalTrackListHeader() {
    const header = document.getElementById('localTrackListHeader');
    if (header) header.textContent = `내 음악 (${checkedLocalTracks.filter(Boolean).length}/${localTracks.length})`;
}

// ─── 아코디언 토글 ──────────────────────────────────────

function closeAccordion(bodyId, toggleId) {
    const body = document.getElementById(bodyId);
    const btn  = document.getElementById(toggleId);
    if (!body || !btn) return;
    body.classList.remove('open');
    const arrow = btn.querySelector('.accordion-arrow');
    if (arrow) arrow.textContent = '▼';
}

function initTrackListToggle() {
    const toggleBtn = document.getElementById('trackListToggle');
    const body      = document.getElementById('trackListBody');
    if (!toggleBtn || !body) return;

    toggleBtn.addEventListener('click', e => {
        const arrow = toggleBtn.querySelector('.accordion-arrow');
        const arrowRect = arrow?.getBoundingClientRect();
        // 화살표 부근(오른쪽 32px) 클릭이면 아코디언만
        if (arrowRect && e.clientX >= arrowRect.left - 10) {
            closeAccordion('localTrackListBody', 'localTrackListToggle');
            const isOpen = body.classList.toggle('open');
            arrow.textContent = isOpen ? '▲' : '▼';
            if (isOpen) renderTrackList();
        } else {
            // 나머지 영역 클릭 → 플리 전환만
            if (activePlaylist !== 'default') switchPlaylist('default');
        }
    });
}

function initLocalTrackListToggle() {
    const toggleBtn = document.getElementById('localTrackListToggle');
    const body      = document.getElementById('localTrackListBody');
    if (!toggleBtn || !body) return;

    toggleBtn.addEventListener('click', e => {
        const arrow = toggleBtn.querySelector('.accordion-arrow');
        const arrowRect = arrow?.getBoundingClientRect();
        // 화살표 부근(오른쪽 32px) 클릭이면 아코디언만
        if (arrowRect && e.clientX >= arrowRect.left - 10) {
            closeAccordion('trackListBody', 'trackListToggle');
            const isOpen = body.classList.toggle('open');
            arrow.textContent = isOpen ? '▲' : '▼';
            if (isOpen) renderLocalTrackList();
        } else {
            // 나머지 영역 클릭 → 플리 전환만
            if (activePlaylist !== 'local') switchPlaylist('local');
        }
    });
}

// ─── 음악 파일 업로드 ───────────────────────────────────

function initLocalMusicUpload() {
    const input = document.getElementById('localMusicFile');
    if (!input) return;

    input.addEventListener('change', async e => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        for (const file of files) {
            const name = file.name.replace(/\.[^.]+$/, ''); // 확장자 제거
            await dbAdd(name, file);
        }
        input.value = '';
        await loadLocalTracks();
        renderLocalTrackList();
        updateLocalTrackListHeader();

        // 목록 열기
        const body = document.getElementById('localTrackListBody');
        const btn  = document.getElementById('localTrackListToggle');
        if (body && !body.classList.contains('open')) {
            body.classList.add('open');
            btn?.querySelector('.accordion-arrow') && (btn.querySelector('.accordion-arrow').textContent = '▲');
            renderLocalTrackList();
        }
    });
}

// ─── 전체 초기화 ────────────────────────────────────────

async function initMusicUI() {
    // IndexedDB 초기화 및 로컬 트랙 불러오기
    await initDB();
    await loadLocalTracks();

    // 볼륨 슬라이더
    const volSlider = document.getElementById('musicVolume');
    if (volSlider) {
        volSlider.value = Math.round(volume * 100);
        volSlider.addEventListener('input', e => {
            volume = parseInt(e.target.value) / 100;
            MLS.set('volume', volume);
            const idx = activePlaylist === 'local' ? currentLocalIndex : currentIndex;
            if (idx >= 0) {
                const gain = activePlaylist === 'local' ? localTracks[idx].gain : TRACKS[idx].gain;
                audio.volume = Math.min(1, volume * gain);
            }
            updateVolIcon();
        });
    }

    document.getElementById('musicPlay')?.addEventListener('click', () => {
        if (!audioUnlocked) {
            audioUnlocked = true;
            const pl = getPlaylist();
            if (!pl.length) return;
            const lastKey = activePlaylist === 'local' ? 'lastLocalIndex' : 'lastIndex';
            const last = parseInt(MLS.get(lastKey, '-1'));
            playTrack(pl.includes(last) ? last : pl[0]);
            return;
        }
        togglePlay();
    });
    document.getElementById('musicPrev')?.addEventListener('click', playPrev);
    document.getElementById('musicNext')?.addEventListener('click', playNext);

    document.getElementById('btnShuffleToggle')?.addEventListener('click', () => {
        isShuffle = !isShuffle;
        MLS.set('shuffle', isShuffle);
        updateShuffleBtn();
    });

    document.getElementById('btnRepeatToggle')?.addEventListener('click', () => {
        repeatMode = repeatMode === 'all' ? 'one' : 'all';
        MLS.set('repeat', repeatMode);
        updateRepeatBtn();
    });

    document.getElementById('volIconBtn')?.addEventListener('click', () => {
        if (parseInt(volSlider?.value) === 0) {
            volSlider.value = 70; volume = 0.7;
        } else {
            volSlider.value = 0; volume = 0;
        }
        MLS.set('volume', volume);
        const idx = activePlaylist === 'local' ? currentLocalIndex : currentIndex;
        if (idx >= 0) {
            const gain = activePlaylist === 'local' ? localTracks[idx].gain : TRACKS[idx].gain;
            audio.volume = Math.min(1, volume * gain);
        }
        updateVolIcon();
    });

    initTrackListToggle();
    initLocalTrackListToggle();
    initLocalMusicUpload();

    updateShuffleBtn();
    updateRepeatBtn();
    updateVolIcon();
    updateNowPlaying();
    updatePlayBtn();
    updatePlaylistHeaders();
    updateLocalTrackListHeader();
}
