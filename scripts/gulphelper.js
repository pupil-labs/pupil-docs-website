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
const rename = require('gulp-rename')
const size = require('gulp-size')
const imagemin = require('gulp-imagemin')
const img_resize = require('gulp-image-resize')
const webp = require('gulp-webp')
const replace = require('gulp-string-replace');
const git = require('git-rev-sync');
const htmlmin = require('gulp-htmlmin');

var SLATE_PATH = "./themes/docuapi/static/slate/";

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
// Service worker task - append git hash for cache update
// =================================================================

var gitshort = git.short()

gulp.task('sw:rev', function() {
  return gulp.src(SLATE_PATH+"javascripts/app/_pupil_sw.js")
    .pipe(replace(/#v@hash@|\b[0-9a-f]{7}/g, gitshort))
    .pipe(gulp.dest(SLATE_PATH+"javascripts/app"))
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