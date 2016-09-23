!function ($) {

    "use strict";

    function accordionGroupTemplate(parentId, $heading){
        var tabSelector = $heading.attr('data-target'),
            active = $heading.parent().is('.active');

        if (!tabSelector) {
            tabSelector = $heading.attr('href');
            tabSelector = tabSelector && tabSelector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
        }

        var $tabContent = $(tabSelector),
            groupId = $tabContent.attr('id') + '-collapse';


        return '<div class="accordion-group">' +
            '   <div class="accordion-heading">' +
            '       <a class="accordion-toggle ' + (active ? '' : 'collapsed') + '" data-toggle="collapse" data-parent="#' + parentId + '" href="#' + groupId + '">' +
            '           ' + $heading.html() +
            '       </a>' +
            '   </div>' +
            '   <div id="' + groupId + '" class="accordion-body collapse ' + (active ? 'in' : '') + '">' +
            '       <div class="accordion-inner">' +
            '           ' + $tabContent.html() +
            '       </div>' +
            '   </div>' +
            '</div>';
    }

    function accordionTemplate(id, $headings, clazz){
        var accordionTemplate = '<div class="accordion ' + clazz + '" id="' + id +'">';
        $headings.each(function(){
            var $heading = $(this);
            accordionTemplate += accordionGroupTemplate(id, $heading);
        });
        accordionTemplate += '</div>';
        return accordionTemplate;
    }

    // a VERY unoptimized way of correctly allocating tab/accordion open states between states.
    function toggleActiveCollapse(tab, accordion){
        // purpose: pass along active/collapse states to ensure parity between the two
        // detect whether a tab or accordion header was clicked
        // toggle the counterpart's states
        var $tab = $('#' + tab),
            $accordion = $('#' + accordion),
            items = {};
        $tab.find('li [data-toggle="tab"]').click(function(){
            // toggle accordion values
            // gather new and old accordion values into object
            // iterate over object actions to take
            var id = $(this).attr('href');
            items = {
                active: {
                    accordionHeading: $accordion.find('.accordion-heading [data-toggle="collapse"]:not(.collapsed)'),
                    accordionBody: $accordion.find('.accordion-body.in')
                },
                next: {
                    accordionHeading: $accordion.find('.accordion-group .accordion-heading [href*="' + id + '"]'),
                    accordionBody: $accordion.find('.accordion-group ' + id + '-collapse')
                }
            };
            items.active.accordionHeading.toggleClass('collapsed');
            items.active.accordionBody.toggleClass('in');
            items.active.accordionBody.css('height','0px');
            items.next.accordionHeading.toggleClass('collapsed');
            items.next.accordionBody.toggleClass('in');
            items.next.accordionBody.css('height','auto');
        });

        $accordion.find('.accordion-group .accordion-heading [data-toggle="collapse"]').click(function(){
            // toggle tab values
            // gather new and old tab values into object
            // iterate over object actions to take
            var id = $(this).attr('href').replace('-collapse','');
            var $tabContent = $('.tab-content[id^="' + tab + '"]');
            items = {
                active: {
                    tab: $tab.find('.active'),
                    tabContent: $tabContent.find('.active')
                },
                next: {
                    tab: $tab.find('[href*="' + id + '"]').parents('li'),
                    tabContent: $tabContent.find(id)
                }
            };
            items.active.tab.toggleClass('active');
            items.active.tabContent.toggleClass('active in');
            items.next.tab.toggleClass('active');
            items.next.tabContent.toggleClass('active in');
        });
    }


    /* TAB-COLLAPSE PLUGIN DEFINITION
     * ===================== */

    $.fn.tabCollapse = function (options) {
        this.each(function () {
            var $this = $(this),
                $headings = $this.find('li:not(.dropdown) [data-toggle="tab"], li:not(.dropdown) [data-toggle="pill"]'),
                tabID = $this.attr('id'),
                accordionID = tabID + '-accordion';
            options = $.extend({}, $.fn.tabCollapse.defaults, options);
            var accordionHtml = accordionTemplate(accordionID, $headings, options.accordionClass);
            $this.after(accordionHtml);
            $this.addClass(options.tabsClass);
            $this.siblings('.tab-content').addClass(options.tabsClass);
            toggleActiveCollapse(tabID,accordionID);
        })
    };

    $.fn.tabCollapse.defaults = {
        accordionClass: 'visible-phone',
        tabsClass: 'hidden-phone'
    }

}(window.jQuery);