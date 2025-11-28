This `src/` folder will hold source files for the library (Sass/PostCSS partials,
JS modules, and example source). For now the repository keeps the current CSS in
`/css` and the build scripts operate on `css/final-fantasy.css` to produce bundled
assets in `dist/`.

Next steps to migrate source into `src/`:
- Move `css/core.css` -> `src/css/_core.scss`
- Move `css/components.css` -> `src/css/_components.scss`
- Move theme files -> `src/css/themes/_theme-ff7.scss`, etc.
- Create `src/js/` modules and build with Rollup.
