const MAX_AGE_DAYS = 7;
const MIN_SCORE = 2;
const now = Date.now();

const INCLUDE = ['properti', 'rumah', 'hunian', 'perumahan', 'apartemen', 'kpr', 'flpp', 'tapera',
    'real estate', 'rusun', 'kavling', 'suku bunga', 'bank tanah', 'pengembang', 'developer',
    'subsidi', 'kredit pemilikan', 'landed house', 'harga rumah', 'sewa rumah', 'kawasan hunian'];

const EXCLUDE = ['rumah sakit', 'rumah tangga', 'rumah makan', 'rumah ibadah', 'togel', 'judi',
    'zodiak', 'ramalan', 'lowongan kerja', 'prediksi skor', 'tanah longsor', 'banjir bandang'];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const has = (text, kw) => new RegExp('\\b' + esc(kw) + '\\b').test(text);

return $input.all().map(({ json: a }) => {
    if (a._empty) return { json: { ...a, keep: false, drop_reason: 'no_articles' } };

    let drop_reason = null;

    if (!a.published_at) {
        drop_reason = 'missing_date';
    } else {
        const ageDays = (now - new Date(a.published_at).getTime()) / 86400000;
        if (ageDays > MAX_AGE_DAYS) drop_reason = 'too_old';
        else if (ageDays < -1) drop_reason = 'future_date';
    }

    const title = a.title.toLowerCase();
    const desc = (a.description || '').toLowerCase();

    if (!drop_reason) {
        const bad = EXCLUDE.find(k => has(title, k) || has(desc, k));
        if (bad) drop_reason = 'excluded_keyword:' + bad;
    }

    let score = 0; const matched = [];
    if (!drop_reason) {
        for (const k of INCLUDE) {
            if (has(title, k)) { score += 2; matched.push(k); }
            else if (has(desc, k)) { score += 1; matched.push(k); }
        }
        if (score < MIN_SCORE) drop_reason = 'irrelevant';
    }

    return {
        json: {
            ...a, relevance_score: score, matched_keywords: matched,
            keep: !drop_reason, drop_reason
        }
    };
});