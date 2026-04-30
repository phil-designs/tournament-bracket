<?php

if ( !defined( 'ABSPATH' ) ) exit; // Do not allow direct access

// Add our stylesheet
function pd_tl_enqueue_scripts() {
	
		wp_enqueue_style( 'pd_tl', PD_TL_URL . '/assets/timeline.css', array(), PD_TL_VERSION );
		wp_enqueue_script( 'pd_tl', PD_TL_URL . '/assets/timeline.js', array('jquery'), PD_TL_VERSION, true );
	
}
add_action( 'wp_enqueue_scripts', 'pd_tl_enqueue_scripts', 8 );