var gulp = require('gulp'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    gprint = require('gulp-print'),
    //notify = require('gulp-notify'),
    babel = require('gulp-babel'),
    gWatch = require('gulp-watch'),
    qunit = require('gulp-qunit');

gulp.task('default', ["watchSrc", "watchTest"]);

gulp.task('watchSrc', function () {
  var trueBase = "src/es6/";
  var buildLocation = "lib"
  return gWatch(trueBase + '/**/*.js', function(obj){
      if (obj.event === 'change' || obj.event === 'add') {
          gulp.src(obj.path)
              .pipe(plumber({
                  errorHandler: function (error) { /* elided */console.log(error); }
              }))
              .pipe(babel({sourceMaps: true, compact: false}))
              .pipe(rename(function (path) {
                  path.basename = path.basename.replace(/-es6$/, '');
              }))
              .pipe(gulp.dest(buildLocation))
              .pipe(gprint(function(filePath){ return "File processed: " + filePath; }));
      }
  });
});

gulp.task('watchTest', function() {
  var trueBase = "tests/";
  var buildLocation = "tests/"
  return gWatch(trueBase + '/**/*-es6.js', function(obj){
      if (obj.event === 'change' || obj.event === 'add') {
          gulp.src(obj.path)
              .pipe(plumber({
                  errorHandler: function (error) { /* elided */console.log(error); }
              }))
              .pipe(babel({sourceMaps: true, compact: false}))
              .pipe(rename(function (path) {
                  path.basename = path.basename.replace(/-es6$/, '');
              }))
              .pipe(gulp.dest(buildLocation))
              .pipe(gprint(function(filePath){ return "File processed: " + filePath; }));
      }
  });
});

gulp.task('test', ['jQTemplate']);

gulp.task('jQTemplate', function() {
    return gulp.src('./tests/tests.html')
        .pipe(qunit());
});
