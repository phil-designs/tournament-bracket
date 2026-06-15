<?php
defined( 'ABSPATH' ) || exit;

class TB_Shortcode {

	public function __construct() {
		add_shortcode( 'tournament_bracket', [ $this, 'render' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'register_assets' ] );
	}

	public function register_assets() {
		wp_register_style(
			'tournament-bracket',
			TB_PLUGIN_URL . 'assets/css/tournament-bracket.css',
			[],
			TB_VERSION
		);
		wp_register_script(
			'tournament-bracket',
			TB_PLUGIN_URL . 'assets/js/tournament-bracket.js',
			[ 'jquery' ],
			TB_VERSION,
			true
		);
	}

	public function render( $atts ) {
		$atts = shortcode_atts( [
			'id'            => 0,
			'theme'         => '',
			'show_switcher' => 'false',
		], $atts, 'tournament_bracket' );

		$post_id = absint( $atts['id'] );

		if ( ! $post_id || get_post_type( $post_id ) !== 'tournament' ) {
			return '<!-- Tournament Bracket: invalid or missing id -->';
		}

		$rounds  = json_decode( get_post_meta( $post_id, '_tb_rounds', true ) ?: '[]', true );
		$theme   = $atts['theme'] ?: ( get_post_meta( $post_id, '_tb_theme', true ) ?: 'dark' );
		$show_sw = filter_var( $atts['show_switcher'], FILTER_VALIDATE_BOOLEAN );

		if ( empty( $rounds ) || ! is_array( $rounds ) ) {
			return '<p class="tb-empty">' . esc_html__( 'No bracket data found.', 'tournament-bracket' ) . '</p>';
		}

		// Detect the champion (winner of the last match in the last round).
		$champion   = null;
		$last_round = end( $rounds );
		$last_match = ! empty( $last_round ) ? end( $last_round ) : [];
		if ( ! empty( $last_match['top']['winner'] ) )    $champion = $last_match['top'];
		if ( ! empty( $last_match['bottom']['winner'] ) ) $champion = $last_match['bottom'];

		$last_col_index = count( $rounds ) - 1;

		wp_enqueue_style( 'tournament-bracket' );
		wp_enqueue_script( 'tournament-bracket' );

		$theme_class = ( 'none' !== $theme ) ? 'theme-' . sanitize_html_class( $theme ) : '';
		$uid         = 'tb-' . $post_id;

		ob_start();
		?>
		<div class="tb-container" id="<?php echo esc_attr( $uid ); ?>">
			<div class="tb-responsive-wrapper">
				<div class="theme <?php echo esc_attr( $theme_class ); ?>">
					<div class="bracket disable-image">

						<?php foreach ( $rounds as $col_index => $matches ) :
							$is_final   = ( $col_index === $last_col_index ) && ( null !== $champion );
							$has_center = false;
							foreach ( $matches as $_m ) {
								if ( ! empty( $_m['centered'] ) ) { $has_center = true; break; }
							}
							$col_class = 'column'
								. ( $is_final   ? ' tb-final-round'   : '' )
								. ( $has_center ? ' tb-col-center-bye' : '' );
						?>
							<div class="<?php echo esc_attr( $col_class ); ?>">
								<?php foreach ( $matches as $match ) :
									$top    = $match['top']    ?? [];
									$bottom = $match['bottom'] ?? [];

									$winner_class = '';
									if ( ! empty( $top['winner'] ) )    $winner_class = 'winner-top';
									if ( ! empty( $bottom['winner'] ) ) $winner_class = 'winner-bottom';

									$match_style = '';
									if ( ! empty( $match['color'] ) ) {
										$color = sanitize_hex_color( $match['color'] );
										if ( $color ) {
											$match_style = ' style="border-left: 4px solid ' . esc_attr( $color ) . '"';
										}
									}
									$is_centered   = ! empty( $match['centered'] );
									$match_classes = trim( 'match'
										. ( $winner_class ? ' ' . $winner_class : '' )
										. ( $is_centered  ? ' tb-match-center' : '' )
									);
								?>
									<div class="<?php echo esc_attr( $match_classes ); ?>"<?php echo $match_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
										<?php if ( ! empty( $match['header'] ) ) : ?>
											<div class="match-header"><?php echo esc_html( $match['header'] ); ?></div>
										<?php endif; ?>
										<?php
									$top_bye    = ! empty( $top['bye'] );
									$bottom_bye = ! empty( $bottom['bye'] );
									?>
										<div class="match-top team<?php echo $top_bye ? ' tb-bye' : ''; ?>">
											<?php if ( $top_bye ) : ?>
												<span class="name"><?php esc_html_e( 'BYE WEEK', 'tournament-bracket' ); ?></span>
											<?php else : ?>
												<span class="image"></span>
												<?php if ( ! empty( $top['seed'] ) ) : ?>
													<span class="seed"><?php echo esc_html( $top['seed'] ); ?></span>
												<?php endif; ?>
												<span class="name"><?php echo esc_html( $top['name'] ?? '' ); ?></span>
												<span class="score"><?php echo esc_html( $top['score'] ?? '' ); ?></span>
											<?php endif; ?>
										</div>
										<div class="match-bottom team<?php echo $bottom_bye ? ' tb-bye' : ''; ?>">
											<?php if ( $bottom_bye ) : ?>
												<span class="name"><?php esc_html_e( 'BYE WEEK', 'tournament-bracket' ); ?></span>
											<?php else : ?>
												<span class="image"></span>
												<?php if ( ! empty( $bottom['seed'] ) ) : ?>
													<span class="seed"><?php echo esc_html( $bottom['seed'] ); ?></span>
												<?php endif; ?>
												<span class="name"><?php echo esc_html( $bottom['name'] ?? '' ); ?></span>
												<span class="score"><?php echo esc_html( $bottom['score'] ?? '' ); ?></span>
											<?php endif; ?>
										</div>
										<div class="match-lines">
											<div class="line one"></div>
											<?php if ( ! $is_final ) : ?>
												<div class="line two"></div>
											<?php endif; ?>
										</div>
										<div class="match-lines alt">
											<div class="line one"></div>
										</div>
									</div>
								<?php endforeach; ?>
							</div>
						<?php endforeach; ?>

						<?php if ( $champion ) : ?>
						<div class="column tb-champion-column">
							<div class="tb-champion">
								<div class="match-lines alt">
									<div class="line one"></div>
								</div>
								<div class="tb-champion-box">
									<?php
								$trophy_path = plugin_dir_path( dirname( __FILE__ ) ) . 'assets/images/trophy.svg';
								if ( file_exists( $trophy_path ) ) {
									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG loaded from plugin's own assets directory.
									include $trophy_path;
								}
								?>
									<div class="tb-champion-info">
										<span class="tb-winner-label">WINNER!</span>
										<span class="tb-champion-name"><?php echo esc_html( $champion['name'] ); ?></span>
									</div>
								</div>
							</div>
						</div>
						<?php endif; ?>

					</div>

					<?php if ( $show_sw ) : ?>
					<div class="theme-switcher">
						<h2><?php esc_html_e( 'Select a theme', 'tournament-bracket' ); ?></h2>
						<button type="button" class="tb-theme-btn" data-theme="none"><?php esc_html_e( 'None', 'tournament-bracket' ); ?></button>
						<button type="button" class="tb-theme-btn" data-theme="light"><?php esc_html_e( 'Light', 'tournament-bracket' ); ?></button>
						<button type="button" class="tb-theme-btn" data-theme="dark"><?php esc_html_e( 'Dark', 'tournament-bracket' ); ?></button>
						<button type="button" class="tb-theme-btn" data-theme="dark-trendy"><?php esc_html_e( 'Dark Trendy', 'tournament-bracket' ); ?></button>
					</div>
					<?php endif; ?>
				</div>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}
}
