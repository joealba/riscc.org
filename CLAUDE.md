# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bundle exec middleman server   # dev server at http://localhost:4567
bundle exec middleman build    # production build to build/
```

Ruby version is managed via rvm; the project uses Ruby 3.4.4 (see `.ruby-version`).

## Architecture

This is a [Middleman](https://middlemanapp.com/) static site deployed to Netlify. The CI workflow (`/.github/workflows/main.yml`) triggers a Netlify build hook on push to `main` — Netlify runs the actual build, not GitHub Actions.

### Content model

All content is data-driven via YAML files in `data/`. A Netlify CMS instance (`/admin`) lets non-technical editors manage content through a Git-backed UI.

**Events** are the primary content type:
- Stored as individual YAML files in `data/events/` (one file per event)
- `config.rb` loops over `data.events` and proxies each one to `source/event.html.slim` with the `event-detail` layout
- The generated URL is `/event/YYYY-MM-DD/<title-slug>/`
- Event body is Markdown, rendered in templates via the `markdown()` helper in `config.rb`

**Other data:**
- `data/pages/home.yml` — homepage hero and story text
- `data/settings/navigation.yml` — nav links rendered in the shared header partial
- `data/settings/units.yml` — currency/weight units (legacy from starter template, unused in practice)

### Templates

Templates use a mix of Slim and Haml (both are supported). Layouts live in `source/layouts/`:
- `layout.slim` — the outer shell (head, header, footer)
- `event-detail.slim` — wraps `layout.slim` via `wrap_layout :layout`

Page templates in `source/` use `.html.slim` or `.html.haml` extensions. Partials are in `source/partials/` and prefixed with `_`.

### Helpers (`config.rb`)

- `markdown(content)` — renders a Markdown string to HTML using `Kramdown::Document` directly (not the Middleman Tilt wrapper, which breaks in Middleman 4.6+)
- `nav_link(text, url, options)` — renders a link and adds `active` class when on the current page
- `background_image(image)` — returns a CSS `background-image` inline style with the asset path

### Build pipeline

- CSS: single SCSS file at `source/stylesheets/all.css.scss`; minified in build
- JS: plain ES6 at `source/javascripts/main.js`; minified via Uglifier (harmony mode) in build
- Autoprefixer runs on all CSS output
- Gzip compression is enabled for the build output
