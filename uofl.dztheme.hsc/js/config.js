String.prototype.endsWith = function (suffix) {
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

(function ($) {
	"use strict";

	// patch to fix broken image alt tags
	var text = tinyMCE;
	$(function () {
		var text = tinyMCE;
		if (document.forms['edit_form'] && document.forms['edit_form'].elements['text']) {
			$(document.forms['edit_form']).on('submit', function (e) {
				this.elements['text'].value = this.elements['text'].value.replace(/"http[^"]*\/(?=resolveuid\/)/g, '"').replace(/alt=""/g, '');
			});
		}
	});

	var base = $('base').attr('href');
	var $body = $(document.body);
	var $documentationPortlet = $('.portlet-static-documentation .portletItem');
	var heromanagerPath  = '/++contextportlets++uofl.heromanager/';
	var leftPortletsPath = '/++contextportlets++plone.leftcolumn/';

	var shift = 0;
	var SITE   = 1 << shift++;
	var FOLDER = 1 << shift++;
	var PAGE   = 1 << shift++;
	var TYPE = 0;
	if ($body.hasClass('portaltype-plone-site')) {
		TYPE |= SITE | FOLDER;
	}
	else if ($body.hasClass('portaltype-folder')) {
		TYPE |= FOLDER;
	}
	else if ($body.hasClass('portaltype-document')) {
		TYPE |= PAGE;
	}



	var isConfigPortlet = false;
	var isNewConfig = false,
		isNewBioPicture = false;
	if ((base.endsWith(heromanagerPath + 'config') || (isNewConfig = (base.endsWith(heromanagerPath + '+') && location.search.indexOf('newConfig') !== -1))) && location.search.indexOf('tinymce.suppress=form.text') === -1) {
		//TinyMCEConfig = function () { this.init = $.noop };
		tinyMCE = function () { this._init = $.noop; };
		$('head').append('<link rel="stylesheet" href="++theme++uofl.dztheme.hsc/css/config.css" type="text/css" />');
		$(makeConfigForm);
	}
	else if ((base.endsWith(leftPortletsPath + 'bio-picture')) || (isNewBioPicture = (location.search == '?newBioPicture'))) {
		$(makeBioPictureForm);
	}
	else if ((base.endsWith(leftPortletsPath + 'bio-contact')) || (isNewBioPicture = (location.search == '?newBioContact'))) {
		$(makeBioContactForm);
	}
	else if ((base.endsWith(leftPortletsPath + 'bio-ulp'))     || (isNewBioPicture = (location.search == '?newBioULP'))) {
		$(makeBioULPForm);
	}
	else if ($documentationPortlet.length) {
		addConfigLinks();
	}

	function makeConfigForm() {
		var $content = $('#content');
		var $heading = $content.find('.documentFirstHeading');
		$content.find('.documentDescription').hide();

		var configs = {};
		if (TYPE & PAGE) {
			$heading.text('Configure Page');
			$.extend(configs, {
				'page-template': {
					label: 'Template',
					value: '',
					options: {
						'none'                          : 'None',
						'left-nav-homepage'             : 'Landing Page with Left Navigation',
						'top-nav-homepage'              : 'Landing Page with Top Navigation',
						'right-content-top-nav-homepage': 'Landing Page with Top Navigation and Right Portlet',
						'bio-page'                      : 'Bio Page',
						'tabbed-page'                   : 'Tabbed Page'
					}
				},
				'tabbed-page-initial-tab-name' : {
					label: 'Tabbed Page\'s first tab name',
					help : 'Only for when the template it set to Tabbed Page; sets the label for the first tab',
					value: '',
					placeholder: 'Overview'
				},
				'show-alert' : {
					label: 'Show Emergency/Weather alerts',
					help : 'Only works on the homepage',
					value: '',
					options: {
						top: 'Show'
					},
					type: 'checkbox'
				}
			});
		}
		else if (TYPE & FOLDER) {
			if (TYPE & SITE) {
				$heading.text('Configure Site');
				$.extend(configs, {
					'site-template': {
						label: 'Site Template',
						value: '',
						options: {
							''       : 'None',
							hsc      : 'HSC',
							medicine : 'Medicine',
							dentistry: 'Dentistry',
							nursing  : 'Nursing'
						}
					}
				});
			}
			else {
				$heading.text('Configure Folder');
			}

			$.extend(configs, {
				'department-title': {
					label: 'Department Title',
					help : 'adds a title above the breadcrumb on all pages except the Home Page and Landing Pages',
					value: ''
				},
				'navigation-location': {
					label: 'Top Navigation',
					help : 'show main navigation on the top of every page',
					value: '',
					options: {
						top: 'Show'
					},
					type: 'checkbox'
				},
				'main-logo' : {
					label: 'Main Logo',
					help : 'HTML to create the main logo; do not break brand standards',
					value: '',
					type : 'textarea'
				},
				'main-logo-url' : {
					label: 'Main Logo Link',
					help : 'Where the main logo links to',
					value: ''
				}
			});
		}


		var $configs = !isNewConfig ? $('.portlet-static-config:eq(0) i[class], .portlet-bootstraprow-config:eq(0) i[class]') : $();
		var $allConfigs = $('.portlet-static-config i[class], .portlet-bootstraprow-config i[class]');
		var $configForm = $('<form name="config">');
		var $form = $('#zc\\.page\\.browser_form');
		$form.find('legend, .field').hide();

		document.getElementById('form.header').value = 'config';

		for (var config in configs) {
			var $config = $configs.filter('.' + config);
			if ($config.length) {
				configs[config].value = $.trim($config.html());
			}

			if (!configs[config].placeholder && (TYPE & FOLDER)) {
				var $nextConfig = $allConfigs.filter('.' + config);
				//if ($config.length) {
					configs[config].placeholder = $.trim($nextConfig.not($config[0]).first().html() || 'none' );
				//}
				//else {
				//	configs[config].placeholder = $.trim($nextConfig.first().html() || 'none' );
				//}
			}
			$configForm.append('<h3>' + configs[config].label + '</h3>');
			var $wrapper = $('<div>').addClass(config);
			if (configs[config].help) {
				$wrapper.append('<span class="help-block">' + configs[config].help + '</span>');
			}
			switch (config) {
				case 'page-template':
					var $row = $('<div class="row-fluid">');
					for (var template in configs[config].options) {
						$row.append(
							$('<label class="span2">').append(
								$('<input type="radio" name="page-template">').prop('checked', template == configs['page-template'].value).val(template),
								'<img src="++theme++uofl.dztheme.hsc/img/config/' + template + '.jpg" />',
								document.createTextNode(configs[config].options[template])
							)
						)
					}
					var isFrontPage, frontPageGet;
					// add special homepage option
					$wrapper.append($row).append(
						$('<label>').append(
							$('<input type="radio" name="page-template" value="homepage">').prop('checked', 'homepage' == configs['page-template'].value).on('click', function () {
								if (typeof isFrontPage === 'undefined') {
									// see if this is a root page
									var here = $('#portal-globalnav > li.selected > a:last-child').attr('href') || false;
									if (here) {
										// only get once
										if (typeof frontPageGet === 'undefined') {
											var home = $('#portal-globalnav > li:first-child > a').attr('href');
											var $this = $(this);
											frontPageGet = $.get(home + '/getDefaultPage').done(function (defaultPage) {
												isFrontPage = defaultPage === here.substring(home.length + 1);
												$this.trigger('click');
											}).fail(function () {
												// if the get doesn't work, don't show the confirm
												isFrontPage = true;
												$this.trigger('click');
											});
										}
										// for now do nothing, after the get a click will be fired
										return false;
									}
									else {
										isFrontPage = false;
									}
								}
								return isFrontPage || confirm('This page is not the front page of the site. Are you sure you want the homepage template?');
							}),
							document.createTextNode('Homepage')
						)
					);
					break;
				default:
					if (configs[config].options) {
						if (configs[config].type && configs[config].type == 'checkbox') {
							for (var value in configs[config].options) break;
							$wrapper.append(
								$('<label class="checkbox">').append(
									$('<input type="checkbox">').attr({ name: config }).val(value).prop('checked', value == configs[config].value),
									document.createTextNode(configs[config].options[value])
								)
							);
						}
						else {
							$wrapper.append(
								$('<select>', { name: config }).append(
									$.map(configs[config].options, function (text, value) {
										var option = new Option(text, value);
										if (value == configs[config].value) {
											option.selected = 'selected';
										}
										return option;
									})
								)
							);
						}
					}
					else {
						var $element = configs[config].type && (configs[config].type == 'textarea') ? $('<textarea>') : $('<input type="text">');
						$wrapper.append($element.attr({ name: config, placeholder: configs[config].placeholder }).val(configs[config].value));
					}
			}

			$configForm.append($wrapper);
		}
		$configForm.append($('.suppressVisualEditor').removeAttr('style'));

		$configForm.find('textarea, input[type=text], input[type=radio], select').on('change', function () {
			configs[this.name].value = this.value;
		});
		$configForm.find('input[type=checkbox]').on('change', function () {
			configs[this.name].value = this.checked ? this.value : '';
		});
		
		$form.on('submit', function (e) {
			var value = '';
			for (var config in configs) {
				if ($.trim(configs[config].value)) {
					value += '<i class="' + config + '">' + configs[config].value + '</i>\n';
				}
			}
			$form[0].elements['form.text'].value = value || '&nbsp;';
		});
		
		$('#content-core').before($configForm);
	}

	function makeBioPictureForm() {
		$('#form\\.header').val('bio picture');
	}

	function makeBioContactForm() {
		$('#form\\.header').val('bio contact');
	}

	function makeBioULPForm() {
		$('#form\\.header').val('bio ulp');
	}

	function addConfigLinks() {
		// TODO: a better interface for links
		var editSuffix =  '/edit?referer=' + escape(base) ;
		var folderBaseEnd = TYPE & FOLDER ? base.length - 1 : base.lastIndexOf('/', base.length - 2);
		var folderBase = base.substring(0, folderBaseEnd);
		var folderConfigPath = folderBase + heromanagerPath + 'config';

		var $folderConfigLink = $('<a>', { href: folderConfigPath + editSuffix, text: 'Configure Folder' });
		$folderConfigLink.on('click', function () {
			$folderConfigLink.text('checking for existing configuration');
			$.ajax(folderConfigPath, { type: 'HEAD' }).done(hasConfig($folderConfigLink)).fail(noConfig(folderBase));
			return false;
		});
		$documentationPortlet.append($folderConfigLink, ' ');

		// page options
		if (TYPE & PAGE && !$body.hasClass('template-atct_edit')) {
			var pageConfigPath = base + heromanagerPath + 'config';
			var $pageConfigLink = $('<a>', { href: pageConfigPath + editSuffix, text: 'Configure Page' });
			$pageConfigLink.on('click', function (e) {
				$pageConfigLink.text('checking for existing configuration');
				$.ajax(pageConfigPath, { type: 'HEAD' }).done(hasConfig($pageConfigLink)).fail(noConfig(base));
				return false;
			});
			$documentationPortlet.append($pageConfigLink, ' ');
		}

		// link to hero images if on a homepage/landingpage
		if ($('#hero-rows .portlet-static-config, #hero-rows .portlet-bootstraprow-config').eq(0).find('i.page-template').text().indexOf('homepage') !== -1) {
			var $bannersLink = $('<a>', { href: 'images/banners', text: 'Manage Banners' });
			$bannersLink.on('click', function () {
				checkFolder('images').done(function () {
					// publish failing isn't critical, so always move on
					publish('images');
					checkFolder('images/banners').done(function () {
						$bannersLink.text('going to banners folder');
						location = 'images/banners/content_status_modify?workflow_action=publish_externally';
					});
				});
				return false;
			});
			$documentationPortlet.append($bannersLink, ' ');
		}

		// make links for bio pages
		if ($('#hero-rows .portlet-static-config, #hero-rows .portlet-bootstraprow-config').eq(0).find('i.page-template').text().indexOf('bio-page') !== -1) {
			bioLink('Bio Picture');
			bioLink('Bio Contact');
			bioLink('Bio ULP');
		}

		function bioLink(name) {
				var portletPath = base + leftPortletsPath + name.toLowerCase().replace(/\W+/g, '-') + '/';
				var $link = $('<a>', { href: portletPath + 'edit?referer=' + base, text: 'Edit ' + name});
				$link.on('click', function (e) {
					$link.text('checking for existing portlet');
					$.ajax(portletPath, { type: 'HEAD' }).done(hasConfig($link)).fail(function () {
						$('<form>', { method: 'post', action: base + '?new' + name.replace(/\s+/g, '') }).append(
							$('<input>', { type: 'hidden', name: 'referer', value: base}),
							$('<input>', { type: 'hidden', name: ':action', value: leftPortletsPath + '+/plone.portlet.static.Static'})
						).appendTo($body).submit();
					});
					return false;
				});
				$documentationPortlet.append($link, ' ');
		}

		/**
		 * checks if a folder exists, if not creates it
		 */
		function checkFolder(id) {
			var deffered = $.Deferred();
			$bannersLink.text('checking for ' + id + ' folder');
			exists(id).done(deffered.resolve).fail(function () {
				$bannersLink.text('creating '+ id + ' folder');
				createFolder(id).done(deffered.resolve).fail(function () {
					$bannersLink.text('could not create '+ id + ' folder');
					deffered.reject.apply(this, arguments);
				});
			});
			return deffered;
		}

		function exists(id) {
			return $.ajax(id, { type: 'HEAD' });
		}

		function publish(id) {
			return $.get(id + '/content_status_modify?workflow_action=publish_externally');
		}

		function createFolder(id) {
			var deffered =  $.Deferred();
			var ids = id.split('/');
			id = ids.pop();
			ids.push('createObject?type_name=Folder');
			$.get(ids.join('/')).done(function (html) {
				var match = html.match(/<form name="edit_form"[^>]+action="([^"]+)"/);
				if (match) {
					// I tested that using get instead of post works. what about head?
					// TODO: add exclude from nav
					$.post(match[1], { title: id, 'form.submitted': '1' }).done(deffered.resolve).fail(deffered.reject);
				}
				else {
					deffered.reject();
				}
			}).fail(deffered.reject);
			return deffered;
		}
		
		function hasConfig($link) {
			return function () {
				$link.text('going to config');
				location = $link.attr('href');
			}
		}

		function noConfig(path) {
			return function () {
				$('<form>', { method: 'post', action: path + '?newConfig' }).append(
					$('<input>', { type: 'hidden', name: 'referer', value: base}),
					$('<input>', { type: 'hidden', name: ':action', value: heromanagerPath + '+/uofl.BootstrapRowPortlet'})
				).appendTo($body).submit();
			}
		}
	}

	function postAndGo(url, data) {
		$('<form>', { method: 'post', action: url }).append($.map(data, function (name, value) {
			return $('<input>', { type: 'hidden', name: name, value: value });
		})).appendTo($body).submit();
	}
} (jqbs));
