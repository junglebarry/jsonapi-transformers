const del = require('del');
const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

const tsSpec = {
  sourceMap: true,
  declaration: true,
  module: 'commonjs',
  moduleResolution: 'node',
  emitDecoratorMetadata: true,
  experimentalDecorators: true,
  lib: [
    'es2016',
  ],
  target: 'es5',
};

gulp.task('build_tests', () => {
  return gulp.src('./spec/**/*.ts')
    .pipe(ts(tsSpec))
    .pipe(gulp.dest('./.tmp/spec'));
});

gulp.task('build_src', () => {
  return gulp.src('./src/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest('./.tmp/src'));
});

gulp.task('test', gulp.series('build_src', 'build_tests', () => {
  return gulp.src(['./.tmp/**/*.spec.js'])
    .pipe(jasmine({
      verbose: false,
      includeStackTrace: true,
    }));
}));

gulp.task('build_release', () => {
  return gulp.src('./src/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest('./lib'));
});

gulp.task('test:watch', () => {
  gulp.watch('src/**/*.ts', ['test']);
  gulp.watch('spec/**/*.ts', ['test']);
});

gulp.task('clean', function () {
  return del(['.tmp/**/*', 'lib/**/*']);
});
