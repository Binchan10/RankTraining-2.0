// =============================================
// result.js — 결과창 표시 / 구간별 차트 렌더링
// =============================================

// ─── 결과창 표시 ────────────────────────────────────────

/**
 * 게임 종료 시 결과창을 채우고 표시한다.
 *
 * @param {object} stats
 * @param {number}   stats.totalHits      누적 정타 수
 * @param {number}   stats.totalMisses    누적 오타 수
 * @param {number}   stats.enemyFlips     적 뒤집기 수
 * @param {number[]} stats.segmentHits    구간별 정타 배열 (길이 10)
 * @param {number}   stats.segmentDuration 구간 길이 (초)
 * @param {number[]} stats.tileCounts     [플레이어 타일 수, 적 타일 수]
 * @param {boolean}  stats.isEasy         Easy Mode 여부
 */
function showResult(stats) {
    const { totalHits, totalMisses, enemyFlips, segmentHits, segmentDuration, tileCounts, isEasy } = stats;
    const [pCount, eCount] = tileCounts;

    // 승패
    let wlText = '무승부', wlColor = '#94a3b8';
    if (pCount > eCount) { wlText = '수련 성공!'; wlColor = '#4ade80'; }
    else if (pCount < eCount) { wlText = '수련 실패...'; wlColor = '#f87171'; }

    // 정확도
    const totalAttempts = totalHits + totalMisses;
    const accuracy = totalAttempts > 0
        ? ((totalHits / totalAttempts) * 100).toFixed(1)
        : '100.0';

    // 모드 배지
    const badge = document.getElementById('modeBadge');
    badge.className = isEasy ? 'easy-mode' : 'rank-mode';
    document.getElementById('modeLabel').textContent = isEasy ? 'Easy Mode' : 'Rank Mode';

    // 텍스트 채우기
    document.getElementById('winLoss').textContent  = wlText;
    document.getElementById('winLoss').style.color  = wlColor;
    document.getElementById('rank').textContent     = getRank(totalHits);
    document.getElementById('scoreDetail').textContent   = `나 ${totalHits}개 VS 상대 ${enemyFlips}개`;
    document.getElementById('accuracyDetail').textContent = `정확도 ${totalHits}/${totalAttempts} (${accuracy}%)`;

    // 명예의 전당 저장 및 렌더링
    saveHofRecord(totalHits, isEasy);
    renderHofList('hofRankList', false);
    renderHofList('hofEasyList', true);

    // 결과창 표시 후 차트 그리기
    document.getElementById('result').style.display = 'flex';
    requestAnimationFrame(() => drawChart(segmentHits, segmentDuration));
}

// ─── 구간별 정타 차트 ────────────────────────────────────

/**
 * canvas에 구간별 정타 수 꺾은선+면적 차트를 렌더링한다.
 * @param {number[]} data              구간별 정타 배열
 * @param {number}   segmentDuration   구간 길이 (초), X축 레이블에 사용
 */
function drawChart(data, segmentDuration) {
    const canvas = document.getElementById('chartCanvas');
    const dpr    = window.devicePixelRatio || 1;
    const rect   = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const W   = rect.width;
    const H   = rect.height;
    const pad = { top: 18, right: 20, bottom: 36, left: 40 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top  - pad.bottom;

    const rawMax = Math.max(...data, 1);
    const maxVal = Math.ceil(rawMax * 1.35 / 5) * 5;

    // 데이터 포인트 좌표 계산
    const pts = data.map((v, i) => ({
        x:     pad.left + ((i + 0.5) / data.length) * chartW,
        y:     pad.top  + chartH - (v / maxVal) * chartH,
        label: ((i + 1) * segmentDuration) + 's'
    }));

    // ── 배경 ──
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 8);
    ctx.fill();

    // ── 가로 격자선 + Y축 레이블 ──
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
        const y = pad.top + chartH - (i / gridLines) * chartH;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth   = 1;
        ctx.moveTo(pad.left, y);
        ctx.lineTo(pad.left + chartW, y);
        ctx.stroke();

        ctx.fillStyle  = 'rgba(255,255,255,0.35)';
        ctx.font       = '11px sans-serif';
        ctx.textAlign  = 'right';
        ctx.fillText(Math.round((i / gridLines) * maxVal), pad.left - 6, y + 4);
    }

    // ── 세로 구분선 ──
    ctx.setLineDash([3, 5]);
    for (let i = 1; i < data.length; i++) {
        const x = pad.left + (i / data.length) * chartW;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth   = 1;
        ctx.moveTo(x, pad.top);
        ctx.lineTo(x, pad.top + chartH);
        ctx.stroke();
    }
    ctx.setLineDash([]);

    // ── 면적 채우기 ──
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
        const mx = (pts[i - 1].x + pts[i].x) / 2;
        ctx.bezierCurveTo(mx, pts[i - 1].y, mx, pts[i].y, pts[i].x, pts[i].y);
    }
    ctx.lineTo(pts[pts.length - 1].x, pad.top + chartH);
    ctx.lineTo(pts[0].x, pad.top + chartH);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad.addColorStop(0, 'rgba(99,179,255,0.3)');
    grad.addColorStop(1, 'rgba(99,179,255,0.02)');
    ctx.fillStyle = grad;
    ctx.fill();

    // ── 선 ──
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
        const mx = (pts[i - 1].x + pts[i].x) / 2;
        ctx.bezierCurveTo(mx, pts[i - 1].y, mx, pts[i].y, pts[i].x, pts[i].y);
    }
    ctx.strokeStyle = '#63b3ff';
    ctx.lineWidth   = 2.5;
    ctx.stroke();

    // ── 데이터 포인트 마커 + X축 레이블 ──
    pts.forEach((p, i) => {
        // 외원
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#63b3ff';
        ctx.fill();
        // 내원
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        // X축 레이블 (구간 경계선 기준)
        const xBoundary = pad.left + ((i + 1) / data.length) * chartW;
        ctx.fillStyle  = 'rgba(255,255,255,0.35)';
        ctx.font       = '11px sans-serif';
        ctx.textAlign  = 'center';
        ctx.fillText(p.label, xBoundary, pad.top + chartH + 18);
    });
}
