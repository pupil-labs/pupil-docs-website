// load all required libraries
const gulp = require('gulp');
const gutil = require('gulp-util');

// node filesystem
const fs = require('fs');

// plugins - site
const sass = require('gulp-sass');
const prefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const runSeq = require('run-sequence');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const minify = require('gulp-minify');
const shell = require('gulp-shell');

// hugo-gulp-template
const imagemin = require('gulp-imagemin');
const size = require('gulp-size');
const browserSync = require('browser-sync');
const reload = browserSync.reload;


// =================================================================
// Paths
// =================================================================

var SLATE_PATH = "./themes/docuapi/static/slate/";

var imageInput = './content/images/**/*';
var imageOutput = './content/test-images';

var sassScreen = 'stylesheets/screen.css.scss';
var sassPrint = 'stylesheets/print.css.scss';

var jsAllsearch = [
      SLATE_PATH+"javascripts/lib/_energize.js",
      SLATE_PATH+"javascripts/lib/_jquery.js",
      SLATE_PATH+"javascripts/lib/_lunr.js",
      SLATE_PATH+"javascripts/lib/_jquery.highlight.js",
      SLATE_PATH+"javascripts/lib/_jquery_ui.js",
      SLATE_PATH+"javascripts/lib/_jquery.tocify.js",
      SLATE_PATH+"javascripts/lib/_imagesloaded.min.js",
      SLATE_PATH+"javascripts/app/_lang.js",
      SLATE_PATH+"javascripts/app/_search.js",
      SLATE_PATH+"javascripts/app/_toc.js",
      SLATE_PATH+"javascripts/app/_custom.js"
];

var jsNoAllsearch = [
      SLATE_PATH+"javascripts/lib/_energize.js",
      SLATE_PATH+"javascripts/lib/_jquery.js",
      SLATE_PATH+"javascripts/lib/_jquery_ui.js",
      SLATE_PATH+"javascripts/lib/_jquery.tocify.js",
      SLATE_PATH+"javascripts/lib/_imagesloaded.min.js",
      SLATE_PATH+"javascripts/app/_lang.js",
      SLATE_PATH+"javascripts/app/_toc.js",
      SLATE_PATH+"javascripts/app/_custom.js"
];

var jsOutput = SLATE_PATH+'javascripts';

var assetsPath = [
      SLATE_PATH+'stylesheets/**/*.scss',
      SLATE_PATH+'javascripts/**/*.js'
      ];

var sassAll = SLATE_PATH+'stylesheets/**/*.scss';
var jsAll = SLATE_PATH+'javascripts/**/*.js';

// =================================================================
// Serve - BrowserSync
// =================================================================

gulp.task('preview', function(cb) {
  return runSeq(['css:build','js:build:all'],'hugo:all',cb);
});

gulp.task('default', ['preview'], function() {
  browserSync.init({
    server: {
      baseDir: './public/'
    },
    open: false
  });
  gulp.watch(jsAll, ['reload:js']);
  gulp.watch(sassAll, ['reload:sass']);
  gulp.watch('./content/**/*.md', ['reload:md']);
});

gulp.task('reload:js', ['preview'], reload);

gulp.task('reload:sass', ['preview'], reload);

gulp.task('reload:md', ['preview'], reload);

// =================================================================
// hugo tasks
// =================================================================

gulp.task('hugo:serve', shell.task([
  'hugo server -D'])
);

gulp.task('hugo:build', shell.task([
  'hugo server -D'])
);

gulp.task('hugo:all', shell.task([
  'hugo'])
);

// =================================================================
// dev tasks
// =================================================================

gulp.task('deploy', ['css:build','js:build'], function() {
  return;
});

gulp.task('css:build', ['css:build:screen', 'css:build:print'], function() {
  return;
});

gulp.task('js:build', ['js:build:all','js:build:all_nosearch'], function() {
  return;
});

// =================================================================
// css build tasks
// =================================================================

gulp.task("css:build:screen", function() {
  return gulp.src(SLATE_PATH+sassScreen)
          .pipe(sass({outputStyle: 'compressed'}).on('error',sass.logError))
          .pipe(cleancss())
          .pipe(prefixer({
              browsers: ["last 2 versions"],
              cascade: true, // prettify browser prefixes
              remove: true // remove un-needed prefixes
          }))
          .pipe(concat('screen.min.css'))
          .pipe(gulp.dest(SLATE_PATH+"stylesheets"))
});


gulp.task("css:build:print", function() {
  return gulp.src(SLATE_PATH+sassPrint)
          .pipe(sass({outputStyle: 'compressed'}).on('error',sass.logError))
          .pipe(cleancss())
          .pipe(prefixer({
              browsers: ["last 2 versions"],
              cascade: true, // prettify browser prefixes
              remove: true // remove un-needed prefixes
          }))
          .pipe(concat('print.min.css'))
          .pipe(gulp.dest(SLATE_PATH+"stylesheets"))
});

// =================================================================
// js build tasks
// =================================================================

gulp.task("js:build:all", function(){
  return gulp.src(jsAllsearch)
          .pipe(concat('all.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest(jsOutput))
          // .pipe(browserSync.stream({once: true}))
});


gulp.task("js:build:all_nosearch", function(){
  return gulp.src(jsNoAllsearch)
          .pipe(concat('all_nosearch.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest(jsOutput))
          // .pipe(browserSync.stream({once: true}))
});

// =================================================================
// image min tasks - not using currently
// =================================================================

gulp.task('image_min', function() {
  options = {
    resize: [1440,1440],
    quality: 85,
    progressive: true,
    compressionLevel: 6,
    sequentialRead: true,
    trellisQuantisation: false
  }

  return gulp.src(imageInput)
          .pipe(plumber())
          .pipe(image_min(options))
          .pipe(size())
          .pipe(gulp.dest('./'))
});

// image min - hugo-gulp-template
// =================================================================

gulp.task('img:min', function() {
  return gulp.src(imageInput)
          .pipe(size())
          .pipe(imagemin({
            progressive: true,
            svgoPlugins: [
              {removeViewBox: false},
              {cleanupIDs: false}
            ]
          }))
          .pipe(size())
          .pipe(gulp.dest(imageOutput));
});