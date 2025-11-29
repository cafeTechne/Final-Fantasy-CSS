# Contributing to Final Fantasy CSS

Thanks for wanting to contribute! This project follows a documentation-first workflow, but the `README.md` is the canonical, reviewer-focused reference for the library and includes a concise components quick reference. Per-component markdown files in `docs/components/` have been consolidated into the README; those files remain as stubs for longer notes only. Use `examples/components/` for live previews.

Please follow these steps when contributing:

1. Fork the repo and open a branch for your work.

2. Update or add component documentation
   - Add a markdown file to `docs/components/` (use `kebab-case` filenames, e.g. `ff-navbar.md`).
   - Each doc should include at least:
     - A title (`# Component Name`)
     - A short description
     - Markup example(s) in fenced code blocks
     - Usage notes (classes, `data-*` attributes)
     - Accessibility notes (keyboard, ARIA roles) where applicable

   Example component skeleton (paste into a new `docs/components/<name>.md`):

   ```md
   # FF Navbar

   Small description of the navbar component.

   ## Markup

   ```html
   <nav class="ff-navbar"> ... </nav>
   ```

   ## Usage

   - `ff-navbar` : base class
   - `data-*` attributes: explain any actions

   ## Accessibility

   - Notes about keyboard support and ARIA.
   ```

3. Add or update example preview (optional but encouraged)
   - Create or update an HTML preview in `examples/components/` (filename should match the doc intent, e.g. `navbar.html`).
   - Keep examples lightweight and self-contained — link to `../../css/final-fantasy.css` and `../../js/ff.js` as needed.


4. Run the build locally (optional)

   If you want to regenerate pre-rendered docs or the distribution stylesheet, you can run the provided Node scripts locally. This repository does not require CI to run these steps — builds are manual and should be committed along with source changes when needed.

   Install dependencies (Node.js required):

   ```powershell
   npm install
   npm run build:docs
   ```

   Or run the full build (CSS + docs):

   ```powershell
   npm run build
   ```

   Generated static docs will land in `docs/site/generated/` and you can open `docs/site/generated/index.html` in a browser.

Local dev server

You can run a quick local server with live reload for `docs/site`:

```powershell
npm install
npm run dev:docs
```

This runs `live-server` on port `5173` and opens the interactive docs viewer. It's useful for previewing edits to markdown and example HTML files before running the full `build:docs` step.

5. Commit and open a Pull Request

   - Follow conventional commits where practical; include a short description of what changed and why.
   - If you added a new component, add its doc and example. Builds and generated docs are not run by CI for this repository; please run the build locally and include generated docs in your PR if you want reviewers to see rendered output.

Notes
- Fonts in `FF6/fonts/` may have licensing restrictions; double-check before attempting redistribution.

- The CI builds and commits generated docs into the repository `docs/` folder on `master`. Configure GitHub Pages (Repository → Settings → Pages) to serve content from the `docs/` folder on the `master` branch.

If you'd like, I can extend the workflow to post the generated docs link into PRs automatically (helpful for reviewers).

If you'd like, add a short example of your intended change to the issue or PR so someone can quickly review.

Thanks — we appreciate your help in making this project better!
