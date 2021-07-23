const del = require('del');
const gulp = require('gulp');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build_src', () => {
  return gulp.src('./src/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest('./.tmp/src'));
});

gulp.task('build_release', () => {
  return gulp.src('./src/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest('./lib'));
});

gulp.task('clean', function () {
  return del(['.tmp/**/*', 'lib/**/*']);
});
