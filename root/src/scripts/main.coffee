'use strict'

Chaplin = require 'chaplin'
View = require './view'

module.exports = class {%= name %}Controller extends Chaplin.Controller

  show: (model, params) ->
    # Instantiate the view; pass in autoRender so the view is
    # immediately rendered.
    @view = new View
      model : model
      autoRender: yes
