# Prince Dhakad Portfolio

React + Vite portfolio for Prince Dhakad.

## Image setup

All portfolio images are static production assets in:

`public/images/`

The app references them with root-relative URLs such as:

- `/images/portrait.png`
- `/images/yt-01.png` through `/images/yt-10.png`
- `/images/reel-01.png` through `/images/reel-04.png`

The filenames contain no spaces, and the project no longer depends on missing `.jpg` or `.svg` placeholder files.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

The generated `dist/` folder can be deployed to Vercel, Netlify, or another static host.

## Important

The Photo & Thumbnail Manager's custom uploads are browser-local (IndexedDB/localStorage). They are useful for changing images in the current browser, but they are not automatically published to other visitors. To change the public portfolio for everyone, replace the files in `public/images/` and redeploy.
