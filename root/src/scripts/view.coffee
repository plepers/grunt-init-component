'use strict'

Chaplin = require 'chaplin'
Template = require './templates/default'

module.exports = class {%= name %}View extends Chaplin.View

  className: "hero-unit"
  tagName: 'div'


  getTemplateFunction: ->
    Template

  getTemplateData : ->
    @model

