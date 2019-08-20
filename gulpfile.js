const del = require('del');
const ts = require('gulp-typescript');
const { src, dest, series, parallel, watch, task } = require('gulp');

const shell = require('gulp-shell');
const tsProject = ts.createProject('tsconfig.json');
const browserSync = require('browser-sync').create();

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

task('browser_sync', function(done) {
  browserSync.init({
    proxy: "localhost:1880",
    ws: true
  });
  done();
});

task('reload', function(done) {
  // Delay is used to account for any delays from Docker container re-binding to port
  setTimeout(() => {
    browserSync.reload();
  }, 2000);
  done();
});

task('default', function(done) {
  return parallel('browser_sync', 'watch')(done);
});

task('watch', function() {
  watch('src/**/*', function(done) {
    return series('clean', 'build', 'node-red-restart', 'reload')(done);
  });
});
