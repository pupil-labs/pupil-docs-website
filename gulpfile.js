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
const uncss = require('gulp-uncss')
const browserSync = require('browser-sync')
const reload = browserSync.reload

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
// css preview tasks
// =================================================================

gulp.task("css:preview:screen", function() {
  return gulp.src(SLATE_PATH+"stylesheets/screen.css.scss")
          .pipe(sass({outputStyle: 'compressed'}).on('error',sass.logError))
          .pipe(cleancss())
          .pipe(prefixer({
              browsers: ["last 2 versions"],
              cascade: true, // prettify browser prefixes
              remove: true // remove un-needed prefixes
          }))
          .pipe(concat('screen.min.css'))
          .pipe(gulp.dest("public/slate/stylesheets"))
});


gulp.task("css:preview:print", function() {
  return gulp.src(SLATE_PATH+"stylesheets/print.css.scss")
          .pipe(sass({outputStyle: 'compressed'}).on('error',sass.logError))
          .pipe(cleancss())
          .pipe(prefixer({
              browsers: ["last 2 versions"],
              cascade: true, // prettify browser prefixes
              remove: true // remove un-needed prefixes
          }))
          .pipe(concat('print.min.css'))
          .pipe(gulp.dest("public/slate/stylesheets"))
});


gulp.task('css:build:preview', ['css:preview:screen', 'css:preview:print'], function() {
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
          SLATE_PATH+"javascripts/lib/_plyr.js",
          SLATE_PATH+"javascripts/app/_lang.js",
          SLATE_PATH+"javascripts/app/_search.js",
          SLATE_PATH+"javascripts/app/_toc.js",
          SLATE_PATH+"javascripts/app/_plyrcontrols.js",
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


gulp.task("js:build:all_nosearch", function(){
  return gulp.src([SLATE_PATH+"javascripts/lib/_energize.js",
          SLATE_PATH+"javascripts/lib/_jquery.js",
          SLATE_PATH+"javascripts/lib/_jquery_ui.js",
          SLATE_PATH+"javascripts/lib/_jquery.tocify.js",
          SLATE_PATH+"javascripts/lib/_imagesloaded.min.js",
          SLATE_PATH+"javascripts/lib/_lazysizes.js",
          SLATE_PATH+"javascripts/app/_lang.js",
          SLATE_PATH+"javascripts/app/_toc.js",
          SLATE_PATH+"javascripts/app/_custom.js"])
          .pipe(concat('all_nosearch.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest(SLATE_PATH+"javascripts"))
});

gulp.task('js:build', ['js:build:all','js:build:all_nosearch', 'js:build:plyr'], function() {
  return;
});

// =================================================================
// js build tasks
// =================================================================

gulp.task("js:preview:all", function(){
  return gulp.src([SLATE_PATH+"javascripts/lib/_energize.js",
          SLATE_PATH+"javascripts/lib/_jquery.js",
          SLATE_PATH+"javascripts/lib/_lunr.js",
          SLATE_PATH+"javascripts/lib/_jquery.highlight.js",
          SLATE_PATH+"javascripts/lib/_jquery_ui.js",
          SLATE_PATH+"javascripts/lib/_jquery.tocify.js",
          SLATE_PATH+"javascripts/lib/_imagesloaded.min.js",
          SLATE_PATH+"javascripts/lib/_lazysizes.js",
          SLATE_PATH+"javascripts/lib/_plyr.js",
          SLATE_PATH+"javascripts/app/_lang.js",
          SLATE_PATH+"javascripts/app/_search.js",
          SLATE_PATH+"javascripts/app/_toc.js",
          SLATE_PATH+"javascripts/app/_plyrcontrols.js",
          SLATE_PATH+"javascripts/app/_custom.js"])
          .pipe(concat('all.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest("public/slate/javascripts"))
});

gulp.task("js:preview:plyr", function(){
  return gulp.src([
          SLATE_PATH+"javascripts/lib/_plyr.js",
          SLATE_PATH+"javascripts/app/_plyrcontrols.js",
          ])
          .pipe(concat('plyr.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest("public/slate/javascripts"))
});


gulp.task("js:preview:all_nosearch", function(){
  return gulp.src([SLATE_PATH+"javascripts/lib/_energize.js",
          SLATE_PATH+"javascripts/lib/_jquery.js",
          SLATE_PATH+"javascripts/lib/_jquery_ui.js",
          SLATE_PATH+"javascripts/lib/_jquery.tocify.js",
          SLATE_PATH+"javascripts/lib/_imagesloaded.min.js",
          SLATE_PATH+"javascripts/lib/_lazysizes.js",
          SLATE_PATH+"javascripts/app/_lang.js",
          SLATE_PATH+"javascripts/app/_toc.js",
          SLATE_PATH+"javascripts/app/_custom.js"])
          .pipe(concat('all_nosearch.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest("public/slate/jjavascripts"))
});

gulp.task('js:build:preview', ['js:preview:all','js:preview:all_nosearch', 'js:preview:plyr'], function() {
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

gulp.task('hugo:preview', shell.task([
  'hugo'])
);

// =================================================================
// dev tasks
// =================================================================

gulp.task('default', function() {
  return runSeq(['css:build','js:build'],'css:clean','hugo:serve');
});


gulp.task('deploy', ['css:build','js:build'], function() {
  return;
});

// =================================================================
// image min tasks - used by travis to create lq preview images
//                   for lazy loading
// =================================================================

var imgInput = './content/images/**/*.{jpg,jpeg,png}';
var imgOutput = './content/images/';

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

gulp.task('webp:make', function() {
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
// experiments
// =================================================================  

gulp.task('css:clean', function() {
  return gulp.src('public/slate/stylesheets/*.css')
    .pipe(size())
    .pipe(uncss({
      debug: true,
      html: ['public/*.html'],
      report: true,
      ignore: [
          /.tocify-(w|h|i|f|s)\w+/,
          /.plyr--f\w+-(?:a|e)\w+/,
          /.plyr--(?:vid|st|re|pl|lo)\w+/,
          /.plyr__pl\w+-\w+/,
          /.plyr__co\w+/,
          /.plyr/,
          /.feature-v\w+.plyr--\w+/,
          /.cont\w+\s[a]/,
          /h\d\s.anchor*/, 
          /h\d\s.github-\w*/,
          /.toc-f\w*/,
          /.search-\w*/,
          /.img-\w+(.)lazy\w*/,
          /.content\s.(?:search-|github-)\w*/
        ]}))
    .pipe(size())
    .pipe(gulp.dest('public/slate/stylesheets/'))
});


// =================================================================                      
// browser sync
// =================================================================  

// bs reload
gulp.task('md:preview',['hugo:preview'], reload);
gulp.task('css:preview',['css:build:preview'], reload);
gulp.task('js:preview',['js:build:preview'], reload);


gulp.task('preview', function(cb) {
  return runSeq(['css:build','js:build'],
                'hugo:preview',
                'css:clean',
                cb
                );
});


gulp.task('watch', ['preview'], function() {
  // preview with browserSync
  browserSync.init({server: "public", port:3000})
  gulp.watch(SLATE_PATH+"javascripts/**/*.js", ['js:preview'])
  gulp.watch(SLATE_PATH+"stylesheets/*.{css,scss}", ['css:preview'])
  gulp.watch("content/**/*.md", ['md:preview'])
});