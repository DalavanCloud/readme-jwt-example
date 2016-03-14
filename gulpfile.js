var gulp = require('gulp');
var babel = require('gulp-babel');

var srcDir = 'src/';
var jsGlob = srcDir + 'js/**/*.js';
var viewsGlob = srcDir + 'views/**/*.jade';

var distDir = 'dist/';
var jsDest = distDir + 'js';
var viewwsDest = distDir + 'views';

gulp.task('js', function () {
  return gulp.src(jsGlob)
    .pipe(babel())
    .pipe(gulp.dest(jsDest));
});

gulp.task('views', function () {
  return gulp.src(viewsGlob)
    .pipe(gulp.dest(viewwsDest));
});

gulp.task('build', ['js', 'views']);

gulp.task('watch', ['build'], function () {
  gulp.watch(jsGlob, ['js']);
  gulp.watch(viewsGlob, ['views'])
});

gulp.task('default', ['build']);
