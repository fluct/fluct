var babel = require('gulp-babel');
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var register = require('babel-register');

gulp.task('build', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('test', function () {
  return gulp.src('test/**/*.js')
    .pipe(
      mocha({
        compilers: {
          js: register
        }
      })
    );
});
