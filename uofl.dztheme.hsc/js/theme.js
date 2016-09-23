jqbs(function($){
	$('.kwicks.hidden-phone').kwicks({
		behavior: 'menu',
		max: '40%',
		selectOnClick: false,
		spacing: 0,
	});
	$('.kwicks.visible-phone').kwicks({
		behavior: 'menu',
		isVertical: true,
		max: '40%',
		spacing: 0,
	});

	$('.med-hero-wrapper').carouFredSel({
		responsive: true,
		items: 1,
		scroll: {
			fx: 'crossfade',
			pauseOnHover: true
		},
		auto: {
			timeoutDuration: 10000
		},
		prev: '.med-hero .glyphicon-chevron-left',
		next: '.med-hero .glyphicon-chevron-right',
		pagination: {
			container: '.med-hero .button-nav ul',
			anchorBuilder: function(nr,item) {
				return '<li><a href="#' + nr + '"></a></li>';
			}
		},
		swipe: true
	});

	$(document).on('click', '.med-nav-toggle, .med-nav-pane-collapse a, .upperbar-accounts-collapse, .tab-pane-collapse a', function(e) {
		e.stopPropagation();
		var $this = $(this);
		var l = $this.next().length;
		var $current = l ? $this.next() : $this.parent().find('a');
		var id = l ? $current.attr('id') : $this.parent().next().attr('id');

		var parent = $this.data('parent');
		var actives = parent && $(parent).find('.collapse.in');

		// From bootstrap itself
		if (actives && actives.length) {
			hasData = actives.data('collapse');
			//if (hasData && hasData.transitioning) return;
			actives.collapse('hide');
			if (actives['length'] > 1) {
				var a = [ $(actives[0]).attr('id'), $(actives[1]).attr('id') ];
				var old = $.grep(a,function(b){
					return b == id;
				}, true);
				var $old = $('#' + old);
				if (l) {
					$old.parent().find('a').addClass('collapsed');
				} else {
					$old.prev().children('a').addClass('collapsed');
				}
			}
		}

		var target = $this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); //strip for ie7

		$(target).collapse('toggle');
	});

	/*$(document).on('click', '#lowerbar .span2 .btn-navbar, .med-nav-toggle[href="#nav-academics"]',function(){
		$('.med-nav-toggle, .med-nav-pane-collapse > a, .upperbar-accounts-collapse').each(function(){
			$(this).addClass('collapsed');
		});
	});*/

	$(document).on('click',function(e){
		var $navpane = $(e.target).closest('.nav-pane');
		if ($navpane.length == 0) {
			$('.nav-pane.collapse.in,.account-collapse.collapse.in').collapse('hide');
			$('.med-nav-toggle').addClass('collapsed');
		}
	});
});
