# PhilDesigns Tournament Bracket

**Responsive flexbox tournament brackets. Create and manage brackets from the admin, then embed with `[tournament_bracket id="POST_ID"]`.**

Tags: tournament, bracket, sports, shortcode, flexbox
Requires at least: 6.7
Tested up to: 7.0
Requires PHP: 7.4
License: GPL-2.0-or-later

---

## Description

PhilDesigns Tournament Bracket lets you build and display single-elimination tournament brackets on any post or page. Create brackets visually from the WordPress admin — add rounds, fill in team names, seeds, scores, and mark winners — then embed with a simple shortcode.

**Features:**

- Unlimited rounds and matches per bracket
- Per-match fields: team name, seed, score, winner, optional header label, optional color accent
- Champion display with trophy graphic when a final winner is selected
- Three built-in themes: Dark, Light, Dark Trendy (or None)
- Optional inline theme switcher via shortcode attribute
- Fully responsive flexbox layout

## Website

https://phildesigns.com

---

## Installation

1. Upload the `tournament-bracket` folder to `/wp-content/plugins/`
2. Activate the plugin through the **Plugins** menu in WordPress
3. Go to **Tournaments → Add New Tournament**, give it a title
4. In the **Bracket Settings** sidebar, pick a theme (Dark / Light / Dark Trendy / None)
5. In the **Rounds & Matches** box, click **+ Add Round** for each column (left = first round, right = final), then **+ Add Match** within each round — fill in seed, team name, score, and select the winner
6. Publish or Update the post
7. Copy the shortcode shown in the sidebar and paste it into any post or page

## Shortcode

```
[tournament_bracket id="42"]
[tournament_bracket id="42" theme="light"]
[tournament_bracket id="42" show_switcher="true"]
```

**Attributes:**

- `id` — the Tournament post ID (required)
- `theme` — override the saved theme: `dark`, `light`, `dark-trendy`, or `none`
- `show_switcher` — set to `true` to render live theme-switcher buttons inline

---

## Changelog

### 1.2.0
- Added ability to deselect a match winner via a "Clear winner" button.
- Added optional match label: a short text header displayed above the match card.
- Added optional color accent per match: a color picker applies a colored left-border stripe to the match card.

### 1.0.0
- Initial release.
