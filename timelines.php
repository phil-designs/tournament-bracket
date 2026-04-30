<?php
/*
 * Plugin Name: Timelines
 * Plugin URI: http://phildesigns.com/
 * Description: Adds timeline function as a CPT and inserted into a post or a page as a shortcode with vertical & horizontal options.
 * Version: 1.0
 * Author: phil.designs | Phillip De Vita
 * Author URI: http://phildesigns.com/
 * License: GPL2
 */

if ( !defined( 'ABSPATH' ) ) exit; // Do not allow direct access

define( 'PD_TL_VERSION', '1.0' );
define( 'PD_TL_URL', untrailingslashit(plugin_dir_url( __FILE__ )) );
define( 'PD_TL_PATH', dirname(__FILE__) );

include( PD_TL_PATH . '/fields/timeline-fields.php' );

function PD_tl_initialize() {
	if ( !class_exists('acf') ) {
		add_action( 'admin_notices', 'PD_tl_acf_error' );
		return;
	}

	include( PD_TL_PATH . '/includes/cpt.php' );
	include( PD_TL_PATH . '/includes/timeline.php' );
	include( PD_TL_PATH . '/includes/enqueue.php' );
}
add_action( 'after_setup_theme', 'PD_tl_initialize', 20 );

function PD_tl_acf_error() {
	?>
	<div class="notice notice-error">
		<p><strong>Important Timelines Plugin Alert:</strong> The plugin Advanced Custom Fields PRO is not active. Please activate ACF Pro, or disable this plugin.</p>
	</div>
	<?php
}