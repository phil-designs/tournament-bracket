<?php

/*-----------------------------------------------------------------------------------*/
/*  CUSTOM POST TYPE REGISTRATION
/*-----------------------------------------------------------------------------------*/

// Create Custom Post Type
function timeline_init() {
    $args = array(
      'label' => 'Timelines',
        'public' => false,
        'show_ui' => true,
        'capability_type' => 'post',
        'hierarchical' => false,
        'rewrite' => array('slug' => 'timeline'),
        'query_var' => true,
        'menu_icon' => 'dashicons-calendar',
        'supports' => array(
            'title',
            )
        );
    register_post_type( 'timeline', $args );
}
add_action( 'init', 'timeline_init' );

/**
 * Register meta boxes.
 */
function shortcode_meta_boxes() {
    add_meta_box( 'hcf-1', __( 'Shortcode', 'hcf' ), 'hcf_display_callback', 'timeline', 'side' );
}
add_action( 'add_meta_boxes', 'shortcode_meta_boxes' );

/**
 * Meta box display callback.
 *
 * @param WP_Post $post Current post object.
 */
function hcf_display_callback( $post ) {
	$post_id = $_GET['post'];
    echo '<style>.postbox .inside{padding:0;}</style>';
	echo "<em style='padding:12px 12px 0;display:inline-block;'>Copy and paste this shortcode within your post or page. Default orientation is vertical.</em><br/><br/>";
    echo "<code style='margin: 0 5px 25px;display:inline-block;'>[timeline id='$post_id' orientation='$orientation']</code>";
	echo "<input type='text' value='[timeline id=&apos;$post_id&apos; orientation=&apos;$orientation&apos;]' id='myInput' style='opacity:0;position:absolute;'>";
    echo '<div id="major-publishing-actions"><div id="delete-action"></div><div id="publishing-action" style="float:none;">';
    echo '<a href="#" class="button button-primary button-large" onclick="myFunction()" title="Copy to clipboard">Copy</a>';
	echo '<script>function myFunction() {
		  var copyText = document.getElementById("myInput");
		  copyText.select();
		  copyText.setSelectionRange(0, 99999)
		  document.execCommand("copy");
		  alert("Copied the text: " + copyText.value);
		}</script>';
    echo '<div class="clear"></div></div></div>';
}

/* THIS HELPS FOR SINGLE PAGES FOR CUSTOM POST TYPES */
flush_rewrite_rules();