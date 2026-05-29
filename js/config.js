// =============================================
// config.js — 상수 / 단어 목록 / 색상 프리셋
// =============================================

const WORDS = [
    "눈", "불", "책", "해", "강", "집", "밥", "길", "손", "꿈", "산", "물", "달", "발", "빵", "꽃",
    "가람", "가족", "감다", "걷다", "경제", "경험", "계절", "고삐", "공원", "기린", "기술", "기억", "기타", "기획",
    "까막", "까치", "나라", "나무", "놀다", "늑대", "단비", "도시", "돕다", "듣다", "만세", "매듭", "먹다", "문화",
    "물개", "미래", "바다", "병원", "보다", "사람", "사자", "살다", "상점", "생각", "수달", "시간", "쓰다",
    "아라", "아람", "아침", "알다", "역사", "여우", "여울", "오리", "웃다", "울다", "이리", "읽다", "입술",
    "자다", "전체", "정보", "종교", "지게", "참새", "취미", "친구", "타자", "택시", "파란", "필사", "하늘",
    "학교", "학생", "한글", "한별", "한울", "행복", "헌법", "호미", "회사", "흑호", "희망", "환경",
    "가르치다", "가온누리", "각골난망", "감동시키다", "감사하다", "강아지", "개발하다", "결정하다", "계획하다", "경험하다",
    "고등학교", "고려하다", "고양이", "공부하다", "관찰하다", "과학자", "구경하다", "기다리다", "기억하다", "길노래",
    "금강송", "꽃내음", "그대에게", "나래움", "나래한별", "노력하다", "누리집", "다람쥐", "다리미", "달구지", "달리다",
    "대학교", "도서관", "도원결의", "도전정신", "도전하다", "독립운동", "드라마", "들국화", "들꽃내음", "마루빛",
    "만나다", "만족스럽다", "멧돼지", "무한궤도", "무한도전", "민주주의", "박물관", "바다빛", "받아쓰기", "반달곰",
    "발견하다", "발전시키다", "배우다", "분석하다", "부르다", "부장님", "비석치기", "별이슬", "사자성어", "사무실",
    "산들바람", "삼일절", "새미꽃", "새벽결", "생각하다", "서리꽃", "선생님", "설득하다", "설명하다", "세종대왕",
    "소모임", "소통하다", "솔내음", "솔방울", "수리하다", "수영하다", "실망하다", "실천하다", "아라별빛", "여행자",
    "여행하다", "연락하다", "연구하다", "연구소", "영화관", "예술가", "오락실", "오징어게임", "우물터", "운동선수",
    "운동장", "운동하다", "월급날", "월급통장", "음악가", "음식점", "이순신", "이슬별빛", "이야기", "이해하다",
    "인터넷", "잎새바람", "전문가", "정리정돈하다", "존중하다", "준비하다", "중학교", "즐거운", "집중하다", "참여하다",
    "청설모", "청소하다", "초롱빛", "축하하다", "캠핑카", "컴퓨터", "타자검정", "타자마을", "타자연습", "타자학습",
    "통화하다", "판뒤집기", "푸른결", "하늘소", "한국문학", "한가람", "한글날", "한마루", "한컴타자", "해오라기",
    "협력하다", "호수빛", "휴대폰"
];

// ─── 단색 타일 색상 팔레트 ──────────────────────────────
// 계열별 5개씩 정렬 (5열 기준)
const TILE_COLORS = [
    // 행 1: 빨강 계열
    { id: 'tomato',   grad: 'linear-gradient(150deg, #e84030 0%, #b02818 100%)', text: '#ffe0d8', border: 'rgba(255,180,160,0.3)' },
    { id: 'red1',     grad: 'linear-gradient(150deg, #c03020 0%, #8a1e10 100%)', text: '#ffc8b0', border: 'rgba(255,160,120,0.25)' },
    { id: 'red2',     grad: 'linear-gradient(150deg, #8f3020 0%, #6e2015 100%)', text: '#ffc4a8', border: 'rgba(255,150,110,0.25)' },
    { id: 'crimson',  grad: 'linear-gradient(150deg, #a01830 0%, #6e0f20 100%)', text: '#ffb0c0', border: 'rgba(255,130,150,0.25)' },
    { id: 'wine',     grad: 'linear-gradient(150deg, #7a1028 0%, #4e0818 100%)', text: '#f0a0b0', border: 'rgba(220,120,140,0.25)' },
    { id: 'burgundy', grad: 'linear-gradient(150deg, #6a1a2e 0%, #420f1c 100%)', text: '#ffa8c0', border: 'rgba(255,130,170,0.25)' },
    { id: 'darkred',  grad: 'linear-gradient(150deg, #3a0e10 0%, #200808 100%)', text: '#d88090', border: 'rgba(190,100,110,0.25)' },
    // 행 2: 주황 계열
    { id: 'hotoral',  grad: 'linear-gradient(150deg, #f06030 0%, #c03a18 100%)', text: '#ffe0c0', border: 'rgba(255,190,140,0.3)' },
    { id: 'coral',    grad: 'linear-gradient(150deg, #c85038 0%, #903020 100%)', text: '#ffd0b8', border: 'rgba(255,175,140,0.25)' },
    { id: 'orange',   grad: 'linear-gradient(150deg, #c86018 0%, #8a3a08 100%)', text: '#ffd8a0', border: 'rgba(255,195,110,0.25)' },
    { id: 'amber',    grad: 'linear-gradient(150deg, #c07818 0%, #885008 100%)', text: '#ffe8a0', border: 'rgba(255,210,100,0.25)' },
    { id: 'wood',     grad: 'linear-gradient(150deg, #8a5828 0%, #5a3410 100%)', text: '#f0d0a0', border: 'rgba(225,185,120,0.25)' },
    { id: 'brown',    grad: 'linear-gradient(150deg, #6a3818 0%, #44200a 100%)', text: '#f0c090', border: 'rgba(215,170,115,0.25)' },
    { id: 'bronze',   grad: 'linear-gradient(150deg, #7a4a20 0%, #4e2e10 100%)', text: '#e8c090', border: 'rgba(210,170,110,0.25)' },
    // 행 3: 노랑/골드 계열
    { id: 'yellow',   grad: 'linear-gradient(150deg, #c8a818 0%, #907408 100%)', text: '#fff8a0', border: 'rgba(240,225,80,0.3)' },
    { id: 'brightgld',grad: 'linear-gradient(150deg, #b09020 0%, #7a6010 100%)', text: '#fff0a0', border: 'rgba(238,215,85,0.25)' },
    { id: 'gold',     grad: 'linear-gradient(150deg, #8a6a10 0%, #5a440a 100%)', text: '#f5d060', border: 'rgba(218,182,55,0.25)' },
    { id: 'olive',    grad: 'linear-gradient(150deg, #6a7018 0%, #404408 100%)', text: '#e0e898', border: 'rgba(190,215,95,0.25)' },
    { id: 'sage',     grad: 'linear-gradient(150deg, #4a6040 0%, #2a3a28 100%)', text: '#c8e0b8', border: 'rgba(155,205,140,0.25)' },
    { id: 'lime',     grad: 'linear-gradient(150deg, #4a8020 0%, #2c5010 100%)', text: '#d0f090', border: 'rgba(175,230,100,0.25)' },
    { id: 'limebrgt', grad: 'linear-gradient(150deg, #60a828 0%, #3a7018 100%)', text: '#e0ff90', border: 'rgba(190,245,100,0.3)' },
    // 행 4: 초록 계열
    { id: 'green1',   grad: 'linear-gradient(150deg, #38a040 0%, #206828 100%)', text: '#c0f8c0', border: 'rgba(140,240,150,0.25)' },
    { id: 'green2',   grad: 'linear-gradient(150deg, #2c7830 0%, #184a1e 100%)', text: '#a8e8a8', border: 'rgba(130,220,135,0.25)' },
    { id: 'forest2',  grad: 'linear-gradient(150deg, #1a5020 0%, #0e3214 100%)', text: '#90c890', border: 'rgba(115,185,115,0.22)' },
    { id: 'deepgrn',  grad: 'linear-gradient(150deg, #0e3a1a 0%, #082210 100%)', text: '#80c890', border: 'rgba(100,178,110,0.22)' },
    { id: 'mint',     grad: 'linear-gradient(150deg, #28a878 0%, #147850 100%)', text: '#b0ffd8', border: 'rgba(120,245,190,0.25)' },
    { id: 'emerald',  grad: 'linear-gradient(150deg, #1a9060 0%, #0e6040 100%)', text: '#90ffc8', border: 'rgba(100,230,170,0.25)' },
    { id: 'green3',   grad: 'linear-gradient(150deg, #1a6f4a 0%, #0d4a30 100%)', text: '#80e8b8', border: 'rgba(100,210,155,0.25)' },
    // 행 5: 청록/시안 계열
    { id: 'teal',     grad: 'linear-gradient(150deg, #1a9890 0%, #0e6860 100%)', text: '#a0f8f0', border: 'rgba(120,230,225,0.25)' },
    { id: 'darkteal', grad: 'linear-gradient(150deg, #0e5850 0%, #083834 100%)', text: '#80d0c8', border: 'rgba(100,190,185,0.22)' },
    { id: 'cyan',     grad: 'linear-gradient(150deg, #1888a0 0%, #0c5870 100%)', text: '#a0e8f8', border: 'rgba(115,220,240,0.25)' },
    { id: 'darkcyan', grad: 'linear-gradient(150deg, #0e5870 0%, #083848 100%)', text: '#80c8e0', border: 'rgba(95,190,215,0.25)' },
    { id: 'skylt',    grad: 'linear-gradient(150deg, #2890e0 0%, #1460b0 100%)', text: '#b8e4ff', border: 'rgba(145,210,255,0.3)' },
    { id: 'sky',      grad: 'linear-gradient(150deg, #2060b0 0%, #123878 100%)', text: '#a0d4ff', border: 'rgba(120,188,255,0.25)' },
    { id: 'cerulean', grad: 'linear-gradient(150deg, #1850a8 0%, #0e3070 100%)', text: '#90c8ff', border: 'rgba(110,178,255,0.25)' },
    // 행 6: 파랑 계열
    { id: 'blue1',    grad: 'linear-gradient(150deg, #2848a0 0%, #182e70 100%)', text: '#a8c8f8', border: 'rgba(128,175,248,0.25)' },
    { id: 'blue2',    grad: 'linear-gradient(150deg, #1a3880 0%, #0e2258 100%)', text: '#90b8f0', border: 'rgba(108,162,240,0.25)' },
    { id: 'cobalt',   grad: 'linear-gradient(150deg, #1a3aaa 0%, #0e2278 100%)', text: '#a0c0ff', border: 'rgba(120,168,255,0.25)' },
    { id: 'navy',     grad: 'linear-gradient(150deg, #162858 0%, #0a1838 100%)', text: '#8ab0e8', border: 'rgba(100,148,232,0.25)' },
    { id: 'midnight', grad: 'linear-gradient(150deg, #1a1a3a 0%, #0a0a22 100%)', text: '#a0a8d0', border: 'rgba(128,138,205,0.22)' },
    { id: 'slateblu', grad: 'linear-gradient(150deg, #3a4a7a 0%, #222e58 100%)', text: '#b8c8f0', border: 'rgba(158,183,238,0.25)' },
    { id: 'periwink', grad: 'linear-gradient(150deg, #5060b8 0%, #303888 100%)', text: '#c8d0ff', border: 'rgba(178,188,255,0.25)' },
    // 행 7: 남색/보라 계열
    { id: 'indigo',   grad: 'linear-gradient(150deg, #3030a0 0%, #1c1c70 100%)', text: '#b8b8ff', border: 'rgba(165,162,255,0.25)' },
    { id: 'violet',   grad: 'linear-gradient(150deg, #5820a0 0%, #340e70 100%)', text: '#d8b0ff', border: 'rgba(198,138,255,0.25)' },
    { id: 'purple1',  grad: 'linear-gradient(150deg, #7828b0 0%, #4c1880 100%)', text: '#e8b8ff', border: 'rgba(218,155,255,0.25)' },
    { id: 'purple2',  grad: 'linear-gradient(150deg, #9030c0 0%, #601890 100%)', text: '#f0c0ff', border: 'rgba(228,165,255,0.25)' },
    { id: 'lavender', grad: 'linear-gradient(150deg, #6848a8 0%, #422e78 100%)', text: '#d8ccff', border: 'rgba(195,178,255,0.25)' },
    { id: 'lilac',    grad: 'linear-gradient(150deg, #8868c0 0%, #584890 100%)', text: '#e8d8ff', border: 'rgba(210,198,255,0.25)' },
    { id: 'darkpur',  grad: 'linear-gradient(150deg, #380e6a 0%, #200840 100%)', text: '#c090f0', border: 'rgba(172,108,230,0.25)' },
    // 행 8: 핑크/마젠타 계열
    { id: 'hotpink',  grad: 'linear-gradient(150deg, #d02880 0%, #a01858 100%)', text: '#ffc0e0', border: 'rgba(248,158,210,0.3)' },
    { id: 'rose',     grad: 'linear-gradient(150deg, #b83060 0%, #882040 100%)', text: '#ffb8d0', border: 'rgba(245,148,190,0.25)' },
    { id: 'pink',     grad: 'linear-gradient(150deg, #c03880 0%, #901858 100%)', text: '#ffc0e8', border: 'rgba(248,158,218,0.25)' },
    { id: 'magenta',  grad: 'linear-gradient(150deg, #b01890 0%, #800860 100%)', text: '#ffb0e8', border: 'rgba(240,138,218,0.25)' },
    { id: 'obsidian', grad: 'linear-gradient(150deg, #1e1420 0%, #0e0a12 100%)', text: '#b0a0c0', border: 'rgba(153,133,183,0.22)' },
    { id: 'charcoal', grad: 'linear-gradient(150deg, #2e3440 0%, #1a1e28 100%)', text: '#c8d0e0', border: 'rgba(158,178,218,0.22)' },
    { id: 'slate',    grad: 'linear-gradient(150deg, #3b4458 0%, #242c3d 100%)', text: '#d6deef', border: 'rgba(178,198,238,0.22)' },
];

const COLOR_PRESETS = {
    classic: {
        player: { grad: 'linear-gradient(150deg, #284f8a 0%, #1a3a6a 100%)', text: '#a8ccf7', border: 'rgba(120,180,255,0.25)' },
        enemy:  { grad: 'linear-gradient(150deg, #8f3020 0%, #6e2015 100%)', text: '#ffc4a8', border: 'rgba(255,160,110,0.25)' }
    },
    aurora: {
        player: { grad: 'linear-gradient(150deg, #1f6f5c 0%, #0d3c44 100%)', text: '#b6ffe0', border: 'rgba(120,255,210,0.25)' },
        enemy:  { grad: 'linear-gradient(150deg, #6b2f8a 0%, #3a1a6a 100%)', text: '#f5c2ff', border: 'rgba(225,160,255,0.25)' }
    },
    solar: {
        player: { grad: 'linear-gradient(150deg, #2a7a7b 0%, #124a4d 100%)', text: '#baf3f2', border: 'rgba(120,220,220,0.25)' },
        enemy:  { grad: 'linear-gradient(150deg, #a04a14 0%, #6a2b0f 100%)', text: '#ffd2a4', border: 'rgba(255,180,120,0.25)' }
    },
    forest: {
        player: { grad: 'linear-gradient(150deg, #2c5f2d 0%, #183a20 100%)', text: '#c9f7c3', border: 'rgba(140,255,160,0.25)' },
        enemy:  { grad: 'linear-gradient(150deg, #73481f 0%, #4a2a12 100%)', text: '#ffd6a5', border: 'rgba(255,190,130,0.25)' }
    },
    mono: {
        player: { grad: 'linear-gradient(150deg, #3b4458 0%, #242c3d 100%)', text: '#d6deef', border: 'rgba(180,200,240,0.22)' },
        enemy:  { grad: 'linear-gradient(150deg, #7a2f2f 0%, #4a1c1c 100%)', text: '#ffc7c7', border: 'rgba(255,170,170,0.25)' }
    }
};

// 타일 뒤집기 애니메이션 지속시간 (ms)
const FLIP_DURATION = 1400;

// 랭크 구간 테이블 — [최소 정타 수, 랭크 문자열]
const RANK_TABLE = [
    [157, 'L'], [144, 'SSS'], [132, 'SS+'], [121, 'SS'],
    [110, 'S+'], [99,  'S'],  [89,  'A+'],  [81,  'A'],
    [72,  'B+'], [66,  'B'],  [57,  'C+'],  [51,  'C'],
    [42,  'D+'], [36,  'D'],  [27,  'E+'],  [21,  'E'],
    [0,   'F']
];

/**
 * 정타 수로 랭크 문자열 반환
 * @param {number} n
 * @returns {string}
 */
function getRank(n) {
    for (const [min, rank] of RANK_TABLE) {
        if (n >= min) return rank;
    }
    return 'F';
}
