# Final Fantasy CSS

Final Fantasy CSS is a small, modular CSS library inspired by classic Final Fantasy UI aesthetics. It provides a set of prefixed, reusable components and a lightweight JS helper for optional interactive features.

Quick highlights
- Modular CSS components, prefix `ff-` (for example: `.ff-btn`, `.ff-navbar`).
- Lightweight progressive enhancement via `js/ff.js` (data-action attributes).
- In-repo documentation with live preview examples under `docs/site/` and `examples/components/`.

Quick start (no build)
1. Copy or reference the repo files in your project.
2. Include the stylesheet and optional JS in your page:

```html
<link rel="stylesheet" href="/path/to/Final-Fantasy-CSS/css/final-fantasy.css">
<script src="/path/to/Final-Fantasy-CSS/js/ff.js"></script>
```


No build required

This repository ships with pre-rendered documentation under `docs/` and ready-to-open example pages in `examples/components/`. You can open `docs/site/index.html` directly in a browser to browse docs and live previews.

If you want to regenerate the pre-rendered docs (optional), run the `scripts/build-docs.js` Node script. The project intentionally avoids a required build step so it remains simple to use.

Theming

Themes are applied by adding a theme class to the root element, e.g. `<body class="theme-ff7">`.

Interactive helpers

The JS file provides a delegated handler for a small set of `data-action` values (progressive enhancement):

- `data-action="set-theme"` — switch themes
- `data-action="show-modal"` / `hide-modal` — modal helpers
- `data-action="toggle-dropdown"` — dropdowns
- `data-action="toggle-nav"` — navbar expand/collapse

Examples & docs

- `examples/components/` — standalone example pages used by the in-repo docs viewer.
- `docs/site/index.html` — open this file to browse component docs and try examples locally.

Dist stylesheet (recommended for consumers)

If you want a single stylesheet file that consumers can link to without running any build tools, use the pre-built distribution:

```html
<link rel="stylesheet" href="/path/to/Final-Fantasy-CSS/dist/final-fantasy.css">
```

Regenerating the distribution

We keep a small, zero-dependency Node script that concatenates the project's CSS sources and resolves local `@import` rules into a single `dist/final-fantasy.css`. This avoids reintroducing a required build pipeline while making it easy to recreate the dist when you change source files.

To regenerate the dist file (optional):

1. Ensure Node.js is available on your machine.
2. Run the script from the repository root:

```powershell
node scripts/build-dist.js
```

The script will write `dist/final-fantasy.css` by resolving local `@import` rules. It intentionally does not fetch remote `@import` URLs (for example Google Fonts); those are left in the built file so browsers can fetch them.

Notes for future contributors / agents

- Rationale: The project keeps pre-rendered docs and a built `dist/final-fantasy.css` to minimize friction for consumers who just want a single file to reference.
- If you're an automated agent or contributor returning to this repo later: we intentionally removed a required Node build step to keep the repository portable. If you need to produce a minified version or use PostCSS features, reintroducing a `package.json` and a PostCSS pipeline is acceptable, but document the change and include the built `dist/` files in the commit so consumers continue to get a single-file stylesheet without running builds.
- When making design iterations: edit the source files under `css/` (themes, `components/`, `core.css`, `fonts.css`), then run `node scripts/build-dist.js` and commit `dist/final-fantasy.css` along with your source changes so reviewers can see the combined output quickly.

Notes

- Fonts in `FF6/fonts/` may have licensing restrictions; check `FF6/fonts/readme.txt` before redistribution.
- This project is a fan-made, educational project and is not affiliated with Square Enix.

Contributing

Contributions are welcome. Edit or add component docs under `docs/components/`, update styles under `css/`, and use the provided build scripts to regenerate the pre-rendered docs.

License

See the repository license file (if present) and review font licenses before redistribution.

---
Updated docs and examples; wired navbar toggle behavior and removed inline demo styles.
# Final Fantasy CSS
A retro-inspired CSS component library for building Final Fantasy-style UI elements. Use it as a standalone stylesheet (no build required) or include from a project build pipeline. Components are prefixed with `ff-` and can be themed by adding a theme class to the document root (for example `.theme-ff7`).

## Contents

- [Quick Start — No build (plain HTML)](#quick-start--no-build-plain-html)
- [Quick Start — With npm (build & distribute)](#quick-start--with-npm-build--distribute)
- [Theming](#theming)
- [Markup examples](#markup-examples)
- [JS API (lightweight)](#js-api-lightweight)
- [Components (Canonical Quick Reference)](#components-canonical-quick-reference)
- [Build & Local Dev (summary)](#build--local-dev-summary)
- [Where to find more details](#where-to-find-more-details)
- [Roadmap](#roadmap)
- [License & Fonts](#license--fonts)


## Quick Start — No build (plain HTML)
If you don't use npm or a bundler, you can include the stylesheet and the optional JS directly from the repository files.

1. Copy the repo files into your project or reference them locally.
2. Add the stylesheet and JS to your page:

```html
<!-- CSS (this will follow the @import chain in css/final-fantasy.css) -->
<link rel="stylesheet" href="/path/to/Final-Fantasy-CSS/css/final-fantasy.css">

<!-- Optional JS for interactive components (progressive enhancement) -->
<script src="/path/to/Final-Fantasy-CSS/js/ff.js"></script>
```

Notes:
- `css/final-fantasy.css` currently uses `@import` to include component files. Browsers will fetch those imports; for production we recommend using the built `dist/final-fantasy.css` (see Build section) for better performance.

## Quick Start — With npm (build & distribute)
For consumers who use npm or want a single bundled file, we provide PostCSS-based build scripts.

1. Install dependencies:

```bash
npm install
```

2. Build the CSS (development):

```bash
npm run build:css
```

This will generate `dist/final-fantasy.css` by inlining imports and running autoprefixer.

3. Build minified CSS for production:

```bash
npm run build:css:min
```

When published to npm, you'll be able to reference the distributed CSS via CDN (example):

```html
<link rel="stylesheet" href="https://unpkg.com/final-fantasy-css@x.y.z/dist/final-fantasy.min.css">
```

## Theming
Apply a theme class to your root element to switch visual themes. Example:

```html
<body class="theme-ff7">
  <!-- page markup -->
</body>
```

Theme files live under `css/` and will be converted to variable-driven themes as part of the next migration steps.

## Markup examples
- Button

```html
<button class="ff-btn ff-btn-primary">Primary</button>
```

- Dropdown (JS enhancement optional)

```html
<div class="ff-dropdown" id="demo-dropdown">
  <button class="ff-btn" data-action="toggle-dropdown" data-target="demo-dropdown">Actions</button>
  <ul class="ff-dropdown-menu"> ... </ul>
</div>
```

- Modal (open programmatically):

```html
<div id="save-modal" class="ff-modal-backdrop">
  <div class="ff-window ff-modal" role="dialog" aria-modal="true">
    <div class="ff-window-content"> ... </div>
  </div>
</div>

<!-- Open modal using data-action -->
<button class="ff-btn" data-action="show-modal" data-modal="save-modal">Open</button>
```

## JS API (lightweight)
The library uses `data-action` attributes for progressive enhancement. Current actions include:

- `data-action="set-theme" data-theme="theme-ff7"` — switch themes
- `data-action="show-modal" data-modal="save-modal"` — show a modal
- `data-action="hide-modal" data-modal="save-modal"` — hide a modal
- `data-action="toggle-dropdown" data-target="demo-dropdown"` — toggle a dropdown

These are handled by `js/ff.js` (delegated event handling). You can also call the helper functions directly if you prefer programmatic control: `setTheme(name)`, `showModal(id)`, `hideModal(id)`, `toggleDropdown(id)`.

## Examples
See `examples/simple.html` for a minimal, standalone example that doesn't require npm. Use it to quickly try the components in a browser.

## Components (Canonical Quick Reference)
Below is a concise, canonical reference for the core components. This README is intended to be the primary, review-friendly documentation — the `docs/components/` markdown files may contain longer notes and examples.

- **Buttons**

  Basic usage:

  ```html
  <button class="ff-btn ff-btn-primary">Primary</button>
  <button class="ff-btn">Secondary</button>
  ```

  - `.ff-btn` : base button styles
  - `.ff-btn-primary` : primary variant (accent color)

- **Navbar**

  Simple markup:

  ```html
  <nav class="ff-navbar">
    <div class="ff-navbar-brand">My Project</div>
    <ul class="ff-navbar-nav">
      <li><a href="#">Home</a></li>
    </ul>
  </nav>
  ```

  - Use the `.ff-navbar` container and `.ff-navbar-nav` for links. Keep markup semantic and accessible.
  - Example preview: `examples/components/navbar.html`

- **Dropdown** (progressive enhancement)

  ```html
  <div class="ff-dropdown" id="demo-dropdown">
    <button class="ff-btn" data-action="toggle-dropdown" data-target="demo-dropdown">Actions</button>
    <ul class="ff-dropdown-menu"> <li><a href="#">One</a></li> </ul>
  </div>
  ```

  - The JS `data-action` attribute is optional; markup should work without JS for accessibility.

- **Modal**

  Markup:

  ```html
  <div id="save-modal" class="ff-modal-backdrop" hidden>
    <div class="ff-window ff-modal" role="dialog" aria-modal="true">
      <div class="ff-window-content"> ... </div>
    </div>
  </div>
  <button class="ff-btn" data-action="show-modal" data-modal="save-modal">Open</button>
  ```

  - Use `data-action="show-modal"` / `data-action="hide-modal"` for the JS helper to toggle visibility.

- **Forms**

  Use form control classes from `css/core.css` / component styles. Keep labels explicit and associate them with inputs using `for` / `id`.

- **Table**

  Basic table markup is styled by component table CSS. Use semantic `<table>` markup and include `thead` / `tbody` for accessibility.
  - Example preview: `examples/components/table.html`

## Build & Local Dev (summary)

- Build CSS and pre-render docs:

  ```powershell
  npm install
  npm run build
  ```

  This runs PostCSS to generate `dist/final-fantasy.css` and runs the docs pre-renderer to generate `docs/site/generated` (CI copies built docs into `docs/` for GitHub Pages).

- Quick local preview (no build required for the interactive viewer):

  ```powershell
  npx live-server docs/site --entry-file=docs/site/index.html
  ```

  Or run the dev script added to `package.json`:

  ```powershell
  npm run dev:docs
  ```

## Where to find more details

- Long-form, per-component docs and examples are available in `docs/components/` and `examples/components/`. These are useful if you need larger code examples or deep notes.


## Roadmap

## License & Fonts

Preview deploys / CI

GitHub Actions workflows and Netlify preview deploys have been disabled for this repository to avoid automated runs and notification spam. Builds and deploys are intentionally manual for now — see the "Build & Local Dev" section for local build steps.

---
If you'd like, I can now convert the CSS into `src/` Sass partials and switch the build to use `sass` (modular workflow). Or I can add a small docs site (VitePress) to host live examples.
# Final-Fantasy-CSS
A love letter to the games of my youth. CSS components inspired by the menus of retro Final Fantasy Games.

<ul>
  <li><a href="https://github.com/cafeTechne/Final-Fantasy-CSS/tree/master/FF6">FF VI</a></li>
# Final Fantasy CSS

Final Fantasy CSS is a small, modular CSS library inspired by the classic Final Fantasy UI aesthetics. This repository contains the source styles, examples, and an in-repo documentation site with live previews.

Open the lightweight docs viewer locally by opening `docs/site/index.html` in your browser. It renders component markdown files and shows live previews from `examples/components/`.

Quick start:

- Serve the repository (recommended) and open `docs/site/index.html`, or open it directly from the filesystem in modern browsers.
- To build distributable CSS (requires Node.js):

  1. `npm install`
  2. `npm run build:css`

  The built files will be available in `dist/final-fantasy.css` and `dist/final-fantasy.min.css`.

Docs & examples:

- `docs/components/*.md` — per-component documentation (markdown).
- `examples/components/*` — example HTML pages used as live previews in the docs viewer.

Notes:

- Fonts in `FF6/fonts/` may have licensing restrictions; review `FF6/fonts/readme.txt` before redistribution.
- This project uses a documentation-first approach: component contracts are defined in markdown before full implementation.

If you'd like, I can:

- Wire up a small local server script to preview the docs with live reload.
- Convert the markdown docs to pre-rendered HTML files to avoid the in-browser renderer.

Building docs (pre-rendered HTML)

To pre-render `docs/components/*.md` into static HTML pages (useful for GitHub Pages or to avoid client-side rendering), run:

```
npm run build:docs
```

This will write generated HTML files to `docs/site/generated/` and create an index at `docs/site/generated/index.html`. The main `build` script runs CSS build and docs build together:

```
npm run build
```

Notes for contributors

- The project uses a documentation-first workflow: update or add component docs under `docs/components/` (markdown). Run `npm run build:docs` to regenerate static pages.
- If you'd like live preview during editing, open `docs/site/index.html` (interactive viewer) or open the generated `docs/site/generated/index.html` after running the build.
- The CI builds and commits generated docs into the repository `docs/` folder so GitHub Pages can serve the site from the `docs/` directory on the `master` branch.

Local development (live preview)

For quick local iteration with live reload, use the included dev script which uses `live-server`:

```powershell
npm install
npm run dev:docs
```

This serves `docs/site/` on port `5173` and opens `docs/site/index.html` in your browser. It automatically reloads when files in the served folder change. If you prefer not to install dev dependencies globally, `npx live-server docs/site` works too.






Font Courtesy of : https://fonts2u.com/final-fantasy-36-font-regular.font

Copyrighted by Veylon 2010, License: Freeware




Final Fantasy and all other trademarked material is the intellectual property of Square Enix.

Disclaimer: This is just a fan project for educational purposes only.
