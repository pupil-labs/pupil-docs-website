// load all required libraries
var gulp = require('gulp');
var gutil = require('gulp-util');

// node filesystem 
var fs = require('fs');

// plugins - site
var prefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var cleancss = require('gulp-clean-css');
var concat = require('gulp-concat');
var runSeq = require('run-sequence');

// =================================================================                      
// css build task(
// =================================================================                      )

gulp.task("css:main", function() {
  return gulp.src("./assets/css/main.css")
        .pipe(cleancss())
        .pipe(prefixer({
            browsers: ["last 2 versions"],
            cascade: true, // prettify browser prefixes
            remove: true // remove un-needed prefixes
        }))
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest("./static/stylesheets"))
      });

gulp.task("css:screen", function() {
  gulp.src("./assets/css/screen.css")
      .pipe(cleancss())
      .pipe(prefixer({
          browsers: ["last 2 versions"],
          cascade: true, // prettify browser prefixes
          remove: true // remove un-needed prefixes
        }))
      .pipe(concat('screen.min.css')) 
      .pipe(gulp.dest("./static/stylesheets"))
      });

gulp.task('css:all', function() {
  return runSeq(['css:main','css:screen'])
  });

// =================================================================                      
// image min task(
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