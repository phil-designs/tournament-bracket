/* Tournament Bracket — frontend theme switcher */
(function ($) {
	'use strict';

	$(document).on('click', '.tb-theme-btn', function () {
		var $container = $(this).closest('.tb-container');
		var $theme     = $container.find('.theme');
		var newTheme   = $(this).data('theme');

		$theme.removeClass('theme-light theme-dark theme-dark-trendy');

		if (newTheme && newTheme !== 'none') {
			$theme.addClass('theme-' + newTheme);
		}
	});

}(jQuery));
