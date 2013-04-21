
'use strict';

// Basic template description.
exports.description = 'Create a component for "weldon".';

// Template-specific notes to be displayed before question prompts.
exports.notes = '';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The initialize template.
exports.template = function(grunt, init, done) {
  var _ = grunt.util._;

  init.process({}, [
    // Prompt for the following values.
    // Built-In
    init.prompt('component name'),
    init.prompt('description'),
    init.prompt('repository'),
    init.prompt('homepage'),
    // Custom
    {
      name: 'language',
      message: 'Language',
      default: 'coffee',
      validator: /coffee|js/,
      warning: 'Must be either "coffee" for coffee-script or "js" ' +
        'for javascript'
    }, {
      name: 'templateLanguage',
      message: 'Micro-templating language',
      default: 'jade',
      validator: /handlebars|jade/,
      warning: 'Must be one of the following template languages: ' +
        'handlebars or jade'
    }, {
      name: 'preprocessor',
      message: 'Stylesheet preprocessor',
      default: 'less',
      validator: /sass|scss|less|stylus|none/,
      warning: 'Must be one of the following preprocessors: ' +
        'sass, scss, less, stylus, or none (to indicate no preprocessor).'
    }
  ], function(err, props) {
    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Normalize options.
    props.preprocessor = props.preprocessor ? props.preprocessor : 'none';

    // Remove files that aren't of the language requested.
    var lang = props.language === 'coffee' ? 'js' : 'coffee';
    files = _.omit(files, function(value, key) {
      if (/^src\/scripts\/vendor/.test(key)) return false;
      return _.endsWith(key, lang);
    });

    // Remove files that aren't of the template language requested.
    var templateLanguages = {
      haml: '.haml',
      handlebars: '.hbs',
      jade: '.jade',
    };

    delete templateLanguages[props.templateLanguage];
    files = _.omit(files, function(value, key) {
      return _.any(templateLanguages, function(lang) {
        return _.endsWith(key, lang);
      });
    });


    // Remove stylesheets that aren't part of the preprocessor requested.
    var preprocessors = {
      none: '.css',
      scss: '.scss',
      sass: '.sass',
      less: '.less',
      stylus: '.styl'
    };

    delete preprocessors[props.preprocessor];
    files = _.omit(files, function(value, key) {
      return _.any(preprocessors, function(lang) {
        return _.endsWith(key, lang);
      });
    });

    // Gather standard and additional dependencies.
    var devDependencies = {
      'grunt': '0.4.x',
      'grunt-contrib-clean': '0.4.0rc6',
      'grunt-contrib-copy': '0.4.0rc7',
      'grunt-contrib-connect': '0.1.1rc6',
      'grunt-contrib-watch': '0.2.0rc7',
      'grunt-requirejs': '0.3.x',
      'grunt-contrib-mincss': '0.4.0rc7',
      'grunt-contrib-htmlmin': '0.1.1rc7',
      'grunt-bower-task': '0.1.x',
      'grunt-urequire': 'git://github.com/aearly/grunt-urequire.git',
      'grunt-mocha': "0.2.x",
      // grunt-urequire requires lodash incorrectly,
      // see: https://github.com/aearly/grunt-urequire/pull/3
      'lodash': '0.10.x',
      'connect-url-rewrite': '0.1.x'
    };

    // Language libraries
    switch (props.language) {
    case 'js':
      devDependencies['grunt-contrib-jshint'] = '0.1.1rc6';
      break;

    case 'coffee':
      devDependencies['grunt-contrib-coffee'] = '0.4.0rc7';
      devDependencies['grunt-coffeelint'] =
        // NPM seems to be out-dated; master works with grunt 0.4.x
        'git://github.com/vojtajina/grunt-coffeelint.git';
      break;
    }

    // Micro-templating library
    switch (props.templateLanguage) {
    case 'jade':
      devDependencies['grunt-contrib-jade'] = '~0.5.0';

    case 'handlebars':
      // Waiting on a pull request to add modular AMD
      // See: https://github.com/gruntjs/grunt-contrib-handlebars/pull/24
      devDependencies['grunt-contrib-handlebars'] =
        'git://github.com/concordusapps/grunt-contrib-handlebars.git';
      break;
    }

    // Stylesheet preprocessor
    switch (props.preprocessor) {
    case 'sass':
    case 'scss':
      devDependencies['grunt-contrib-compass'] = '0.1.x';
      break;

    case 'stylus':
      devDependencies['grunt-contrib-stylus'] = '0.4.0rc7';
      break;

    case 'less':
      devDependencies['grunt-contrib-less'] = '0.5.x';
      break;
    }

    // Add properly-named license files.
    init.addLicenseFiles(files, props.licenses);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props);

    // Generate package.json file.
    init.writePackageJSON('package.json', _.extend(props, {
      keywords: [props.name],
      node_version: '0.8.x',
      devDependencies: devDependencies
    }));

    // Gather client-side, browser dependencies
    // Collect the standard ones.
    var dependencies = {
      'mocha': "1.9.x",
      'expect': "0.2.x",
      'jquery': '1.8.x',
      'underscore': '1.4.x',
      'backbone': '0.9.x',
      'requirejs': '2.1.x',
      'almond': '0.2.x',
      'chaplin': "https://github.com/plepers/chaplin.git",
      'core': "https://github.com/plepers/weldon_core.git"
    };
    switch (props.templateLanguage ) {
      // Handlebars requires a run-time library.
        case 'handlebars' :
            dependencies['handlebars'] = '1.0.x';
            break;

        case 'jade' :
            dependencies['jade'] = '~0.29.0';
            break;
    };

    // Gatrher the export overrides (these are consumed by grunt-bower-task
    // to replace the main declaration in the component.json).
    // Collect the standard ones
    var exportsOverride = {
      'mocha': {
          "scripts/..": "mocha.js",
          "styles/..": "mocha.css" },
      'expect': {'scripts': "expect.js" },
      'jquery': {'scripts': 'jquery.js' },
      'almond': {'scripts': 'almond.js' },
      'backbone': {'scripts': 'backbone.js'},
      'requirejs': {'scripts': 'require.js'},
      'underscore': {'scripts': 'underscore.js'},
      'chaplin': {'scripts': 'amd/chaplin.js'}
    };

    switch (props.templateLanguage ) {
      // Handlebars requires a run-time library.
        case 'handlebars' :
            exportsOverride['handlebars'] = {'scripts': 'handlebars.runtime.js'};
            break;

        case 'jade' :
            exportsOverride['jade'] = {'scripts': 'runtime.js'};
            break;
    }

    if (props.bootstrap) {
      // Include the bootstrap libraries.
      switch (props.preprocessor) {
      case 'sass':
      case 'scss':
        dependencies['bootstrap-sass'] = '2.2.x';
        exportsOverride['bootstrap-sass'] = {
          'scripts': 'js/**/*.js',
          'styles': 'lib/**/*.scss',
          'images': 'img/glyphicons-*.png',
        };
        break;

      case 'less':
        dependencies['bootstrap'] = '2.2.x';
        exportsOverride['bootstrap'] = {
          'styles': 'less/*.less',
          'scripts': 'js/*.js',
          'images': 'img/glyphicons-*.png'
        };
        break;

      case 'stylus':
      default:
        dependencies['bootstrap'] = '2.2.x';
        exportsOverride['bootstrap'] = {
          'styles': 'docs/assets/css/bootstrap*.css',
          'scripts': 'js/*.js',
          'images': 'img/glyphicons-*.png'
        };
      }
    }

    // Generate a component.json file.
    init.writePackageJSON('component.json', {
      name: props.name,
      version: props.version,
      dependencies: dependencies
    }, function(pkg, props) {
      pkg.exportsOverride = exportsOverride;
      return pkg;
    });

    // All done!
    done();
  });

};