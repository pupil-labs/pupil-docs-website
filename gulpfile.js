// load all required libraries
const gulp = require('gulp');
const gutil = require('gulp-util');

// node filesystem
const fs = require('fs');

const { execSync } = require('child_process');

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
const replace = require('gulp-replace');
const hash = require('git-rev-sync');
const find = require('find');
const htmlmin = require('gulp-htmlmin');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM();
const del = require('del');

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
          .pipe(concat('pupil_sw.js'))
          // .pipe(uglify())
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

// Build, rev, cache and minify all service workers in the public dir

gulp.task('sw:build:all', function(cb) {
  return runSeq('sw:clean:all','sw:js:all','sw:rev:all','sw:cache:all',cb);
});

gulp.task('sw:js:all', ['js:sw1', 'js:sw2', 'js:sw3', 'js:sw4'], function() {
  return;
});

gulp.task('sw:rev:all', ['rev:tag1', 'rev:tag2', 'rev:tag3', 'rev:master'], function() {
  return;
});

gulp.task('sw:cache:all', ['cache:tag1', 'cache:tag2', 'cache:tag3', 'cache:master'], function() {
  return;
});

gulp.task('sw:min:all', ['min:tag1', 'min:tag2', 'min:tag3', 'min:master'], function() {
  return;
});

// get tags from content dir
var tag1 = execSync('cd content && git tag -l | sort -V | tail -n 1 | tr -d "."').toString().replace(/[\n\r]/g, '');
var tag2 = execSync('cd content && git tag -l | sort -V | tail -n 2 | head -n 1 | tr -d "."').toString().replace(/[\n\r]/g, '');
var tag3 = execSync('cd content && git tag -l | sort -V | head -n 2 | tail -n 1 | tr -d "."').toString().replace(/[\n\r]/g, '');

const indexTag1 = './public/index.html';
const indexTag2 = './public/'+tag2+'/index.html';
const indexTag3 = './public/'+tag3+'/index.html';
const indexMaster = './public/master/index.html';

const inputTag1 = './public/pupil_sw_'+tag1+'.min.js';
const inputTag2 = './public/'+tag2+'/pupil_sw_'+tag2+'.min.js';
const inputTag3 = './public/'+tag3+'/pupil_sw_'+tag3+'.min.js';
const inputMaster = './public/master/pupil_sw_master.min.js';

const outputTag1 = './public';
const outputTag2 = './public/'+tag2;
const outputTag3 = './public/'+tag3;
const outputMaster = './public/master';

// ========================================================
// Delete all service workers

gulp.task('sw:clean:all', function () {
  return del([inputTag1,inputTag2,inputTag3,inputMaster]);
});

// ========================================================
// Create service worker for each tag in their own folders
// to scope workers in their own subdirectory.

gulp.task("js:sw1", function(){
  return gulp.src([
          SLATE_PATH+"javascripts/app/_pupil_sw.js",
          ])
          .pipe(concat('pupil_sw_'+tag1+'.min.js'))
          .pipe(gulp.dest('./public'))
});

gulp.task("js:sw2", function(){
  return gulp.src([
          SLATE_PATH+"javascripts/app/_pupil_sw.js",
          ])
          .pipe(concat('pupil_sw_'+tag2+'.min.js'))
          .pipe(gulp.dest('./public/'+tag2))
});

gulp.task("js:sw3", function(){
  return gulp.src([
          SLATE_PATH+"javascripts/app/_pupil_sw.js",
          ])
          .pipe(concat('pupil_sw_'+tag3+'.min.js'))
          .pipe(gulp.dest('./public/'+tag3))
});

gulp.task("js:sw4", function(){
  return gulp.src([
          SLATE_PATH+"javascripts/app/_pupil_sw.js",
          ])
          .pipe(concat('pupil_sw_master.min.js'))
          .pipe(gulp.dest('./public/master/'))
});

// ========================================================
// Rev all service worker to the latest commit hash

//short commit hash
var gitshort = hash.short()

// replace commit hash via regex replace
gulp.task('rev:tag1', function() {
  return gulp.src(inputTag1)
    .pipe(replace(/#v@hash@|\b[0-9a-f]{7}/g, gitshort+"_"+tag1))
    .pipe(gulp.dest(outputTag1))
});

gulp.task('rev:tag2', function() {
  return gulp.src(inputTag2)
    .pipe(replace(/#v@hash@|\b[0-9a-f]{7}/g, gitshort+"_"+tag2))
    .pipe(gulp.dest(outputTag2))
});

gulp.task('rev:tag3', function() {
  return gulp.src(inputTag3)
    .pipe(replace(/#v@hash@|\b[0-9a-f]{7}/g, gitshort+"_"+tag3))
    .pipe(gulp.dest(outputTag3))
});

gulp.task('rev:master', function() {
  return gulp.src(inputMaster)
    .pipe(replace(/#v@hash@|\b[0-9a-f]{7}/g, gitshort+"_master"))
    .pipe(gulp.dest(outputMaster))
});


// get asset paths from the content and replace via regex
gulp.task('sw:local:cache', function() {
  find.file(/content\/(?:(images|videos).+)(.jpg|.webp|.mp4|.webm|.svg)/,__dirname, function(files) {
      var assetPaths = [];
      for (var i=0; i < files.length; i++) {
        var filePath = files[i].split('content').pop()
        assetPaths.push("'"+filePath+"'")
        // console.log(filePath)
      }
      return gulp.src(SLATE_PATH+"javascripts/app/_pupil_sw.js")
          .pipe(replace(/#v@hash@/g, '['+assetPaths+']'))
          .pipe(gulp.dest(SLATE_PATH+"javascripts/app"))
      console.log(assetPaths)
  })
});

// ========================================================
// Service Worker Caching
// manipulate the DOM within the html file to get all the asset paths for caching

gulp.task('cache:tag1', function() {
    JSDOM.fromFile(indexTag1).then(function(dom){

      // video
      var video = dom.window.document.getElementsByTagName('video');
      var videoPaths = [];
      for (var i = 0; i < video.length; i++) {
          var allVideo = video[i];
          var webmSrc = allVideo.childNodes[0].getAttribute('src')
          var mp4Src = allVideo.childNodes[1].getAttribute('src')
          videoPaths.push("'"+webmSrc+"'")
          videoPaths.push("'"+mp4Src+"'")
      }
      // video poster
      var videoPoster = dom.window.document.getElementsByTagName('video');
      var posterPaths = [];
      for (var p = 0; p < videoPoster.length; p++) {
        var allPosters = videoPoster[p];
        var posterSrc = allPosters.getAttribute('poster')
        posterPaths.push("'"+posterSrc+"'")
      }
      // picture
      var pic = dom.window.document.getElementsByTagName('picture');
      var picPaths = [];
      for (var n = 0; n < pic.length; n++) {
        var allPic = pic[n];
        var webpSrc = allPic.childNodes[0].getAttribute('srcset')
        var jpegSrc = allPic.childNodes[1].getAttribute('srcset')
        picPaths.push("'"+webpSrc+"'")
        picPaths.push("'"+jpegSrc+"'")
      }
      // intro
      var introImg = dom.window.document.getElementsByClassName('intro-image');
      var introPaths = [];
      for (var c = 0; c < introImg.length; c++) {
        var allIntro = introImg[c];
        var jpgSrc = allIntro.getAttribute('data-src')
        introPaths.push("'"+jpgSrc+"'")
      }
      // logo
      var logoImg = dom.window.document.getElementsByClassName('logo');
      var logoPaths = [];
      for (var l = 0; l < logoImg.length; l++) {
        var allLogo = logoImg[l];
        var svgSrc = allLogo.getAttribute('src')
        logoPaths.push("'"+svgSrc+"'")

      }
      // combine all arrays into one big array
      var cache = videoPaths.concat(posterPaths, picPaths, introPaths, logoPaths);
      // find and replace a string in the service worker js with all cache
      return gulp.src(inputTag1)
        .pipe(replace(/'#v@cache@';/g, '['+cache+'];'))
        .pipe(gulp.dest(outputTag1))
    })
});

gulp.task('cache:tag2', function() {
    JSDOM.fromFile(indexTag2).then(function(dom){

      // intro
      var introImg = dom.window.document.getElementsByClassName('intro-image');
      var introPaths = [];
      for (var c = 0; c < introImg.length; c++) {
        var allIntro = introImg[c];
        var jpgSrc = allIntro.getAttribute('data-src')
        introPaths.push("'"+jpgSrc+"'")
      }
      // logo
      var logoImg = dom.window.document.getElementsByClassName('feature-center');
      var logoPaths = [];
      for (var l = 0; l < logoImg.length; l++) {
        var allLogo = logoImg[l];
        var svgSrc = allLogo.getAttribute('src')
        logoPaths.push("'"+svgSrc+"'")
      }

      var figureImg = dom.window.document.getElementsByClassName('img-large');
      var figurePaths = [];
      for (var l = 0; l < figureImg.length; l++) {
        var allImg= figureImg[l];
        var imgSrc = allImg.getAttribute('data-src')
        figurePaths.push("'"+imgSrc+"'")
      }
      // combine all arrays into one big array
      var cache = introPaths.concat(figurePaths);
      // console.log(cache);
      // find and replace a string in the service worker js with all cache
      return gulp.src(inputTag2)
        .pipe(replace(/'#v@cache@';/g, '['+cache+'];'))
        .pipe(gulp.dest(outputTag2))
    })
});

gulp.task('cache:tag3', function() {
    JSDOM.fromFile(indexTag3).then(function(dom){

      // intro
      var introImg = dom.window.document.getElementsByClassName('intro-image');
      var introPaths = [];
      for (var c = 0; c < introImg.length; c++) {
        var allIntro = introImg[c];
        var jpgSrc = allIntro.getAttribute('src')
        introPaths.push("'"+jpgSrc+"'")
      }
      // figure
      var figureImg = dom.window.document.getElementsByTagName('figure');
      var figurePaths = [];
      for (var l = 0; l < figureImg.length; l++) {
        var allImg= figureImg[l];
        var imgSrc = allImg.childNodes[0].getAttribute('src')
        figurePaths.push("'"+imgSrc+"'")
      }
      // combine all arrays into one big array
      var cache = introPaths.concat(figurePaths);
      // console.log(cache);
      // find and replace a string in the service worker js with all cache
      return gulp.src(inputTag3)
        .pipe(replace(/'#v@cache@';/g, '['+cache+'];'))
        .pipe(gulp.dest(outputTag3))
    })
});

gulp.task('cache:master', function() {
    JSDOM.fromFile(indexMaster).then(function(dom){

      // video
      var video = dom.window.document.getElementsByTagName('video');
      var videoPaths = [];
      for (var i = 0; i < video.length; i++) {
          var allVideo = video[i];
          var webmSrc = allVideo.childNodes[0].getAttribute('src')
          var mp4Src = allVideo.childNodes[1].getAttribute('src')
          videoPaths.push("'"+webmSrc+"'")
          videoPaths.push("'"+mp4Src+"'")
      }
      // video poster
      var videoPoster = dom.window.document.getElementsByTagName('video');
      var posterPaths = [];
      for (var p = 0; p < videoPoster.length; p++) {
        var allPosters = videoPoster[p];
        var posterSrc = allPosters.getAttribute('poster')
        posterPaths.push("'"+posterSrc+"'")
      }
      // picture
      var pic = dom.window.document.getElementsByTagName('picture');
      var picPaths = [];
      for (var n = 0; n < pic.length; n++) {
        var allPic = pic[n];
        var webpSrc = allPic.childNodes[0].getAttribute('srcset')
        var jpegSrc = allPic.childNodes[1].getAttribute('srcset')
        picPaths.push("'"+webpSrc+"'")
        picPaths.push("'"+jpegSrc+"'")
      }
      // intro
      var introImg = dom.window.document.getElementsByClassName('intro-image');
      var introPaths = [];
      for (var c = 0; c < introImg.length; c++) {
        var allIntro = introImg[c];
        var jpgSrc = allIntro.getAttribute('data-src')
        introPaths.push("'"+jpgSrc+"'")
      }
      // logo
      var logoImg = dom.window.document.getElementsByClassName('logo');
      var logoPaths = [];
      for (var l = 0; l < logoImg.length; l++) {
        var allLogo = logoImg[l];
        var svgSrc = allLogo.getAttribute('src')
        logoPaths.push("'"+svgSrc+"'")
      }
      // combine all arrays into one big array
      var cache = videoPaths.concat(posterPaths, picPaths, introPaths, logoPaths);
      // find and replace a string in the service worker js with all cache
      return gulp.src(inputMaster)
        .pipe(replace(/'#v@cache@';/g, '['+cache+'];'))
        .pipe(gulp.dest(outputMaster))
    })
});

// minify all service worker
gulp.task("min:tag1", function(){
  return gulp.src(inputTag1)
          .pipe(uglify())
          .pipe(gulp.dest(outputTag1))
});

gulp.task("min:tag2", function(){
  return gulp.src(inputTag2)
          .pipe(uglify())
          .pipe(gulp.dest(outputTag2))
});

gulp.task("min:tag3", function(){
  return gulp.src(inputTag3)
          .pipe(uglify())
          .pipe(gulp.dest(outputTag3))
});

gulp.task("min:master", function(){
  return gulp.src(inputMaster)
          .pipe(uglify())
          .pipe(gulp.dest(outputMaster))
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