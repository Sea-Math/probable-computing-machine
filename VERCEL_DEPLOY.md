# Vercel deployment

1. Upload this project to GitHub.
2. Import the repository into Vercel.
3. Use the default Node.js settings.
4. Set the build command to `npm run vercel-build` if Vercel does not detect it.
5. Deploy.

The API is served through `api/index.ts`, while the frontend is served from `public/index.html`.

Important: routes that execute `yt-dlp` may require a separate compatible backend because Vercel functions have execution-time, binary, and resource limitations.
