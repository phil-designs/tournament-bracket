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
		$match.append($label);

		['top', 'bottom'].forEach(function (side, sideIndex) {
			var team      = (match[side] && typeof match[side] === 'object') ? match[side] : {};
			var sideLabel = side === 'top' ? 'Team A' : 'Team B';
			var radioName = 'tb_winner_' + rIndex + '_' + mIndex;

			if (sideIndex === 1) {
				$match.append($('<div>', { 'class': 'tb-divider' }));
			}

			var $row = $('<div>', { 'class': 'tb-team-row' });

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
					val: team.seed || ''
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
					val: team.name || ''
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
					val: team.score || ''
				})
			);

			var $radio = $('<input>', {
				type: 'radio',
				name: radioName,
				'class': 'tb-winner-radio',
				'data-round': rIndex,
				'data-match': mIndex,
				'data-side': side
			});
			if (team.winner) $radio.prop('checked', true);

			$row.append(
				$('<label>', { 'class': 'tb-winner-label' })
					.append($radio)
					.append(' Winner')
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
		if (!rounds[rIndex][mIndex][side]) rounds[rIndex][mIndex][side] = {};
		return rounds[rIndex][mIndex][side];
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

		// Update a text field
		$(document).on('input change', '.tb-field', function () {
			var rIndex = parseInt($(this).data('round'), 10);
			var mIndex = parseInt($(this).data('match'), 10);
			var side   = $(this).data('side');
			var field  = $(this).data('field');
			ensurePath(rIndex, mIndex, side)[field] = $(this).val();
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
	});

}(jQuery));
