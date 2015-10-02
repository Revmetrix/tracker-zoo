
$(function () {
    'use strict';

    var util = {
        store: function (namespace, data) {
                    if (arguments.length > 1) {
                        return localStorage.setItem(namespace, JSON.stringify(data));
                    } else {
                        var store = localStorage.getItem(namespace);
                        return (store && JSON.parse(store)) || [];
                    }
                }
    };

    var App = {
        init: function () {
          this.cart = util.store('tracker-zoo-cart');
          this.cacheElements();
          this.bindElements();
        },
        cacheElements: function () {
          this.$login = $('#login');
          this.$quickView = $('.rev-quick-view');
          this.$detailedView = $('.rev-view-details');
          this.$addToCart = $('.rev-add-to-cart');
          this.$checkout = $('#checkout-main');
        },
        bindElements: function () {
          this.$login.on('click', this.login.bind(this));
          this.$quickView.on('click', this.quickView.bind(this));
        },
        login: function (e) {
          console.log(e);
        }
        quickView: function (e) {
          var pageTitle = e.target.dataset.productName;
          this.ga_track_pageview(productName);
          this.segmentio_track_pageview(productName);
        },
        ga_track_pageview: function (title) {
            ga('set', 'title', title);
            ga('send', 'pageview');
        },
        ga_track_add_item: function (itemId, itemName) {
            ga('ecommerce:addItem', {
                'id': itemId,
                'name': itemName
            });
        },
        segmentio_track_pageview: function (title) {
            analytics.page({
                'name': title
            });
        }
        segmentio_track_add_item: function (itemId, itemName) {
            analytics.track('Added Product', {
                id: itemId,
                name: itemName
            });
        }
    };

    App.init();

    // $('.rev-quick-view').click(function (event) {
    //     var productName = event.target.dataset.productName;
    //     // GA
    //     ga_track_pageview(productName);

    //     // Segment
    //     segmentio_track_pageview(productName);
    // });

    $('.rev-view-details').click(function (event) {
        var productName = event.target.dataset.productName;
        ga_track_pageview(productName);
        segmentio_track_pageview(productName);
    });

    $('.rev-add-to-cart').click(function (event) {
        var itemId = event.target.dataset.productId,
            itemName = event.target.dataset.productName;

        // GA
        ga_track_pageview(productName);
        ga_track_add_item(itemId, productName);

        // Segment
        segmentio_track_add_item(itemId, productName);
    });

    $('#login').click(function () {
        var identifier = $('input[name="identifier"]').val();
        // GA
        ga('set', 'userId', identifier);
        // Segment
        analytics.identify(identifier, {'name': identifier});
    });
});
