'use strict';

var Chaplin, HeroUnitController, View,
__hasProp = {}.hasOwnProperty,
__extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Chaplin = require('chaplin');

View = require('./view');

module.exports = {%= name %}Controller = (function(_super) {

__extends(HeroUnitController, _super);

function HeroUnitController() {
  return HeroUnitController.__super__.constructor.apply(this, arguments);
}

HeroUnitController.prototype.show = function(model, params) {
  return this.view = new View({
    model: model,
    autoRender: true
  });
};

return HeroUnitController;

})(Chaplin.Controller);