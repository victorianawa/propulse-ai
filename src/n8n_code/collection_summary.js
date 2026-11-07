const safeAll = (name) => { try { return $(name).all(); } catch (e) { return []; } };

const normalized = safeAll('Normalize Articles');
const stats = (normalized[0] && normalized[0].json._stats) || {};
const filtered = safeAll('Filter Recent & Relevant');
const afterInRun = safeAll('Dedup In-Run');
const finalItems = $input.all().filter(i => i.json.article_id);

const dropReasons = {};
filtered.filter(i => !i.json.keep).forEach(i => {
    const r = String(i.json.drop_reason).split(':')[0];
    dropReasons[r] = (dropReasons[r] || 0) + 1;
});

const kept = filtered.filter(i => i.json.keep).length;

const summary = {
    run_at: new Date().toISOString(),
    feeds_attempted: safeAll('Feed List').length,
    raw_items: stats.raw ?? 0,
    feed_errors: stats.feed_errors ?? 0,
    missing_fields: stats.missing_fields ?? 0,
    dropped_by_reason: dropReasons,
    kept_after_filter: kept,
    removed_in_run_duplicates: kept - afterInRun.length,
    removed_cross_run_duplicates: afterInRun.length - finalItems.length,
    new_articles: finalItems.length,
    status: finalItems.length ? 'OK' : 'NO_NEW_ARTICLES',
};

return [{ json: { summary, articles: finalItems.map(i => i.json) } }];