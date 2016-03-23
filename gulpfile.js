const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const shell = require('gulp-shell');

gulp.task('default', ['compile'], function () {
    gulp.src('built/spec/test.js').pipe(jasmine({
        includeStackTrace: true,
        verbose: true
    }));
});

gulp.task('compile', shell.task('tsc'));