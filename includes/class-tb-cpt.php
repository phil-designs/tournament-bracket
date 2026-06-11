<?php
defined( 'ABSPATH' ) || exit;

class TB_CPT {

	public function __construct() {
		add_action( 'init', [ $this, 'register' ] );
		add_filter( 'manage_tournament_posts_columns',       [ $this, 'columns' ] );
		add_action( 'manage_tournament_posts_custom_column', [ $this, 'column_content' ], 10, 2 );
	}

	public function register() {
		register_post_type( 'tournament', [
			'labels'       => [
				'name'               => __( 'Tournaments', 'tournament-bracket' ),
				'singular_name'      => __( 'Tournament', 'tournament-bracket' ),
				'add_new'            => __( 'Add New', 'tournament-bracket' ),
				'add_new_item'       => __( 'Add New Tournament', 'tournament-bracket' ),
				'edit_item'          => __( 'Edit Tournament', 'tournament-bracket' ),
				'new_item'           => __( 'New Tournament', 'tournament-bracket' ),
				'view_item'          => __( 'View Tournament', 'tournament-bracket' ),
				'search_items'       => __( 'Search Tournaments', 'tournament-bracket' ),
				'not_found'          => __( 'No tournaments found.', 'tournament-bracket' ),
				'not_found_in_trash' => __( 'No tournaments found in trash.', 'tournament-bracket' ),
			],
			'public'       => false,
			'show_ui'      => true,
			'show_in_menu' => true,
			'menu_icon'    => 'dashicons-awards',
			'supports'     => [ 'title' ],
			'rewrite'      => false,
		] );
	}

	public function columns( $cols ) {
		return [
			'cb'        => $cols['cb'],
			'title'     => __( 'Tournament Name', 'tournament-bracket' ),
			'shortcode' => __( 'Shortcode', 'tournament-bracket' ),
			'theme'     => __( 'Theme', 'tournament-bracket' ),
			'date'      => $cols['date'],
		];
	}

	public function column_content( $col, $post_id ) {
		if ( 'shortcode' === $col ) {
			echo '<code>[tournament_bracket id="' . absint( $post_id ) . '"]</code>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- contains only static developer HTML and an absint-sanitized integer.
		}
		if ( 'theme' === $col ) {
			$theme = get_post_meta( $post_id, '_tb_theme', true ) ?: 'dark';
			echo esc_html( $theme );
		}
	}
}
