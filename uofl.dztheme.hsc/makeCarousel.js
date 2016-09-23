!function ($) {
	"use strict";

	$('[id^="carousel-"]').each(function () {
		var $carousel = $(this).empty(),
		    id = $carousel.attr('id');

		$.ajax({
			type: 'POST',
			url: $carousel.attr('data-source') + '/tinymce-jsonimagefolderlisting',
			data: 'rooted=True&document_base_url=/',
			dataType: 'json'
		}).done(function (json) {
			var $indicators = $('<ol class="carousel-indicators"></ol>'),
			    $inner = $('<div class="carousel-inner">');

			$carousel
				.addClass('carousel slide')
				.before('<h2>' + json.path[0].title + '</h2>')
				.append(
					$indicators,
					$inner,
					'<a class="carousel-control left"  href="#' + id + '" data-slide="prev">&lsaquo;</a>',
					'<a class="carousel-control right" href="#' + id + '" data-slide="next">&rsaquo;</a>'
				);

			var images = $.grep(json.items, function (item) {
				return item.portal_type === 'Image';
			});
			$.each(images, function (i, image) {
				$indicators.append('<li data-target="#' + id + '" data-slide-to="' + i + '" class="' + (i ? '' : 'active') + '"></li>');
				$inner.append(
					$('<div class="item ' + (i ? '' : 'active') + '"></div>').append(
						'<img src="' + image.url + '/image_large" alt="' + image.title + '" title="' + image.title + '" style="width:100%;" />',
						'<div class="carousel-caption"><p>' + image.title + '</p></div>'
					)
				);
			});
		});
	});
}(jQuery);