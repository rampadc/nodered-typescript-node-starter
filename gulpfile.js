const del = require('del');
const ts = require('gulp-typescript');
const { src, dest, series, parallel } = require('gulp');
const tsProject = ts.createProject('tsconfig.json');

function cleanTask() {
  return del('dist/**');
}

function createTs() {
  return tsProject.src().pipe(tsProject()).js.pipe(dest('dist'));
}

function copyHtml() {
  return src(['src/*.html']).pipe(dest('dist'));
}

function copyIcons() {
  return src(['src/icons/**']).pipe(dest('dist/icons'));
}

exports.clean = cleanTask;
exports.default = series(cleanTask, parallel(copyHtml, copyIcons, createTs));
