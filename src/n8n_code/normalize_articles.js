const items = $input.all();
const stats = { raw: items.length, feed_errors: 0, missing_fields: 0 };
const out = [];

const stripHtml = (s) => String(s || '')
    .replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ').trim();

const titleKey = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 80);

const hash = (s) => {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h.toString(16).padStart(8, '0');
};

for (const it of items) {
    const j = it.json;
    if (j.error) { stats.feed_errors++; continue; }

    const rawTitle = stripHtml(j.title);
    const url = String(j.link || j.guid || '').trim();
    if (!rawTitle || !url) { stats.missing_fields++; continue; }

    let title = rawTitle;
    let source = '';
    const m = rawTitle.match(/^(.*)\s-\s([^-]+)$/);
    if (m && url.includes('news.google.com')) { title = m[1].trim(); source = m[2].trim(); }
    if (!source) { try { source = new URL(url).hostname.replace(/^www\./, ''); } catch (e) { source = 'Unknown'; } }

    const d = new Date(j.isoDate || j.pubDate || '');
    const published_at = isNaN(d.getTime()) ? null : d.toISOString();

    let description = stripHtml(j.contentSnippet || j.content || j.description || j.summary);
    if (description.toLowerCase().startsWith(title.toLowerCase().slice(0, 30))) description = '';

    const key = titleKey(title);
    out.push({
        json: {
            article_id: hash(key),
            title, url, source, published_at,
            description: description.slice(0, 600),
            title_key: key,
            collected_at: new Date().toISOString(),
        }
    });
}

out.forEach(o => { o.json._stats = stats; });
return out.length ? out : [{ json: { _stats: stats, _empty: true } }];