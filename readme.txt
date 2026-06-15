=== PhilDesigns Tournament Bracket ===
Contributors: phildesigns
Tags: tournament, bracket, sports, shortcode, flexbox
Requires at least: 6.7
Tested up to: 7.0
Requires PHP: 7.4
Stable tag: 1.3.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Responsive flexbox tournament brackets. Create and manage brackets from the admin, then embed anywhere with a shortcode.

== Description ==

PhilDesigns Tournament Bracket lets you build and display single-elimination tournament brackets on any post or page. Create brackets visually from the WordPress admin — add rounds, fill in team names, seeds, scores, and mark winners — then embed with a simple shortcode.

**Features:**

* Unlimited rounds and matches per bracket
* Per-match fields: team name, seed, score, winner, optional header label, optional color accent
* BYE slot support for uneven brackets — mark a team slot as BYE to display a highlighted "BYE WEEK" card and auto-advance the opponent
* Champion display with trophy graphic when a final winner is selected
* Three built-in themes: Dark, Light, Dark Trendy (or None)
* Optional inline theme switcher via shortcode attribute
* Fully responsive flexbox layout

== Installation ==

1. Upload the `tournament-bracket` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the **Plugins** menu in WordPress.
3. Go to **Tournaments → Add New Tournament** and give it a title.
4. In the **Bracket Settings** sidebar, pick a theme (Dark / Light / Dark Trendy / None).
5. In the **Rounds & Matches** box, click **+ Add Round** for each column (left = first round, right = final), then **+ Add Match** within each round — fill in seed, team name, score, and select the winner.
6. Publish or Update the post.
7. Copy the shortcode shown in the sidebar and paste it into any post or page.

== Shortcode Usage ==

Basic embed:

`[tournament_bracket id="42"]`

With a theme override:

`[tournament_bracket id="42" theme="light"]`

With the inline theme switcher:

`[tournament_bracket id="42" show_switcher="true"]`

**Attributes:**

* `id` — the Tournament post ID (required).
* `theme` — override the saved theme: `dark`, `light`, `dark-trendy`, or `none`.
* `show_switcher` — set to `true` to render live theme-switcher buttons inline.

== Frequently Asked Questions ==

= Where do I find the shortcode for a bracket? =

Open the tournament in the WordPress editor. The shortcode is shown in the **Bracket Settings** meta box in the sidebar.

= Can I display multiple themes on the same page? =

Yes — each shortcode instance is independent. Use the `theme` attribute to override the saved theme per embed.

= What happens if no winner is selected? =

The bracket renders without a champion display. The trophy and winner card only appear once a winner is marked in the final match.

== Screenshots ==

1. Tournament editor with Rounds & Matches builder.
2. Front-end bracket in Dark theme with champion display.
3. Front-end bracket in Light theme with inline theme switcher.

== Changelog ==

= 1.3.0 =
* Added BYE slot support for uneven brackets: mark any team slot as a BYE in the admin to display a "BYE WEEK" card (yellow highlight) and automatically advance the opposing team as the winner.

= 1.2.0 =
* Added ability to deselect a match winner via a "Clear winner" button.
* Added optional match label: a short text header displayed above the match card.
* Added optional color accent per match: a color picker applies a colored left-border stripe to the match card.

= 1.0.0 =
* Initial release.

== Upgrade Notice ==

= 1.3.0 =
Adds BYE slot support for uneven/odd-team-count brackets. No breaking changes.

= 1.2.0 =
Adds match labels, color accents, and a clear-winner button. No breaking changes.

= 1.0.0 =
Initial release.
