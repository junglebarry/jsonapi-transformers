const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const ts = require('gulp-typescript');

gulp.task('build_tests', () => {
  return gulp.src('./spec/**/*.spec.ts')
    .pipe(ts({
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      lib: ['es2016'],
      target: 'es5',
    }))
    .pipe(gulp.dest('./dist/out-tsc/spec'));
});

gulp.task('test', ['build', 'build_tests'], () => {
  return gulp.src(['./dist/out-tsc/**/*.spec.js'])
    .pipe(jasmine({
      verbose: false,
      includeStackTrace: true,
    }));
});

gulp.task('build', () => {
  return gulp.src('./src/**/*.ts')
    .pipe(ts({
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      lib: ['es2016'],
      target: 'es5',
    }))
    .pipe(gulp.dest('./dist/out-tsc/src'));
});
