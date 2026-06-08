<?php
defined( 'ABSPATH' ) || exit;

class TB_Admin {

	public function __construct() {
		add_action( 'add_meta_boxes',        [ $this, 'add_meta_boxes' ] );
		add_action( 'save_post_tournament',  [ $this, 'save' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue' ] );
	}

	public function enqueue( $hook ) {
		global $post;
		if ( ! in_array( $hook, [ 'post.php', 'post-new.php' ], true ) ) return;
		if ( ! $post || get_post_type( $post->ID ) !== 'tournament' ) return;

		wp_enqueue_script(
			'tb-admin',
			TB_PLUGIN_URL . 'assets/js/tournament-bracket-admin.js',
			[ 'jquery' ],
			TB_VERSION,
			true
		);
		wp_enqueue_style(
			'tb-admin',
			TB_PLUGIN_URL . 'assets/css/tournament-bracket-admin.css',
			[],
			TB_VERSION
		);
	}

	public function add_meta_boxes() {
		add_meta_box(
			'tb-settings',
			__( 'Bracket Settings', 'tournament-bracket' ),
			[ $this, 'settings_box' ],
			'tournament',
			'side',
			'high'
		);
		add_meta_box(
			'tb-rounds',
			__( 'Rounds & Matches', 'tournament-bracket' ),
			[ $this, 'rounds_box' ],
			'tournament',
			'normal',
			'high'
		);
	}

	public function settings_box( $post ) {
		wp_nonce_field( 'tb_save', 'tb_nonce' );

		$theme  = get_post_meta( $post->ID, '_tb_theme', true ) ?: 'dark';
		$themes = [
			'dark'        => 'Dark',
			'light'       => 'Light',
			'dark-trendy' => 'Dark Trendy',
			'none'        => 'None',
		];
		?>
		<p>
			<label for="tb_theme"><strong><?php esc_html_e( 'Theme', 'tournament-bracket' ); ?></strong></label><br>
			<select name="tb_theme" id="tb_theme" style="width:100%;margin-top:4px">
				<?php foreach ( $themes as $val => $label ) : ?>
					<option value="<?php echo esc_attr( $val ); ?>" <?php selected( $theme, $val ); ?>>
						<?php echo esc_html( $label ); ?>
					</option>
				<?php endforeach; ?>
			</select>
		</p>
		<p>
			<strong><?php esc_html_e( 'Shortcode', 'tournament-bracket' ); ?></strong><br>
			<code>[tournament_bracket id="<?php echo absint( $post->ID ); ?>"]</code>
		</p>
		<p class="description">
			<?php esc_html_e( 'Optional attributes: theme="light|dark|dark-trendy|none" show_switcher="true"', 'tournament-bracket' ); ?>
		</p>
		<?php
	}

	public function rounds_box( $post ) {
		$rounds = get_post_meta( $post->ID, '_tb_rounds', true ) ?: '[]';
		?>
		<input type="hidden" id="tb_rounds_data" name="tb_rounds" value="<?php echo esc_attr( $rounds ); ?>">
		<div id="tb-rounds-editor"></div>
		<p>
			<button type="button" class="button button-primary" id="tb-add-round">
				+ <?php esc_html_e( 'Add Round', 'tournament-bracket' ); ?>
			</button>
		</p>
		<p class="description">
			<?php esc_html_e( 'Add rounds left-to-right: e.g. Quarter-finals → Semi-finals → Final. Each round\'s match count should be half the previous.', 'tournament-bracket' ); ?>
		</p>
		<?php
	}

	public function save( $post_id ) {
		if ( ! isset( $_POST['tb_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['tb_nonce'] ) ), 'tb_save' ) ) {
			return;
		}
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
		if ( ! current_user_can( 'edit_post', $post_id ) ) return;

		if ( isset( $_POST['tb_theme'] ) ) {
			update_post_meta( $post_id, '_tb_theme', sanitize_text_field( $_POST['tb_theme'] ) );
		}

		if ( isset( $_POST['tb_rounds'] ) ) {
			$raw    = wp_unslash( $_POST['tb_rounds'] );
			$rounds = json_decode( $raw, true );
        // Sanitize: replace any non-associative team arrays with empty objects
        if ( is_array( $rounds ) ) {
            foreach ( $rounds as &$round ) {
                if ( is_array( $round ) ) {
                    foreach ( $round as &$match ) {
                        if ( is_array( $match ) ) {
                            foreach ( [ 'top', 'bottom' ] as $side ) {
                                if ( isset( $match[ $side ] ) && array_values( (array) $match[ $side ] ) === (array) $match[ $side ] ) {
                                    $match[ $side ] = [];
                                }
                            }
                        }
                    }
                    unset( $match );
                }
            }
            unset( $round );
        }
			if ( is_array( $rounds ) ) {
				update_post_meta( $post_id, '_tb_rounds', wp_json_encode( $rounds ) );
			}
		}
	}
}
