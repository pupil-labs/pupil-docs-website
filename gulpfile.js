// load all required libraries
const gulp = require('gulp');

// plugins - site
const sass = require('gulp-sass');
const prefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const runSeq = require('run-sequence');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const shell = require('gulp-shell');

// Require all helper gulp tasks located in scripts
const requireDir = require('require-dir');
requireDir('./scripts', { recurse:true });

// Paths
const SLATE_PATH = "./themes/docuapi/static/slate/";

const CS_PATH = SLATE_PATH+"/stylesheets";

const JS_PATH = SLATE_PATH+"/javascripts";
const ALL_SEARCH = [
          JS_PATH+"/lib/_energize.js",
          JS_PATH+"lib/_jquery.js",
          JS_PATH+"/lib/_lunr.js",
          JS_PATH+"/lib/_jquery.highlight.js",
          JS_PATH+"/lib/_jquery_ui.js",
          JS_PATH+"/lib/_jquery.tocify.js",
          JS_PATH+"/lib/_imagesloaded.min.js",
          JS_PATH+"/lib/_lazysizes.js",
          JS_PATH+"/lib/_modernizr-webp.js",
          JS_PATH+"/app/_lang.js",
          JS_PATH+"/app/_search.js",
          JS_PATH+"/app/_toc.js",
          JS_PATH+"/app/_modernizr-webp_poster.js",
          JS_PATH+"/app/_custom.js"];

const ALL_NOSEARCH = [
          JS_PATH+"/lib/_energize.js",
          JS_PATH+"/lib/_jquery.js",
          JS_PATH+"/lib/_jquery_ui.js",
          JS_PATH+"/lib/_jquery.tocify.js",
          JS_PATH+"/lib/_imagesloaded.min.js",
          JS_PATH+"/lib/_lazysizes.js",
          JS_PATH+"/lib/_modernizr-webp.js",
          JS_PATH+"/app/_lang.js",
          JS_PATH+"/app/_toc.js",
          JS_PATH+"/app/_modernizr-webp_poster.js",
          JS_PATH+"/app/_custom.js"];

// =================================================================
// hugo tasks
// =================================================================

gulp.task('hugo:disk', shell.task([
  'hugo server --renderToDisk'])
);

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

gulp.task('public', function(cb) {
  return runSeq(['css:build','js:build'],'hugo:disk');
});

gulp.task('deploy', ['css:build','js:build'], function() {
  return;
});

// =================================================================
// js and css master build tasks
// =================================================================

gulp.task('css:build', ['css:build:screen', 'css:build:print'], function() {
  return;
});

gulp.task('js:build', ['js:build:all','js:build:all_nosearch', 'js:build:plyr', 'js:build:yt', 'js:build:sw'], function() {
  return;
});

// =================================================================
// css build tasks
// =================================================================

gulp.task("css:build:screen", function() {
  return gulp.src(CS_PATH+"/screen.css.scss")
          .pipe(sass({outputStyle: 'compressed'}).on('error',sass.logError))
          .pipe(cleancss())
          .pipe(prefixer({
              browsers: ["last 2 versions"],
              cascade: true, // prettify browser prefixes
              remove: true // remove un-needed prefixes
          }))
          .pipe(concat('screen.min.css'))
          .pipe(gulp.dest(CS_PATH))
});


gulp.task("css:build:print", function() {
  return gulp.src(CS_PATH+"/print.css.scss")
          .pipe(sass({outputStyle: 'compressed'}).on('error',sass.logError))
          .pipe(cleancss())
          .pipe(prefixer({
              browsers: ["last 2 versions"],
              cascade: true, // prettify browser prefixes
              remove: true // remove un-needed prefixes
          }))
          .pipe(concat('print.min.css'))
          .pipe(gulp.dest(CS_PATH))
});

// =================================================================
// js build tasks
// =================================================================

gulp.task("js:build:all", function(){
  return gulp.src(ALL_SEARCH)
          .pipe(concat('all.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest(JS_PATH))
});

gulp.task("js:build:plyr", function(){
  return gulp.src([
          JS_PATH+"/lib/_plyr.js",
          JS_PATH+"/app/_plyrcontrols.js"
          ])
          .pipe(concat('plyr.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest(JS_PATH))
});

gulp.task("js:build:sw", function(){
  return gulp.src(JS_PATH+"/app/_pupil_sw.js")
          .pipe(concat('pupil_sw.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest('./content'))
});


gulp.task("js:build:yt", function(){
  return gulp.src(JS_PATH+"/app/_youtube-lazyload.js")
          .pipe(concat('yt-lazyload.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest(JS_PATH))
});

gulp.task("js:build:all_nosearch", function(){
  return gulp.src(ALL_NOSEARCH)
          .pipe(concat('all_nosearch.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest(JS_PATH))
});