'use strict';

require.config({
  baseUrl : '/libs',
  paths: {
    underscore:     'underscore/underscore',
    jquery:         'jquery/jquery',
    backbone:       'backbone/backbone', {% if (templateLanguage === 'handlebars') { %}
    handlebars:     'handlebars/handlebars.runtime', {% } else if (templateLanguage === 'jade') { %}
    jade:           'jade/runtime',{% } %}
    chaplin:        'chaplin/chaplin',
    core:           'core/core'
  },
  shim: {
    {% if (templateLanguage === 'handlebars') { %}
    handlebars: {
      exports: 'Handlebars'
    },{% } %}
    'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
    },
    'underscore': {
        exports: '_'
    }
  }
});