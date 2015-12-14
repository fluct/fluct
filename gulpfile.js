var babel = require('gulp-babel');
var rename = require('gulp-rename');
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var register = require('babel-register');

gulp.task('build', ['build-bin', 'build-lib']);

gulp.task('build-bin', function() {
  return gulp.src('src/fluct.js')
    .pipe(babel())
    .pipe(rename('fluct'))
    .pipe(gulp.dest('bin'));
});

gulp.task('build-lib', function() {
  return gulp.src(['src/**/*.js', '!src/fluct.js'])
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
