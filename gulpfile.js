const del = require('del');
const ts = require('gulp-typescript');
const { src, dest, series, parallel, watch, task } = require('gulp');

const shell = require('gulp-shell');
const tsProject = ts.createProject('tsconfig.json');

task('clean', function() {
  return del('dist/**');
});


task('compile', function() {
  return tsProject.src().pipe(tsProject()).js.pipe(dest('dist'));
});

task('copy-html', function() {
  return src(['src/*.html']).pipe(dest('dist'));
});

task('copy-icons', function() {
  return src(['src/icons/**']).pipe(dest('dist/icons'));
});

task('build', function(done) {
  return parallel('copy-html', 'copy-icons', 'compile')(done);
});

task('node-red-restart', function(done) {
  return shell.task('docker-compose down && docker-compose up -d')(done);
});

task('node-red-down', function(done) {
  return shell.task('docker-compose down')(done);
});

task('default', function(done) {
  return series('clean', 'watch')(done);
});

task('watch', function() {
  watch('src/**/*', function(done) {
    return series('clean', 'build', 'node-red-restart')(done);
  });
});
