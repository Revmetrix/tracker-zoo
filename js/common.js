window.tz = {};
window.tz.common = null;
$(function () {
  'use strict';

  var tzCommon = {
    PRODUCTS: {
      p1: {
        id: 'p1',
        name: 'Product 1',
        price: 10
      },
      p2: {
        id: 'p2',
        name: 'Product 2',
        price: 20
      },
      p3: {
        id: 'p3',
        name: 'Product 3',
        price: 30
      }
    },
    uuid: function () {
      /*jshint bitwise:false */
      var i, random;
      var uuid = '';

      for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
      }

      return uuid;
    },
    store: function (namespace, data) {
      if (arguments.length > 1) {
          return localStorage.setItem(namespace, JSON.stringify(data));
      } else {
          var store = localStorage.getItem(namespace);
          return (store && JSON.parse(store)) || [];
      }
    },
    getCartTotal: function (cart) {
      return _(cart).chain()
        .map(function (item) {
          return item.price
        }).reduce(function (sum, v) {
          return sum + v
        }, 0);
    },
    ga_track_pageview: function (title) {
      ga('set', 'title', title);
      ga('send', 'pageview', {
        'page': location.pathname + location.search  + location.hash
      });
    },
    ga_track_add_item: function (product) {
      ga('ecommerce:addItem', {
          'id': product.id,
          'name': product.name,
          'price': product.price,
          'quantity': 1
      });
    },
    ga_track_checkout: function (cart) {
      var self = this;
      ga('ecommerce:addTransaction', {
        id: self.uuid(),
        affiliation: 'Tracker Zoo',
        revenue: this.getCartTotal(cart)
      });
      _.each(cart, function (product) { self.ga_track_add_item(product); });
      ga('ecommerce:send');
      ga('ecommerce:clear');
    },
    segmentio_track_pageview: function (title) {
      analytics.page(title, {
          'title': title,
          path: location.pathname + location.search + location.hash
      });
    },
    segmentio_track_add_item: function (product) {
      analytics.track('Added Product', {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
      });
    },
    segmentio_track_checkout: function (cart) {
      analytics.track('Completed Order', {
        orderId: this.uuid(),
        total: this.getCartTotal(cart),
        products: this.cart
      });
    }
  };
  window.tz.common = tzCommon;
});
