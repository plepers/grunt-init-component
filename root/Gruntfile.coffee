module.exports = (grunt) ->
  'use strict'

  # Underscore
  # ==========
  _ = grunt.util._

  # Package
  # =======
  pkg = require './package.json'

  # Configuration
  # =============
  grunt.initConfig

    # Cleanup
    # -------
    clean:
      build: 'build'
      temp: 'temp'
      bower: 'components'
      components: 'libs'
      amd: 'temp/scripts-amd'
      post_build: "build/libs/"

    # Wrangling
    # ---------
    copy:
      options:
        excludeEmpty: true

      module:
        files: [
          dest: "temp/#{pkg.name}"
          cwd: 'temp/scripts-amd'
          expand: true
          src: [
            '**/*'
            '!vendor/**/*'
          ]
        ]
      libs:
        files: [
          dest: "temp/libs"
          cwd: 'libs'
          expand: true
          src: '**/*'
        ]
      dev:
        files: [
          dest: "temp"
          cwd: 'dev'
          expand: true
          src:  '**/*'
        ]



    # Dependency management
    # ---------------------
    bower:
      install:
        options:
          targetDir: './libs'
          cleanup: true
          install: true
          forceLatest : true

    bower_require:
      target:
        rjsConfig: 'src/config.js'
    # Compilation
    # -----------
    coffee:
      compile:
        options:
          bare: true

        files: [
          expand: true
          cwd: 'src/scripts'
          src: '**/*.coffee'
          dest: "temp/#{pkg.name}"
          ext: '.js'
        ]
{% if (templateLanguage === 'handlebars') { %}
    # Micro-templating language
    # -------------------------
    handlebars:
      compile:
        options:
          namespace: false
          amd: true

        files: [
          expand: true
          cwd: 'src/scripts'
          src: '**/*.hbs'
          dest: "temp/#{pkg.name}"
          ext: '.js'
        ]

{% } else if (templateLanguage === 'jade') { %}
    # Micro-templating language
    # -------------------------
    jade:
      compile:
        options:
          client: true
          namespace: false
          amd: true
          compileDebug: false

        files: [
          expand: true
          cwd: 'src/scripts'
          src: '**/*.jade'
          dest: "temp/#{pkg.name}"
          ext: '.js'
        ]

{% } %}


    # Stylesheet Compressor
    # ---------------------
    mincss:
      compress:
        files:
          'build/styles/main.css': 'build/styles/main.css'

{% if (preprocessor === 'sass' || preprocessor == 'scss') { %}
    # Stylesheet Preprocessor
    # -----------------------
    compass:
      options:
        sassDir: 'src/styles'
        imagesDir: 'src/images'
        cssDir: 'temp/styles'
        javascriptsDir: 'temp/scripts'
        force: true
        relativeAssets: true

      compile:
        options:
          outputStyle: 'expanded'
          environment: 'development'

      build:
        options:
          outputStyle: 'compressed'
          environment: 'production'
{% } else if (preprocessor === 'less') { %}
    # Stylesheet Preprocessor
    # -----------------------
    less:
      compile:
        files:
          'temp/styles/main.css': 'src/styles/**/*.less'

        options:
          dumpLineNumbers: 'all'

      build:
        files:
          'temp/styles/main.css': 'src/styles/**/*.less'

        options:
          compress: true
          optimization: 2
{% } else if (preprocessor === 'stylus') { %}
    # Stylesheet Preprocessor
    # -----------------------
    stylus:
      compile:
        files:
          'temp/styles/main.css': 'src/styles/**/*.styl'

      build:
        files:
          'temp/styles/main.css': 'src/styles/**/*.styl'

        options:
          compress: true
{% } %}

    # Module conversion
    # -----------------
    urequire:
      convert:
        template: 'AMD'
        bundlePath: "temp/#{pkg.name}/"
        outputPath: 'temp/scripts-amd/'


    # Script lint
    # -----------
    coffeelint:
      gruntfile: 'Gruntfile.coffee'
      src: [
        'src/**/*.coffee'
        '!src/scripts/vendor/**/*'
      ]

    # Webserver
    # ---------
    connect:
      options:
        port: 3501
        hostname: 'localhost'
        middleware: (connect, options) -> [
          require('connect-url-rewrite') ['^([^.]+|.*\\?{1}.*)$ /']
          connect.static options.base
          connect.directory options.base
        ]

      build:
        options:
          keepalive: true
          base: 'build'

      temp:
        options:
          base: 'temp'

    # HTML Compressor
    # ---------------
    htmlmin:
      build:
        options:
          removeComments: true
          removeCommentsFromCDATA: true
          removeCDATASectionsFromCDATA: true
          collapseWhitespace: true
          collapseBooleanAttributes: true
          removeAttributeQuotes: true
          removeRedundantAttributes: true
          useShortDoctype: true
          removeEmptyAttributes: true
          removeOptionalTags: true

        files: [
          expand: true
          cwd: 'build'
          dest: 'build'
          src: '**/*.html'
        ]

    # Dependency tracing
    # ------------------
    # TODO: This should not be neccessary; uRequire should be able to do
    #   this.
    requirejs:
      compile:
        options:
          appDir: './temp'
          dir: 'build'
          baseUrl: './'
          mainConfigFile: 'dev/config.js'

          modules : [
            {
              name : "#{pkg.name}"
              exclude: [
                'chaplin'
                'handlebars'
                'backbone'
                'jquery'
              ]
            }
          ]
          removeCombined : true
          optimize: 'none'

      css:
        options:
          out: 'build/styles/main.css'
          optimizeCss: 'standard.keepLines'
          cssImportIgnore: null
          cssIn: 'temp/styles/main.css'

    # Watch
    # -----
    watch:
      coffee:
        files: 'src/scripts/**/*.coffee'
        tasks: [ 
          'script', 

{% if (templateLanguage === 'handlebars') { %}
          'handlebars:compile'
{% } else if (templateLanguage === 'jade') { %}
          'jade:compile' 
{% } %}

        ]
        #tasks: 'script'
        options:
          interrupt: true
{% if (templateLanguage === 'handlebars') { %}
      handlebars:
        files: 'src/**/*.hbs'
        tasks: 'handlebars:compile'
        options:
          interrupt: true

{% } else if (templateLanguage === 'jade') { %}
      jade:
        files: 'src/**/*.jade'
        tasks: 'jade:compile'
        options:
          interrupt: true

{% } %}

{% if (preprocessor === 'sass' || preprocessor == 'scss') { %}
      compass:
        files: 'src/styles/**/*.{scss,sass}'
        tasks: 'compass:compile'
        options:
          interrupt: true
{% } else if (preprocessor === 'less') { %}
      less:
        files: 'src/styles/**/*.less'
        tasks: 'less:compile'
        options:
          interrupt: true
{% } else if (preprocessor === 'stylus') { %}
      stylus:
        files: 'src/styles/**/*.styl'
        tasks: 'stylus:compile'
        options:
          interrupt: true
{% } %}

  # Dependencies
  # ============
  for name of pkg.devDependencies when name.substring(0, 6) is 'grunt-'
    grunt.loadNpmTasks name

  # Tasks
  # =====

  # Lint
  # ----
  # Lints all applicable files.
  grunt.registerTask 'lint', [
    'coffeelint'
  ]

  # Prepare
  # -------
  # Cleans the project directory of built files and downloads / updates
  # bower-managed dependencies.
  grunt.registerTask 'prepare', [
    'clean'
    'bower:install'
  ]

  # Script
  # ------
  # Compiles all coffee-script into java-script converts them to the
  # appropriate module format (if neccessary).
  grunt.registerTask 'script', [
    'coffee:compile'
    'urequire:convert'
    'copy:module'
    'clean:amd'
    'wrap'
  ]

  # Server
  # ------
  # Compiles a development build of the application; starts an HTTP server
  # on the output; and, initiates a watcher to re-compile automatically.
  grunt.registerTask 'server', [
    'copy:libs'
    'copy:dev'
    {% if (templateLanguage === 'handlebars') { %}
    'handlebars:compile'{% }
    else if (templateLanguage === 'jade') { %}
    'jade:compile'{% } %}
    'script'
    {% if (/scss|sass/.test(preprocessor)) { %}
    'compass:compile'{% } else if (preprocessor === 'less') { %}
    'less:compile'{% } else if (preprocessor === 'stylus') { %}
    'stylus:compile'{% } %}
    'connect:temp'
    'watch'
  ]

  # Build
  # -----
  # Compiles a production build of the application.
  grunt.registerTask 'build', [
    'clean:build'
    'clean:temp'
    'copy:libs'
    {% if (templateLanguage === 'handlebars') { %}
    'handlebars:compile'{% }
    else if (templateLanguage === 'jade') { %}
    'jade:compile'{% } %}
    'script'
    {% if (/scss|sass/.test(preprocessor)) { %}
    'compass:build'{% } else if (preprocessor === 'less') { %}
    'less:build'{% } else if (preprocessor === 'stylus') { %}
    'stylus:build'{% } %}
    'requirejs:compile'
    'clean:post_build'
#    'requirejs:css'
#    'mincss:compress'
#    'htmlmin'
  ]

  grunt.registerTask 'wrap', ->
    grunt.file.write "temp/#{pkg.name}.js",
      "// generated wrapper (do not modify)\n"+
      "define('#{pkg.name}',['require', 'exports', 'module', '#{pkg.name}/main'],\n"+
      "   function (require, exports, module){  \n"+
      "      module.exports = require('#{pkg.name}/main');\n   }\n);"
