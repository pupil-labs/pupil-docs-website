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
const rename = require('gulp-rename')
const size = require('gulp-size')
const imagemin = require('gulp-imagemin')
const img_resize = require('gulp-image-resize')
const webp = require('gulp-webp')
const replace = require('gulp-string-replace');
const git = require('git-rev-sync');
const htmlmin = require('gulp-htmlmin');
const exec = require('child_process').exec;


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
          SLATE_PATH+"javascripts/lib/_lazysizes.js",
          SLATE_PATH+"javascripts/lib/_modernizr-webp.js",
          SLATE_PATH+"javascripts/app/_lang.js",
          SLATE_PATH+"javascripts/app/_search.js",
          SLATE_PATH+"javascripts/app/_toc.js",
          SLATE_PATH+"javascripts/app/_modernizr-webp_poster.js",
          SLATE_PATH+"javascripts/app/_custom.js"])
          .pipe(concat('all.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest(SLATE_PATH+"javascripts"))
});

gulp.task("js:build:plyr", function(){
  return gulp.src([
          SLATE_PATH+"javascripts/lib/_plyr.js",
          SLATE_PATH+"javascripts/app/_plyrcontrols.js",
          ])
          .pipe(concat('plyr.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest(SLATE_PATH+"javascripts"))
});

gulp.task("js:build:sw", function(){
  return gulp.src([
          SLATE_PATH+"javascripts/app/_pupil_sw.js",
          ])
          .pipe(concat('pupil_sw.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest('./content'))
});


gulp.task("js:build:yt", function(){
  return gulp.src(SLATE_PATH+"javascripts/app/_youtube-lazyload.js")
          .pipe(concat('yt-lazyload.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest(SLATE_PATH+"javascripts"))
});

gulp.task("js:build:all_nosearch", function(){
  return gulp.src([SLATE_PATH+"javascripts/lib/_energize.js",
          SLATE_PATH+"javascripts/lib/_jquery.js",
          SLATE_PATH+"javascripts/lib/_jquery_ui.js",
          SLATE_PATH+"javascripts/lib/_jquery.tocify.js",
          SLATE_PATH+"javascripts/lib/_imagesloaded.min.js",
          SLATE_PATH+"javascripts/lib/_lazysizes.js",
          SLATE_PATH+"javascripts/lib/_modernizr-webp.js",
          SLATE_PATH+"javascripts/app/_lang.js",
          SLATE_PATH+"javascripts/app/_toc.js",
          SLATE_PATH+"javascripts/app/_modernizr-webp_poster.js",
          SLATE_PATH+"javascripts/app/_custom.js"])
          .pipe(concat('all_nosearch.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest(SLATE_PATH+"javascripts"))
});

gulp.task('js:build', ['js:build:all','js:build:all_nosearch', 'js:build:plyr', 'js:build:yt'], function() {

  return;
});


// =================================================================
// hugo tasks
// =================================================================

gulp.task('hugo:disk', function(cb) {
  exec('hugo server --renderToDisk', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
})

gulp.task('hugo:serve', function(cb) {
  exec('hugo server --config="config.toml" --verbose', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
})

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
// image min tasks - used by travis to create lq preview images
//                   for lazy loading
// =================================================================

var imgInput = './content/images/**/*.{jpg,jpeg,png}';
var vidInput =  './content/videos/**/*.jpg';
var imgOutput = './content/images/';
var vidOutput = './content/videos/';

gulp.task('img:minify', function() {
  return gulp.src(imgInput)
    .pipe(plumber())
    .pipe(size())
    .pipe(imagemin())
    .pipe(size())
    .pipe(gulp.dest(imgOutput))
});

gulp.task('img:make', function() {
  return runSeq('img:minify', 'img:make:previews');
});

gulp.task('img:make:previews', function() {
  return gulp.src(imgInput)
    .pipe(plumber())
    .pipe(size())
    .pipe(img_resize({
      width : 20,
      height : 20,
      crop : false,
      upscale : false
    }))
    .pipe(rename( function(path) {
      // be warned - no `.` in image file names!
      var regexp = /(\.[a-zA-Z\d]+)/;
      // regex match the branch or tag name group e.g. .master or .v093
      // prepend _preview so final file name is
      // final file name = some-file-name_preview.master
      path.basename = path.basename.replace(regexp,"_preview"+"$1");
    }))
    .pipe(size())
    .pipe(gulp.dest(imgOutput))
});

gulp.task('webp:make', ['webp:make:img','webp:make:vid'], function() {
  return;
});

gulp.task('webp:make:img', function() {
  return gulp.src(imgInput)
    .pipe(plumber())
    .pipe(size())
    .pipe(webp({
      quality : 80
    }))
    .pipe(size())
    .pipe(gulp.dest(imgOutput))
});


// =================================================================
// Service worker task - append git hash for cache update
// =================================================================

var gitshort = git.short()

gulp.task('sw:rev', function() {
  return gulp.src(SLATE_PATH+"javascripts/app/_pupil_sw.js")
    .pipe(replace(/#v@hash@|\b[0-9a-f]{7}/g, gitshort))
    .pipe(gulp.dest(SLATE_PATH+"javascripts/app"))
});

gulp.task('webp:make:vid', function() {
  return gulp.src(vidInput)
    .pipe(plumber())
    .pipe(size())
    .pipe(webp({
      quality : 80
    }))
    .pipe(size())
    .pipe(gulp.dest(vidOutput))
});

// =================================================================
// htmlmin
// =================================================================

gulp.task('htmlmin', function() {
  return gulp.src('./public/**/*.html')
    .pipe(size())
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(size())
    .pipe(gulp.dest('./public'));
});