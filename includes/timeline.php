<?php
function timeline_function($atts){
   extract(shortcode_atts(array(
      "id" => '',
      "orientation" => 'vertical',
   ), $atts));

   ob_start();

   if ( have_rows( 'dates', $id ) ) : ?>
<section class="pd-timeline pd-timeline--<?php echo esc_attr( $orientation ); ?>">
    <div class="pd-timeline__container">

	<?php while ( have_rows( 'dates', $id ) ) : the_row(); ?>
	<div class="pd-timeline__block">
		<div class="pd-timeline__img" style="background-color: <?php echo get_sub_field( 'icon_background_color' ); ?>;">
			<?php $icon = get_sub_field( 'icon' ); ?>
		   <?php if ( $icon ) : ?>
			   <img src="<?php echo esc_url( $icon['url'] ); ?>" alt="<?php echo esc_attr( $icon['alt'] ); ?>" />
		   <?php endif; ?>
        </div> <!-- pd-timeline__img -->
		 <div class="pd-timeline__content">
          <?php echo get_sub_field( 'content' ); ?>
          <div class="flex justify-between items-center">
            <span class="pd-timeline__date"><?php echo get_sub_field( 'date' ); ?></span>
          </div>
        </div> <!-- pd-timeline__content -->
      </div> <!-- pd-timeline__block -->
	<?php endwhile; ?>

    </div>
</section>

<?php endif;

   return ob_get_clean();
}

function timeline_shortcode(){
   add_shortcode('timeline', 'timeline_function');
}
add_action( 'init', 'timeline_shortcode');
?>