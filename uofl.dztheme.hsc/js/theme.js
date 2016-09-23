jqbs(function($){
	// so we can link to the tabs on pages
	var tabMatch = null;
	if (tabMatch = location.hash.match(/^#tab(\d+)$/)) {
		var tab = tabMatch[1];
		$('a[href="#tab'          + tab + '"]').click();
		$('a[href="#collapse-tab' + tab + '"]').click();
	}
	
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

	var carouFredSelOptions = {
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
			anchorBuilder: function (nr,item) {
				return '<li><a href="#' + nr + '"></a></li>';
			}
		},
		swipe: true
	};

	$heroWrapper = $('.med-hero-wrapper');
	if($heroWrapper.is(':empty')) {
		$.ajax({
			type:     'POST',
			url:      '../images/banners/tinymce-jsonimagefolderlisting',
			data:     'rooted=True&document_base_url=/',
			dataType: 'json'
		}).done(function (json) {
			var images = $.grep(json.items, function (item) {
					return item.portal_type === 'Image';
			});
			$.each(images, function (i, image) {
				var $slide = $('<div class="slide slide-bg slide-minimal" style="background-image: url(' + image.url + ');"><h1><span>' + image.title + '</span></h1></div>');
				$.get(image.url + '/Description', function (result) {
					var lines = result.split('\n');
					if(lines[0]) $slide.append('<div class="description"><div class="container">' + marked(lines[0]) + '</div></div>');
					if(lines[1]) $slide.css({backgroundPosition: lines[1]});
				});
				$heroWrapper.append($slide);
			});
		
			$heroWrapper.carouFredSel(carouFredSelOptions);
		});
	}
	else {
		$heroWrapper.carouFredSel(carouFredSelOptions);
	}

	

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
