/* Tournament Bracket — frontend */
(function ($) {
	'use strict';

	/* ── Theme switcher ─────────────────────────────────────────────────────── */

	$(document).on('click', '.tb-theme-btn', function () {
		var $container = $(this).closest('.tb-container');
		var $theme     = $container.find('.theme');
		var newTheme   = $(this).data('theme');

		$theme.removeClass('theme-light theme-dark theme-dark-trendy');

		if (newTheme && newTheme !== 'none') {
			$theme.addClass('theme-' + newTheme);
		}
	});

	/* ── Centered BYE columns ───────────────────────────────────────────────── */

	function initCenterByeColumns() {
		$('.tb-col-center-bye').each(function () {
			var $col  = $(this);
			var $bye  = $col.find('.tb-match-center');
			var $main = $col.find('.match:not(.tb-match-center)');

			if ( !$bye.length ) return;

			// Hide the outgoing vertical connector bars on the preceding column —
			// they point toward a single expanded match, not two separate matches.
			$col.prev('.column').find('.match-lines .line.two').css('display', 'none');

			var colH = $col.height();

			// Column not yet laid out — defer and retry.
			if ( colH < 100 ) {
				setTimeout( initCenterByeColumns, 100 );
				return;
			}

			var byeOuterH = $bye.outerHeight( true ); // includes margins

			// Float the BYE match to the vertical center of the column.
			$bye.css({
				position: 'absolute',
				top:      Math.round( (colH - byeOuterH) / 2 ) + 'px',
				zIndex:   '2'
			});

			if ( !$main.length ) return;

			// Expand the real match to fill the column height.
			// Lock each team row to its natural 31 px so that
			// justify-content: space-between pushes Team A to the very
			// top and Team B to the very bottom.
			$main.css({
				height:         colH + 'px',
				justifyContent: 'space-between',
				marginTop:      '0',
				marginBottom:   '0'
			});
			$main.find( '.team' ).css({ height: '31px', flexShrink: '0' });

			// Draw a ] bracket connector on the right side of the match,
			// spanning from the centre of Team A to the centre of Team B.
			// Read the live connector colour from the existing line so it
			// automatically respects whichever theme is active.
			$main.find( '.tb-bracket-connector' ).remove();
			var lineColor = $main.find( '.match-lines .line' ).first().css( 'background-color' ) || '#36404e';
			$main.append(
				$( '<div>', { 'class': 'tb-bracket-connector' } ).css({
					position:     'absolute',
					top:          '14px',   // centre of 31 px top team
					right:        'auto',
					bottom:       '14px',   // centre of 31 px bottom team
					left:         '-12px',
					width:        '12px',
					borderTop:    '1px solid ' + lineColor,
					borderLeft:   '1px solid ' + lineColor,
					borderBottom: '1px solid ' + lineColor,
					boxSizing:    'border-box',
					pointerEvents:'none'
				})
			);
		});
	}

	function resetCenterByeColumns() {
		$('.tb-col-center-bye').each(function () {
			$(this).prev('.column').find('.match-lines .line.two').css('display', '');
		});
		$('.tb-col-center-bye .tb-match-center').css({ position: '', top: '', zIndex: '' });
		$('.tb-col-center-bye .match:not(.tb-match-center)').css({
			height: '', justifyContent: '', marginTop: '', marginBottom: ''
		});
		$('.tb-col-center-bye .match:not(.tb-match-center) .team').css({ height: '', flexShrink: '' });
		$('.tb-col-center-bye .tb-bracket-connector').remove();
	}

	// Double rAF inside document.ready ensures the browser has finished layout
	// before we measure column heights (window.load may have already fired by
	// the time this footer script executes).
	$(document).ready( function () {
		requestAnimationFrame( function () {
			requestAnimationFrame( initCenterByeColumns );
		} );
	} );

	// Also hook load for slower connections and resize for responsive layout.
	$(window).on( 'load', function () {
		resetCenterByeColumns();
		initCenterByeColumns();
	} );

	$(window).on( 'resize', function () {
		resetCenterByeColumns();
		initCenterByeColumns();
	} );

}(jQuery));
