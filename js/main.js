window.tzApp = null;
$(function () {
  'use strict';

  var util = {
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
    }
  };

  var App = {
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

    init: function () {
      this.cart = [];
      this.userId = null;
      this.sessionId = util.uuid();
      this.cacheElements();
      this.bindElements();
      this.render();
    },
    cacheElements: function () {
      this.$login = $('#login');
      this.$quickView = $('.tz-quick-view');
      this.$detailedView = $('.tz-view-details');
      this.$addToCart = $('.tz-add-to-cart');
      this.$checkout = $('#checkout-main');
      this.$home = $('.tz-home');
    },
    bindElements: function () {
      this.$login.on('click', this.login.bind(this));
      this.$quickView.on('click', this.quickView.bind(this));
      this.$detailedView.on('click', this.detailView.bind(this));
      this.$addToCart.on('click', this.addToCart.bind(this));
      this.$checkout.on('click', this.checkout.bind(this));
      this.$home.on('click', this.home.bind(this));
    },
    render: function () {
      util.store('tracker-zoo-cart', this.cart);
      util.store('tracker-zoo-user-id', this.userId);
    },
    login: function (e) {
      var identifier = $('input[name="identifier"]').val();
      if (!_.isEmpty(identifier)) {
        this.userId = identifier;
      }
      if (!_.isEmpty(this.userId)) {
        ga('set', 'userId', identifier);
      }
      analytics.identify(identifier, {
        userId: this.userId,
        anonymousId: this.sessionId,
        traits: {
          name: this.userId,
        }
      });
      this.render();
    },
    quickView: function (e) {
      var productId = e.target.dataset.productId;
      var pageTitle = this.PRODUCTS[productId].name;
      this.ga_track_pageview(pageTitle);
      this.segmentio_track_pageview(pageTitle);
      this.render();
    },
    detailView: function (e) {
      var productId = e.target.dataset.productId;
      var pageTitle = this.PRODUCTS[productId].name;
      this.ga_track_pageview(pageTitle);
      this.segmentio_track_pageview(pageTitle);
      this.render();
    },
    addToCart: function (e) {
      var itemId = e.target.dataset.productId;
      var product = this.PRODUCTS[itemId];
      var itemName = product.name;
      this.cart.push(product);
      this.ga_track_pageview(itemName);
      this.ga_track_add_item(itemId, itemName);
      this.segmentio_track_pageview(itemName);
      this.segmentio_track_add_item(itemId, itemName);
      this.render();
    },
    checkout: function (e) {
      this.ga_track_checkout();
      this.segmentio_track_checkout();
      this.cart = [];
      this.render();
    },
    home: function () {
      this.ga_track_pageview('Home');
      this.segmentio_track_pageview('Home');
      this.render();
    },
    getCartTotal: function () {
      return _(this.cart).chain()
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
    ga_track_add_item: function (itemId, itemName) {
      ga('ecommerce:addItem', {
          'id': itemId,
          'name': itemName
      });
    },
    ga_track_checkout: function () {
      ga('ecommerce:send');
      ga('ecommerce:clear');
    },
    segmentio_track_pageview: function (title) {
      analytics.page(title, {
          'title': title,
          path: location.pathname + location.search + location.hash
      });
    },
    segmentio_track_add_item: function (itemId, itemName) {
      analytics.track('Added Product', {
          id: itemId,
          name: itemName
      });
    },
    segmentio_track_checkout: function () {
      analytics.track('Completed Order', {
        orderId: util.uuid(),
        total: this.getCartTotal(),
        products: this.cart
      });
    }
  };

  App.init();
  window.tzApp = App;
  tzApp.ga_track_pageview('*');
  tzApp.segmentio_track_pageview('*');
});
