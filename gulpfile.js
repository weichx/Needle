const gulp = require('gulp');
const jasmine = require('gulp-jasmine');

gulp.task('default', function () {
    gulp.src('build/test.js').pipe(jasmine({
        includeStackTrace: true,
        verbose: true
    }));
});