# Portfolio + project pages

Copy the contents of this folder into `RainWoo1/rainwoo1.github.io`, preserving the folder structure. This bundle includes the v2 homepage, its corrected project descriptions, all seven rewritten project pages, their Markdown sources, styles, scripts, and the images those pages use.

## Preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. No install or build is needed to view the included pages. Do not open the site through `file://` if you are comparing it with the previous fetch-based version.

## Edit project content

Edit `projects/<project>/content.md`, then rebuild the static pages:

```bash
npm install
npm run build
```

Node 20 or later is required for the build. The published pages themselves do not depend on Node, Alpine, Tailwind CDN, or a Markdown CDN. JavaScript enhances reading progress, section tracking, and image enlargement; the articles and navigation are regular HTML.

`build-projects.mjs` owns the page layout and project ordering. `css/project.css` contains the detail-page styles. Existing assets outside this bundle can remain in the repository.

## Content notes

- MediPath is a mapping and routing project, not a medical imaging project. Its traffic overlay is described separately from pathfinding.
- The allocator is implemented in C. The existing detailed write-up is retained and the workload-specific small allocation path is clarified.
- LSTM content follows the financial-fundamentals research direction in the repository. It does not claim next-day trading, walk-forward evaluation, or proven leakage-free validation.
- Daily Calorie Planner distinguishes the browser processing pipeline from the mobile upload endpoint.
- Forklift content follows the capstone proposal and current planning / bring-up status. A private repository's implementation files are not included in this public website bundle.
- Career Canvas expands only the existing portfolio description; a matching source repository was not identified.
- aUToronto keeps team attribution for the health monitor and Streamdeck software.

These are prepared local changes. This bundle does not publish the site or push a GitHub commit.
