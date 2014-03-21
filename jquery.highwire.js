var mediaCheck=function(a){var b,c,d,e,f,g=void 0!==window.matchMedia;if(g)c=function(a,b){a.matches?"function"==typeof b.entry&&b.entry():"function"==typeof b.exit&&b.exit(),"function"==typeof b.both&&b.both()},d=function(){b=window.matchMedia(a.media),b.addListener(function(){c(b,a)}),window.addEventListener("orientationchange",function(){b=window.matchMedia(a.media),c(b,a)},!1),c(b,a)},d();else{var h,j={};c=function(a,b){a.matches?"function"!=typeof b.entry||j[b.media]!==!1&&null!=j[b.media]||b.entry():"function"!=typeof b.exit||j[b.media]!==!0&&null!=j[b.media]||b.exit(),"function"==typeof b.both&&b.both(),j[b.media]=a.matches},e=function(a){var b;return b=document.createElement("div"),b.style.width="1em",document.body.appendChild(b),a*b.offsetWidth},f=function(a,b){var c;switch(b){case"em":c=e(a);break;default:c=a}return c};for(i in a)j[a.media]=null;var k=function(){var b=a.media.match(/\((.*)-.*:\s*([\d\.]*)(.*)\)/),d=b[1],e=f(parseInt(b[2],10),b[3]),g={},i=document.documentElement.clientWidth;h!=i&&(g.matches="max"===d&&e>i||"min"===d&&i>e,c(g,a),h=i)};window.addEventListener?window.addEventListener("resize",k):window.attachEvent&&window.attachEvent("onresize",k),k()}};
/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 *
 */

 /* global mediaCheck */

;(function ($, window, document, undefined) {
    'use strict';

    var pluginName = 'highwire',
        defaults = {
            visible : true
        };

    function Plugin(elements, options) {

        if(elements.length === 0){ // don't initilaise anything if the element set is empty
            return false;
        }

        this.elements = elements;

        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function () {
            this.events();
            this.balance(this.elements, this.options);
        },

        events: function () {
            var doit,
                _this = this;

            $(window).on('resize', function () {
                clearTimeout(doit);
                doit = setTimeout(function () {
                    _this.balance(_this.elements, _this.options);
                }, 100);
            });

            $(window).on('orientationchange', function () {
                this.balance(this.elements, this.options);
            });

            // this means the els have been hidden in a tab or otherwise and resizing heights has been disable
            // when they become visible again we need to recalculate the height of the containers

            $('body').on('click', function () {
                if (_this.options.visible === false) {
                    _this.balance(_this.elements, _this.options);
                    _this.options.visible = true;
                }
            });
        },

        balance: function (els, options) {

            var tallest = 0,
                height = 0,
                temp = [],
                resultsNew = [],
                modulus;

            if (!$(els).is(':visible')) { // if they are not visible don't try to set heights
                this.options.visible = false;
                return;
            }

            $(options.config).each(function (index, value) {
                if (mediaCheck !== undefined) {
                    mediaCheck({
                        media: value.mq,
                        entry: function () {
                            modulus = value.cols;
                        }
                    });
                }
            });

            if (modulus === 1) {
                $(els).each(function () {
                    $(this).css({'min-height': 0}); // reset height when we displaying a single column
                });
                return;
            }

            $(els).each(function (index, value) {

                temp.push(value);
                if (index % modulus === (modulus - 1)) {
                    resultsNew.push(temp);
                    temp = [];
                }

                if (index === (els.length - 1) && temp.length > 0) {
                    resultsNew.push(temp);
                }
            });

            $(resultsNew).each(function () {
                var $target = $(this);



                $target.each(function () {
                    var $this = $(this);
                    $this.css({'min-height': 0}); //reset heights before calculating natural height
                    height = $this.height();
                    if (height > tallest) {
                        tallest = height;
                    }
                });

                if (options.hasOwnProperty('callback') && typeof options.callback === 'function') {
                    options.callback();
                }

                $target.each(function () {
                    $(this).css({'min-height': tallest});
                });

                height = 0;
                tallest = 0;
            });
        }
    };

    $.fn[pluginName] = function (options) {
        if (!$.data(this, 'plugin_' + pluginName)) {
            $.data(this, 'plugin_' + pluginName,
            new Plugin(this, options));
        }
    };

})(jQuery, window, document);