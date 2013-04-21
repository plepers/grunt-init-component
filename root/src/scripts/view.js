'use strict';

var Chaplin, HeroUnitView, Template,
__hasProp = {}.hasOwnProperty,
__extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Chaplin = require('chaplin');

Template = require('./templates/default');

module.exports = {%= name %}View = (function(_super) {

__extends(HeroUnitView, _super);

function HeroUnitView() {
  return HeroUnitView.__super__.constructor.apply(this, arguments);
}

HeroUnitView.prototype.className = "hero-unit";

HeroUnitView.prototype.tagName = 'div';

HeroUnitView.prototype.getTemplateFunction = function() {
  return Template;
};

HeroUnitView.prototype.getTemplateData = function() {
  return this.model;
};

return HeroUnitView;

})(Chaplin.View);