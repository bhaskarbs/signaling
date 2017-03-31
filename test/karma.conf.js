// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-03-03 using
// generator-karma 0.8.2

module.exports = function(config) {
  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/jquery/jquery.js',
      'bower_components/jquery.cookie/jquery.cookie.js',
      'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
      'bower_components/underscore/underscore.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-localization/angular-localization.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/select2/select2.js',
      'bower_components/ngyn-select2/js/ngyn-select2.js',
      'bower_components/i18n/js/localize.js',
      'bower_components/angular-smart-table/dist/smart-table.js',
      'bower_components/angular-gantt-chart/dist/angular-gantt.js',
      'bower_components/d3/d3.js',
      'bower_components/d3-tip/index.js',
      'bower_components/topojson/topojson.js',
      'bower_components/datamaps/dist/datamaps.world.js',
      'app/scripts/modules/**/*.js',
      'app/scripts/modules/*.js',
      'app/scripts/**/*.js',
      'app/scripts/*.js',
      'app/i18n/*.js',
      {pattern: 'test/spec/fixtures/*.json', watched: true, served: true, included: false},
      'test/spec/controllers/**/*.js',
      'test/spec/services/**/*.js',
      'test/spec/providers/**/*.js',
      'test/spec/factories/**/*.js',
      'test/spec/directives/**/*.js',
      'test/spec/modules/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,
    preprocessors: {
      'app/scripts/**/*.js': ['coverage'],
      'app/scripts/*.js': ['coverage']
    },
    coverageReporter: {
      dir: 'test/coverage/',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
        { type: 'cobertura', subdir: '.', file: 'report-cobertura.xml' },
        { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
        { type: 'teamcity', subdir: '.', file: 'report-teamcity.txt' },
        { type: 'text', subdir: '.', file: 'report-text.txt' },
        { type: 'text', subdir: '.'},
        { type: 'text-summary', subdir: '.', file: 'report-text-summary.txt' },
      ]
    },

    reporters: [
      'progress', 'story', 'coverage'
    ],
    // Which plugins to enable
    plugins: [
       'karma-firefox-launcher',
       'karma-chrome-launcher',
       'karma-ie-launcher',
       'karma-safari-launcher',
       'karma-phantomjs-launcher',
       'karma-jasmine',
       'karma-coverage',
       'karma-story-reporter'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_ERROR

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
