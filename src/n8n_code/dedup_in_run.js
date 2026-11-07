const seenUrl = new Set();
const seenTitle = new Set();
const out = [];

const sorted = $input.all().sort((a, b) =>
    new Date(b.json.published_at) - new Date(a.json.published_at));

for (const it of sorted) {
    const { url, title_key } = it.json;
    if (seenUrl.has(url) || seenTitle.has(title_key)) continue;
    seenUrl.add(url); seenTitle.add(title_key);
    out.push(it);
}
return out;