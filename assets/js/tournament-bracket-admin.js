/* Tournament Bracket — admin rounds editor */
(function ($) {
	'use strict';

	var rounds = [];

	/* ── Init ──────────────────────────────────────────────────────────────── */

	function init() {
		var raw = $('#tb_rounds_data').val();
		try {
			rounds = JSON.parse(raw) || [];
		} catch (e) {
			rounds = [];
		}
		render();
	}

	/* ── Render all rounds ─────────────────────────────────────────────────── */

	function render() {
		var $editor = $('#tb-rounds-editor');
		$editor.empty();

		if (rounds.length === 0) {
			$editor.append('<p class="description">No rounds yet. Click "Add Round" to start building your bracket.</p>');
			serialize();
			return;
		}

		rounds.forEach(function (matches, rIndex) {
			var $round = $('<div>', { 'class': 'tb-round', 'data-round': rIndex });

			// Round header
			var $header = $('<div>', { 'class': 'tb-round-header' });
			$header.append('<h3>Round ' + (rIndex + 1) + '</h3>');
			$header.append(
				$('<button>', {
					type: 'button',
					'class': 'button tb-remove-round',
					'data-round': rIndex,
					text: 'Remove Round'
				})
			);
			$round.append($header);

			// Matches
			matches.forEach(function (match, mIndex) {
				$round.append(renderMatch(rIndex, mIndex, match));
			});

			// Add match button
			$round.append(
				$('<p>').append(
					$('<button>', {
						type: 'button',
						'class': 'button tb-add-match',
						'data-round': rIndex,
						text: '+ Add Match'
					})
				)
			);

			$editor.append($round);
		});

		serialize();
	}

	/* ── Render a single match ─────────────────────────────────────────────── */

	function renderMatch(rIndex, mIndex, match) {
		match = match || {};
		var $match = $('<div>', { 'class': 'tb-match', 'data-round': rIndex, 'data-match': mIndex });

		// Match label row
		var $label = $('<div>', { 'class': 'tb-match-label' });
		$label.append('Match ' + (mIndex + 1));
		$label.append(
			$('<button>', {
				type: 'button',
				'class': 'tb-remove-match',
				'data-round': rIndex,
				'data-match': mIndex,
				html: '&times;',
				title: 'Remove match'
			})
		);
		$label.append(
			$('<button>', {
				type: 'button',
				'class': 'button button-small tb-clear-winner',
				'data-round': rIndex,
				'data-match': mIndex,
				text: 'Clear winner'
			})
		);
		$match.append($label);

		// Match options row (header label + color accent)
		var $optRow = $('<div>', { 'class': 'tb-match-options' });

		$optRow.append($('<span>', { 'class': 'tb-opt-label', text: 'Label:' }));
		$optRow.append(
			$('<input>', {
				type: 'text',
				'class': 'tb-match-field regular-text',
				placeholder: 'Match label (optional)',
				'data-round': rIndex,
				'data-match': mIndex,
				'data-field': 'header',
				val: match.header || ''
			})
		);

		var hasColor = !!match.color;
		$optRow.append(
			$('<label>', { 'class': 'tb-opt-label tb-opt-color-label' })
				.append(
					$('<input>', {
						type: 'checkbox',
						'class': 'tb-color-toggle',
						'data-round': rIndex,
						'data-match': mIndex,
						checked: hasColor
					})
				)
				.append(' Color:')
		);

		var $colorPicker = $('<input>', {
			type: 'color',
			'class': 'tb-match-field tb-match-color',
			'data-round': rIndex,
			'data-match': mIndex,
			'data-field': 'color',
			val: match.color || '#3a86ff'
		});
		if (!hasColor) $colorPicker.prop('disabled', true);
		$optRow.append($colorPicker);

		$optRow.append(
			$('<label>', { 'class': 'tb-opt-label tb-opt-center-label' })
				.append(
					$('<input>', {
						type: 'checkbox',
						'class': 'tb-center-toggle',
						'data-round': rIndex,
						'data-match': mIndex,
						checked: !!match.centered
					})
				)
				.append(' Center')
		);

		$match.append($optRow);

		// Team rows
		['top', 'bottom'].forEach(function (side, sideIndex) {
			var team      = (match[side] && typeof match[side] === 'object' && !Array.isArray(match[side])) ? match[side] : {};
			var sideLabel = side === 'top' ? 'Team A' : 'Team B';
			var radioName = 'tb_winner_' + rIndex + '_' + mIndex;
			var isBye     = !!team.bye;

			if (sideIndex === 1) {
				$match.append($('<div>', { 'class': 'tb-divider' }));
			}

			var $row = $('<div>', { 'class': 'tb-team-row' + ( isBye ? ' is-bye' : '' ) });

			$row.append($('<span>', { 'class': 'tb-team-label', text: sideLabel }));

			$row.append(
				$('<input>', {
					type: 'text',
					'class': 'tb-field small-text',
					placeholder: 'Seed',
					'data-round': rIndex,
					'data-match': mIndex,
					'data-side': side,
					'data-field': 'seed',
					val: team.seed || '',
					disabled: isBye
				})
			);

			$row.append(
				$('<input>', {
					type: 'text',
					'class': 'tb-field regular-text',
					placeholder: 'Team name',
					'data-round': rIndex,
					'data-match': mIndex,
					'data-side': side,
					'data-field': 'name',
					val: team.name || '',
					disabled: isBye
				})
			);

			$row.append(
				$('<input>', {
					type: 'text',
					'class': 'tb-field small-text',
					placeholder: 'Score',
					'data-round': rIndex,
					'data-match': mIndex,
					'data-side': side,
					'data-field': 'score',
					val: team.score || '',
					disabled: isBye
				})
			);

			var $radio = $('<input>', {
				type: 'radio',
				name: radioName,
				'class': 'tb-winner-radio',
				'data-round': rIndex,
				'data-match': mIndex,
				'data-side': side,
				disabled: isBye
			});
			if (team.winner && !isBye) $radio.prop('checked', true);

			$row.append(
				$('<label>', { 'class': 'tb-winner-label' })
					.append($radio)
					.append(' Winner')
			);

			$row.append(
				$('<label>', { 'class': 'tb-bye-label' })
					.append(
						$('<input>', {
							type: 'checkbox',
							'class': 'tb-bye-toggle',
							'data-round': rIndex,
							'data-match': mIndex,
							'data-side': side,
							checked: isBye
						})
					)
					.append(' BYE')
			);

			$match.append($row);
		});

		return $match;
	}

	/* ── Serialize rounds → hidden input ───────────────────────────────────── */

	function serialize() {
		$('#tb_rounds_data').val(JSON.stringify(rounds));
	}

	/* ── Helper: ensure path exists ────────────────────────────────────────── */

	function ensurePath(rIndex, mIndex, side) {
		if (!rounds[rIndex])             rounds[rIndex] = [];
		if (!rounds[rIndex][mIndex])     rounds[rIndex][mIndex] = { top: {}, bottom: {} };
		if (!rounds[rIndex][mIndex][side] || Array.isArray(rounds[rIndex][mIndex][side])) rounds[rIndex][mIndex][side] = {};
		return rounds[rIndex][mIndex][side];
	}

	function ensureMatch(rIndex, mIndex) {
		if (!rounds[rIndex])         rounds[rIndex] = [];
		if (!rounds[rIndex][mIndex]) rounds[rIndex][mIndex] = { top: {}, bottom: {} };
		return rounds[rIndex][mIndex];
	}

	/* ── Event bindings ────────────────────────────────────────────────────── */

	$(document).ready(function () {
		if (!$('#tb_rounds_data').length) return;
		init();

		// Add round
		$('#tb-add-round').on('click', function () {
			rounds.push([{ top: {}, bottom: {} }]);
			render();
		});

		// Remove round
		$(document).on('click', '.tb-remove-round', function () {
			rounds.splice(parseInt($(this).data('round'), 10), 1);
			render();
		});

		// Add match to a round
		$(document).on('click', '.tb-add-match', function () {
			var rIndex = parseInt($(this).data('round'), 10);
			if (!rounds[rIndex]) rounds[rIndex] = [];
			rounds[rIndex].push({ top: {}, bottom: {} });
			render();
		});

		// Remove a match
		$(document).on('click', '.tb-remove-match', function () {
			var rIndex = parseInt($(this).data('round'), 10);
			var mIndex = parseInt($(this).data('match'), 10);
			rounds[rIndex].splice(mIndex, 1);
			render();
		});

		// Update a team text field (seed, name, score)
		$(document).on('input change', '.tb-field', function () {
			var rIndex = parseInt($(this).data('round'), 10);
			var mIndex = parseInt($(this).data('match'), 10);
			var side   = $(this).data('side');
			var field  = $(this).data('field');
			ensurePath(rIndex, mIndex, side)[field] = $(this).val();
			serialize();
		});

		// Update a match-level field (header, color)
		$(document).on('input change', '.tb-match-field', function () {
			var rIndex = parseInt($(this).data('round'), 10);
			var mIndex = parseInt($(this).data('match'), 10);
			var field  = $(this).data('field');
			ensureMatch(rIndex, mIndex)[field] = $(this).val();
			serialize();
		});

		// Toggle color accent on/off
		$(document).on('change', '.tb-color-toggle', function () {
			var rIndex  = parseInt($(this).data('round'), 10);
			var mIndex  = parseInt($(this).data('match'), 10);
			var $picker = $(this).closest('.tb-match-options').find('.tb-match-color');
			var match   = ensureMatch(rIndex, mIndex);
			if ($(this).is(':checked')) {
				$picker.prop('disabled', false);
				match.color = $picker.val();
			} else {
				$picker.prop('disabled', true);
				match.color = '';
			}
			serialize();
		});

		// Select winner
		$(document).on('change', '.tb-winner-radio', function () {
			var rIndex    = parseInt($(this).data('round'), 10);
			var mIndex    = parseInt($(this).data('match'), 10);
			var side      = $(this).data('side');
			var otherSide = side === 'top' ? 'bottom' : 'top';
			ensurePath(rIndex, mIndex, side).winner      = true;
			ensurePath(rIndex, mIndex, otherSide).winner = false;
			serialize();
		});

		// Clear winner
		$(document).on('click', '.tb-clear-winner', function () {
			var rIndex = parseInt($(this).data('round'), 10);
			var mIndex = parseInt($(this).data('match'), 10);
			var match  = rounds[rIndex] && rounds[rIndex][mIndex];
			if (match) {
				if (match.top)    match.top.winner    = false;
				if (match.bottom) match.bottom.winner = false;
			}
			$('input[name="tb_winner_' + rIndex + '_' + mIndex + '"]').prop('checked', false);
			serialize();
		});

<<<<<<< HEAD
		// Toggle "center in column" on a match
		$(document).on('change', '.tb-center-toggle', function () {
			var rIndex = parseInt($(this).data('round'), 10);
			var mIndex = parseInt($(this).data('match'), 10);
			ensureMatch(rIndex, mIndex).centered = $(this).is(':checked');
			serialize();
		});

=======
>>>>>>> 1abe4e4d5bb3199abc0bdc541747bcc5a06d15a1
		// Toggle BYE on a team slot
		$(document).on('change', '.tb-bye-toggle', function () {
			var rIndex    = parseInt($(this).data('round'), 10);
			var mIndex    = parseInt($(this).data('match'), 10);
			var side      = $(this).data('side');
			var otherSide = side === 'top' ? 'bottom' : 'top';
			var isBye     = $(this).is(':checked');
			var team      = ensurePath(rIndex, mIndex, side);
			var otherTeam = ensurePath(rIndex, mIndex, otherSide);

			team.bye = isBye;
			if (isBye) {
				team.winner      = false;
				otherTeam.winner = true;
			}
			serialize();
			render();
		});
	});

}(jQuery));
