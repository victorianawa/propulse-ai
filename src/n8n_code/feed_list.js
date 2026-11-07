const TEST_BAD_FEED = false; // set true ONLY to test feed-failure handling

const q = (query) =>
    `https://news.google.com/rss/search?q=${query}+when:7d&hl=id&gl=ID&ceid=ID:id`;

const feeds = [
    { id: 'gn-market', name: 'Google News - Pasar Properti', url: q('pasar+properti+indonesia') },
    { id: 'gn-kpr', name: 'Google News - KPR', url: q('KPR+suku+bunga+rumah') },
    { id: 'gn-policy', name: 'Google News - Kebijakan', url: q('FLPP+OR+Tapera+OR+subsidi+rumah+OR+%223+juta+rumah%22') },
    { id: 'gn-first', name: 'Google News - Rumah Pertama', url: q('tips+beli+rumah+pertama') },
    { id: 'gn-price', name: 'Google News - Harga Rumah', url: q('harga+rumah+properti+indonesia') },
    { id: 'gn-infra', name: 'Google News - Infrastruktur', url: q('infrastruktur+kawasan+hunian') },
];

if (TEST_BAD_FEED) {
    feeds.push({ id: 'bad', name: 'Deliberately Broken', url: 'https://invalid.example.invalid/rss.xml' });
}

return feeds.map(f => ({ json: f }));