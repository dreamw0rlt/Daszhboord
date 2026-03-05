# Daszhboord

Matrix-groen dashboard met:

- Een interactieve world globe (`globe.gl` + `three.js` via CDN)
- Cyber nieuws feed (Reddit `r/cybersecurity`)
- Wereldnieuws feed (Reddit `r/worldnews`)
- Mogelijkheid om een eigen subreddit feed toe te voegen

## Run lokaal

```bash
python3 -m http.server 4173
```

Open daarna: <http://localhost:4173>

## Gratis databronnen

- Reddit JSON feed: `https://www.reddit.com/r/<subreddit>.json`
- REST Countries API: `https://restcountries.com/v3.1/all`
