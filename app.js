const createFeedItem = (post) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = `https://reddit.com${post.permalink}`;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.textContent = post.title;
  li.append(a);
  return li;
};

const renderFeed = (target, posts, fallback) => {
  target.innerHTML = '';

  if (!posts?.length) {
    const li = document.createElement('li');
    li.textContent = fallback;
    target.append(li);
    return;
  }

  posts.slice(0, 8).forEach((post) => target.append(createFeedItem(post)));
};

const fetchSubreddit = async (subreddit) => {
  const response = await fetch(`https://www.reddit.com/r/${subreddit}.json?limit=12`);
  if (!response.ok) {
    throw new Error(`Kon subreddit ${subreddit} niet laden.`);
  }
  const data = await response.json();
  return data.data.children.map((item) => item.data);
};

const initFeeds = async () => {
  const cyberFeed = document.getElementById('cyberFeed');
  const worldFeed = document.getElementById('worldFeed');
  const customFeed = document.getElementById('customFeed');

  try {
    const [cyberPosts, worldPosts] = await Promise.all([
      fetchSubreddit('cybersecurity'),
      fetchSubreddit('worldnews')
    ]);

    renderFeed(cyberFeed, cyberPosts, 'Geen cyber nieuws beschikbaar.');
    renderFeed(worldFeed, worldPosts, 'Geen wereldnieuws beschikbaar.');
  } catch (error) {
    renderFeed(cyberFeed, [], 'Cyber feed kon niet geladen worden.');
    renderFeed(worldFeed, [], 'World feed kon niet geladen worden.');
  }

  const form = document.getElementById('redditForm');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const subreddit = new FormData(form).get('subreddit').toString().trim();

    if (!subreddit) {
      return;
    }

    try {
      const posts = await fetchSubreddit(subreddit);
      renderFeed(customFeed, posts, `Geen posts gevonden voor r/${subreddit}.`);
    } catch (error) {
      renderFeed(customFeed, [], `Kon r/${subreddit} niet laden.`);
    }
  });
};

const initGlobe = async () => {
  const container = document.getElementById('globeViz');
  const globe = Globe()(container)
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-dark.jpg')
    .backgroundColor('rgba(0,0,0,0)')
    .pointAltitude('size')
    .pointColor(() => '#2bff2b')
    .pointRadius(0.16)
    .pointsMerge(true);

  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,latlng,population');
    const countries = await response.json();

    const points = countries
      .filter((country) => Array.isArray(country.latlng) && country.latlng.length === 2)
      .slice(0, 180)
      .map((country) => ({
        lat: country.latlng[0],
        lng: country.latlng[1],
        size: Math.max(0.06, Math.log10((country.population || 1) + 1) / 28),
        label: country.name.common
      }));

    globe.pointsData(points);
  } catch (error) {
    globe.pointsData([
      { lat: 52.3676, lng: 4.9041, size: 0.15, label: 'Amsterdam' },
      { lat: 35.6762, lng: 139.6503, size: 0.15, label: 'Tokyo' },
      { lat: 40.7128, lng: -74.006, size: 0.15, label: 'New York' }
    ]);
  }

  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.45;
};

initGlobe();
initFeeds();
