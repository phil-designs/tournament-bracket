<?php
/**
 * Plugin Name:       PhilDesigns Tournament Bracket
 * Plugin URI:        https://phildesigns.com
 * Description:       Responsive flexbox tournament brackets. Create and manage brackets from the admin, then embed with [tournament_bracket id="POST_ID"].
 * Version:           1.3.0
 * Author:            PhilDesigns
 * Author URI:        https://phildesigns.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       tournament-bracket
 * Domain Path:       /languages
 * Requires at least: 6.7
 * Tested up to:      7.0
 * Requires PHP:      7.4
 */

defined( 'ABSPATH' ) || exit;

define( 'TB_VERSION',    '1.3.0' );
define( 'TB_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'TB_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

require_once TB_PLUGIN_DIR . 'includes/class-tb-cpt.php';
require_once TB_PLUGIN_DIR . 'includes/class-tb-shortcode.php';
require_once TB_PLUGIN_DIR . 'admin/class-tb-admin.php';

register_activation_hook( __FILE__, 'tournament_bracket_activate' );
function tournament_bracket_activate() {
	flush_rewrite_rules();
}

add_action( 'plugins_loaded', function () {
	new TB_CPT();
	new TB_Shortcode();
	if ( is_admin() ) {
		new TB_Admin();
	}
} );
