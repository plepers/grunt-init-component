'use strict';

require.config({
  baseUrl : '/',
  paths: {
    underscore:     'libs/scripts/underscore/underscore',
    jquery:         'libs/scripts/jquery/jquery',
    json2:          'libs/scripts/json3/json3',
    backbone:       'libs/scripts/backbone/backbone',
    {% if (templateLanguage === 'handlebars') { %}
    handlebars:     'libs/scripts/handlebars/handlebars.runtime',
    {% } else if (templateLanguage === 'jade') { %}
    jade:           'libs/scripts/jade/runtime',{% } %}
    chaplin:        'libs/scripts/chaplin/chaplin',
    core:           'libs/scripts/core/core'
  },
  shim: {
    {% if (templateLanguage === 'handlebars') { %}
    handlebars: {
      exports: 'Handlebars'
    },{% } %}
    'backbone': {
        //These script dependencies should be loaded before loading
        //backbone.js
        deps: ['underscore', 'jquery'],
        //Once loaded, use the global 'Backbone' as the
        //module value.
        exports: 'Backbone'
    },
    'underscore': {
        exports: '_'
    }
  }
});