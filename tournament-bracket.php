<?php
/**
 * Plugin Name: Tournament Bracket
 * Plugin URI:  https://www.phildesigns.com
 * Description: Responsive flexbox tournament brackets. Create and manage brackets from the admin, then embed with [tournament_bracket id="POST_ID"].
 * Version:     1.2.0
 * Author:      phil.designs | Phillip De Vita
 * Author URI:  https://www.phildesigns.com
 * License:     GPL-2.0+
 * Text Domain: tournament-bracket
 */

defined( 'ABSPATH' ) || exit;

define( 'TB_VERSION',    '1.2.0' );
define( 'TB_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'TB_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

require_once TB_PLUGIN_DIR . 'includes/class-tb-cpt.php';
require_once TB_PLUGIN_DIR . 'includes/class-tb-shortcode.php';
require_once TB_PLUGIN_DIR . 'admin/class-tb-admin.php';

add_action( 'plugins_loaded', function () {
	new TB_CPT();
	new TB_Shortcode();
	if ( is_admin() ) {
		new TB_Admin();
	}
} );
