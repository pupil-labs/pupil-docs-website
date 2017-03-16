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

var SLATE_PATH = "./themes/docuapi/static/slate/";

// =================================================================
// css build tasks
// =================================================================

gulp.task("css:build:screen", function() {
  return gulp.src(SLATE_PATH+"stylesheets/screen.css.scss")
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
  return gulp.src(SLATE_PATH+"stylesheets/print.css.scss")
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


gulp.task('css:build', ['css:build:screen', 'css:build:print'], function() {
  return;
});


// =================================================================
// js build tasks
// =================================================================

gulp.task("js:build:all", function(){
  return gulp.src([SLATE_PATH+"javascripts/lib/_energize.js",
          SLATE_PATH+"javascripts/lib/_jquery.js",
          SLATE_PATH+"javascripts/lib/_lunr.js",
          SLATE_PATH+"javascripts/lib/_jquery.highlight.js",
          SLATE_PATH+"javascripts/lib/_jquery_ui.js",
          SLATE_PATH+"javascripts/lib/_jquery.tocify.js",
          SLATE_PATH+"javascripts/lib/_imagesloaded.min.js",
          SLATE_PATH+"javascripts/app/_lang.js",
          SLATE_PATH+"javascripts/app/_search.js",
          SLATE_PATH+"javascripts/app/_toc.js",
          SLATE_PATH+"javascripts/app/_custom.js"])
          .pipe(concat('all.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest(SLATE_PATH+"javascripts"))
});


gulp.task("js:build:all_nosearch", function(){
  return gulp.src([SLATE_PATH+"javascripts/lib/_energize.js",
          SLATE_PATH+"javascripts/lib/_jquery.js",
          SLATE_PATH+"javascripts/lib/_jquery_ui.js",
          SLATE_PATH+"javascripts/lib/_jquery.tocify.js",
          SLATE_PATH+"javascripts/lib/_imagesloaded.min.js",
          SLATE_PATH+"javascripts/app/_lang.js",
          SLATE_PATH+"javascripts/app/_toc.js",
          SLATE_PATH+"javascripts/app/_custom.js"])
          .pipe(concat('all_nosearch.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest(SLATE_PATH+"javascripts"))
});

gulp.task('js:build', ['js:build:all','js:build:all_nosearch'], function() {
  return;
});


// =================================================================
// hugo tasks
// =================================================================

gulp.task('hugo:serve', shell.task([
  'hugo server -D'])
);

gulp.task('hugo:build', shell.task([
  'hugo server -D'])
);

// =================================================================
// dev tasks
// =================================================================

gulp.task('default', function() {
  return runSeq(['css:build','js:build'],'hugo:serve');
});


gulp.task('deploy', ['css:build','js:build'], function() {
  return;
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

  return gulp.src('build/media/images/**/*.{jpg,png}',{base: './'})
    .pipe(plumber())
    .pipe(image_min(options))
    .pipe(gulp.dest('./'))
});