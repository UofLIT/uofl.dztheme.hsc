// currently (April 8, 2015) FB Page embeds do not have variable/responsive width
// the width is hard coded inside the frame so it cannot be modified
// for now the best thing to do is set the width to whatever the size of the container is at load
// resizing the page will of course break this
// the FB Page embed would have to be entirely reloaded on resize
var fbPages = document.getElementsByClassName('fb-page');
for (var i = 0; i < fbPages.length; i++) {
	if (fbPages[i].getAttribute('data-width') == 'auto') {
		fbPages[i].setAttribute('data-width', fbPages[i].parentNode.scrollWidth);
	}
}

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

	/*
	 * automatically build the hero slider from the images/banners folder or use the existing HTML
	 */
	if ($heroWrapper = $('.med-hero-wrapper')) {
		if ($heroWrapper.is(':empty')) {
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
	}

	/*
	 * look for images with caption class and display the title (or alt as backup) as the caption
	 * if the image is scaled down, give option to click for full size
	 */
	$('img.caption[title][title!=""], img.caption[alt][alt!=""]').each(function () {
		var $this = $(this);
		var captionText = $.trim($this.attr('title')) || $.trim($this.attr('alt'));
		if (!captionText) return;
		var $figure = $('<figure>').addClass($this.attr('class'));
		$this.removeAttr('class');
		var $figcaption = $('<figcaption>').text(captionText);
		
		$figure.insertBefore($this).append($this).append($figcaption);
		var match, $modal;
		if (match = $this.attr('src').match(/(.*)\/(image_\w+|@@images\/.*)\/?$/)) {
			$this.addClass('click').on('click', function () {
				if (!$modal) {
					$modal = $('<div class="modal hide fade">').append(
						$('<div class="modal-header">').append(
							'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
							$('<h3>').text(captionText)
						),
						$('<div class="modal-body">').append(
							$('<img/>').attr('src', match[1])
						)
					).insertAfter($figure);
				}
				$modal.modal();
			});
		}
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
