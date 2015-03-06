var g = require('gulp');
var $ = require('gulp-load-plugins')();

var gulpFilter = require('gulp-filter');
var mainBowerFiles = require('main-bower-files');
var del = require('del');


// local server
g.task("connect", function(){
  g.src('./')
    .pipe($.webserver({
      livereload: true,
      port: 3000,
      fallback: 'index.html'
    }));
});

// open
g.task("open", function(){
  options = {
    url: "http://localhost:3000",
    app: "Google Chrome"
  };
  g.src("./index.html")
    .pipe($.open("", options));
});


g.task('clear-libs', function() {
  del.sync('lib/');
});

g.task('bower', ['clear-libs'], function() {
  var jsFilter = gulpFilter('**/*.js');
  var cssFilter = gulpFilter('**/*.css');

  return g.src(mainBowerFiles())
    .pipe(jsFilter)
    .pipe(g.dest('lib/js'))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(g.dest('lib/css'));
});


// 開発時に使うタスク
g.task("default", function(){
  g.start("connect", "open");
});
