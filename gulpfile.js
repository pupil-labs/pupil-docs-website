// load all required libraries
var gulp = require('gulp');
var gutil = require('gulp-util');

// node filesystem 
var fs = require('fs');

// plugins - site
var sass = require('gulp-sass');
var prefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var cleancss = require('gulp-clean-css');
var concat = require('gulp-concat');
var runSeq = require('run-sequence');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');

var SLATE_PATH = "./themes/docuapi/static/slate/";

// =================================================================                      
// css build tasks
// =================================================================                      )

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


gulp.task('css:build:all', function() {
  return runSeq(['css:build:screen','css:build:print'])
});


// =================================================================                      
// js build tasks
// =================================================================                      )

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
          SLATE_PATH+"javascripts/app/_toc.js"])
          .pipe(concat('all.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest(SLATE_PATH+"javascripts"))
})


gulp.task("js:build:all_nosearch", function(){
  return gulp.src([SLATE_PATH+"javascripts/lib/_energize.js",
          SLATE_PATH+"javascripts/lib/_jquery.js",
          SLATE_PATH+"javascripts/lib/_jquery_ui.js",
          SLATE_PATH+"javascripts/lib/_jquery.tocify.js",
          SLATE_PATH+"javascripts/lib/_imagesloaded.min.js",
          SLATE_PATH+"javascripts/app/_lang.js",
          SLATE_PATH+"javascripts/app/_toc.js"])
          .pipe(concat('all_nosearch.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest(SLATE_PATH+"javascripts"))
})

gulp.task('js:build', function() {
  return runSeq(['js:build:all','js:build:all_nosearch'])
});


// =================================================================                      
// image min tasks - not using currently
// =================================================================                      )

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