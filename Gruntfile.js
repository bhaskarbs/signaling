// Generated on 2015-03-03 using generator-angular 0.9.0-1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  //to generate war
  grunt.loadNpmTasks('grunt-war');

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist',
    src:'src'
  };
  var environment = grunt.option('P') || 'dev';
  var structure=require('./structure').structure;
  structure.init({ src : appConfig.src, app : appConfig.app, test: 'test', grunt : grunt});

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      src:{
        files:['<%= yeoman.src %>/{,*/}**/*.json','<%= yeoman.src %>/{,*/}**/*.js','<%= yeoman.src %>/{,*/}**/*.{html,htm}','<%= yeoman.src %>/{,*/}**/*.{scss,css}','<%= yeoman.src %>/{,*/}**/*.{png,jpg,jpeg,gif,webp,svg}'],
        tasks:[]
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js','<%= yeoman.app %>/scripts/{,*/}**/*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js','test/spec/{,*/}**/*.js'],
        tasks: ['newer:jshint:test', 'karma:dev']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}**/*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          ['<%= yeoman.app %>/scripts/{,*/}*.js','<%= yeoman.app %>/scripts/{,*/}**/*.js']
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js','test/spec/{,*/}**/*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '.sass-cache',
            '<%= yeoman.app%>',
            'test/spec',
            'test/coverage',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: ['.tmp','.sass-cache','<%= yeoman.dist %>','<%= yeoman.app%>','test/spec','test/coverage']
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: [],
        ignorePath: new RegExp('^<%= yeoman.app %>/|../')
      },
      sass: {
        src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: './bower_components/',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%= yeoman.app %>/index.html', '<%= yeoman.app %>/dashboard.html'],
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/images']
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true
          /*,
           removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        },
        {
          expand: true,
          cwd: '.tmp/worker',
          src: '*.js',
          dest: '.tmp/worker'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/**',
            'languages/**',
            'views/**/{,*/}*.html',
           // 'worker/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          dot: true,
          cwd: 'bower_components/font-awesome',
          src: ['fonts/*.*'],
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          dot: true,
          cwd: 'bower_components/roboto-fontface',
          src: ['fonts/*.*'],
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          dot: true,
          cwd: 'bower_components/roboto-slab-fontface',
          src: ['fonts/*.*'],
          dest: '<%= yeoman.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      resources: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['images/**/*'],
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['fixtures/**'],
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['i18n/**'],
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          dot: true,
          cwd: 'bower_components/select2',
          src: ['select2.png','select2-spinner.gif','select2x2.png'],
          dest: '<%= yeoman.dist %>/styles'
        }, {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>/styles',
          src: ['private/analysis/adhoc/adhoc-analysis.css', 'private/analysis/open/open-compose-analysis.css', 'private/analysis/open/open-visualization-analysis.css'],
          dest: '<%= yeoman.dist %>/styles'
        },{
          expand: true,
          dot: true,
          cwd: 'bower_components/open-sans-fontface',
          src: ['fonts/*/*.*'],
          dest: '<%= yeoman.dist %>/styles'
        }]
      }
    },
    war: {
      target: {
        options: {
          war_dist_folder: '<%= yeoman.dist %>', //Where you have your yeoman build files
          war_verbose: true,
          war_name: 'saint', //the name of your war
          webxml_welcome: 'index.html',
          webxml_display_name: 'saint',
          webxml_mime_mapping: [ //some settings that you want to appear in your web.xml file
          ]
        },
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.dist %>', //Where you have your yeoman build files
            src: ['**'],
            dest: '.'
          }
        ]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      options: {
        configFile: 'test/karma.conf.js',
        autoWatch: true,
        browsers: structure.getBrowsers(),
        singleRun: true
      },
      continuous: {
        browsers: ['PhantomJS'],
        autoWatch: false
      },
      dev: {
        background : false
      },
      debug:{
        browsers:['Chrome'],
        singleRun:false,
        background : false
      }
    },

    ngconstant: {
      // Options for all targets
      options: {
        space: '  ',
        wrap: '\'use strict\';\n\n {%= __ngModule %}',
        name: 'saint-config' // Name of the angular module to inject in the angular application
      },
      // Environment targets
      d01: {
        options: {
          dest: '<%= yeoman.app %>/scripts/modules/config.module.js'
        },
        constants: {
          Environment: { // ENV is the service which we inject into the application to access these keys
            isHttps: false,
            apiEndpoint: 'http://dcidsthana01.dci.local:8000',
            boeEndpoint: 'https://safety-02.dev.deloitteinnovation.space',
            backendHanaContext:'/deloitte/innovation/ls/safety/services',
            userInfoService:'/admin/UserInfo.xsjs',
            boeSessionService: '/logon/trusted',
            backendSapContext:'/sap',
            saintContext:'/ui',
            boeContext:'/BOE',
            loginUrl:'dashboard.html',
            boeRestContext:'/secure/rptapi'
          }
        }
      },
      test: {
        options: {
          dest: '<%= yeoman.app %>/scripts/modules/config.module.js'
        },
        constants: {
          Environment: { // ENV is the service which we inject into the application to access these keys
            isHttps: false,
            apiEndpoint: '/base',
            boeEndpoint: '/base',
            backendHanaContext: '/test/spec/fixtures',
            userInfoService: '/user-service.get-session.test.json',
            boeSessionService: '/user-service.get-boe-token.test.json',
            backendSapContext: '/sap',
            saintContext: '/ui',
            boeContext: '/BOE',
            loginUrl: 'dashboard.html',
            boeRestContext: '/test/spec/fixtures'
          }
        }
      },
      local: {
        options: {
          dest: '<%= yeoman.app %>/scripts/modules/config.module.js'
        },
        constants: {
          Environment: { // ENV is the service which we inject into the application to access these keys
            isHttps: false,
            apiEndpoint: 'https://safety-02.dev.deloitteinnovation.space',
            boeEndpoint: 'https://safety-02.dev.deloitteinnovation.space',
            backendHanaContext:'/secure/xsapi',
            userInfoService: '/admin/UserInfo.xsjs',
            boeSessionService: '/logon/trusted',
            backendSapContext:'/sap',
            saintContext:'/ui',
            boeContext:'/BOE',
            loginUrl:'dashboard.html',
            boeRestContext:'/secure/rptapi'
          }
        }
      },
      dev: {
        options: {
          dest: '<%= yeoman.app %>/scripts/modules/config.module.js'
        },
        constants: {
          Environment: { // ENV is the service which we inject into the application to access these keys
            isHttps: true,
            apiEndpoint: '',
            boeEndpoint: '',
            backendHanaContext:'/secure/xsapi',
            userInfoService:'/admin/UserInfo.xsjs',
            boeSessionService: '/logon/trusted',
            backendSapContext:'/sap',
            saintContext:'/ui',
            boeContext:'/BOE',
            loginUrl:'/secure/xsapi/login.xsjs',
            boeRestContext:'/secure/rptapi'
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('config', ['ngconstant:' + environment]);

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['test:dist', 'build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'config',
      'copysrctoapp',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch',
      'newer:jshint'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    if(target){
      grunt.task.run(['serve:' + target]);
    }else{
      grunt.task.run(['serve']);
    }

  });
  grunt.registerTask('commonTest',[
    'ngconstant:test',
    'copysrctoapp',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'jshint:test'
  ]);

  grunt.registerTask('test', function (target) {
    if (target === 'debug') {
      return grunt.task.run(['clean:server', 'commonTest', 'karma:debug']);
    }
    if (target === 'dist') {
      return grunt.task.run(['clean:server', 'commonTest','karma:dev']);
    }
    grunt.task.run([
      'commonTest',
      'karma:continuous'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'config',
    'copysrctoapp',
    'jshint:all',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    //'cdnify', XXX Commented since not required, but don't delete
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin',
    'copy:resources'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
