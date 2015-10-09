window.tzApp = null;
$(function () {
  'use strict';

  var App = {
    init: function () {
      this.cart = [];
      this.userId = null;
      this.sessionId = window.tz.common.uuid();
      this.cacheElements();
      this.bindElements();
      this.render();

      this.router = new Router({
        '/': this.home.bind(this),
        '/qv/:pid': this.quickView.bind(this),
        '/fv/:pid': this.detailView.bind(this),
        '/add/:pid': this.addToCart.bind(this),
        '/checkout': this.checkout.bind(this)
      });
      this.router.init('/');
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
    },
    render: function () {
      window.tz.common.store('tracker-zoo-ga-cart', this.cart);
      window.tz.common.store('tracker-zoo-ga-user-id', this.userId);
    },
    login: function (e) {
      var identifier = $('input[name="identifier"]').val();
      if (!_.isEmpty(identifier)) {
        this.userId = identifier;
      }
      if (!_.isEmpty(this.userId)) {
        ga('set', '&uid', identifier);
      }
      this.render();
    },
    quickView: function (productId) {
      var pageTitle = window.tz.common.PRODUCTS[productId].name;
      window.tz.common.ga_track_pageview(pageTitle);
      this.render();
    },
    detailView: function (productId) {
      var pageTitle = window.tz.common.PRODUCTS[productId].name;
      window.tz.common.ga_track_pageview(pageTitle);
      this.render();
    },
    addToCart: function (itemId) {
      var product = window.tz.common.PRODUCTS[itemId];
      var itemName = product.name;
      this.cart.push(product);
      window.tz.common.ga_track_pageview(itemName);
      this.render();
    },
    checkout: function () {
      window.tz.common.ga_track_checkout(this.cart);
      this.cart = [];
      this.render();
    },
    home: function () {
      window.tz.common.ga_track_pageview('Home');
      this.render();
    }
  };

  App.init();
  window.tzApp = App;
});
