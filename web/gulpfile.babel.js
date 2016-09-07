'use strict';

import gulp from 'gulp';
import less from 'gulp-less';
import path from 'path';
import autoprefixer from 'gulp-autoprefixer';
import minifycss from 'gulp-minify-css';
import browserSync from 'browser-sync';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import notify from 'gulp-notify';
import clean from 'gulp-clean';
import htmlmin from 'gulp-htmlmin';
import plumber from 'gulp-plumber';
import spriter from 'gulp-sprite2';
import imagemin from 'gulp-imagemin';
import rev from 'gulp-rev';
import revCollector from 'gulp-rev-collector';
import runSequence from 'gulp-run-sequence';

import {paths} from './gulpfile.paths';
import {_task} from './gulpfile.task';

const reload = browserSync.reload;





// css
gulp.task('css', () => {
  return gulp.src(paths.src.css)
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.dev._css))
    .pipe(reload({ stream: true }));
});
gulp.task('css-min', ['css'], () => {
  return gulp.src(paths.dev.css)
    //.pipe(concat('wap.min.css'))
    .pipe(minifycss())
    .pipe(rev())
    .pipe(gulp.dest(paths.dist._css))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dev/rev/css'));
});

// html
gulp.task('html', function () {
  return gulp.src(paths.src.html)
    .pipe(gulp.dest(paths.dev._html))
    .pipe(reload({ stream: true }));
});
gulp.task('html-rev', ['html'], function () {
  gulp.src(['./dev/rev/**/*.json', paths.dev.html])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(revCollector({replaceReved: true}))
    .pipe(gulp.dest(paths.dist._html));
});

// img
gulp.task('img', function () {
  return gulp.src(paths.src.img)
    .pipe(gulp.dest(paths.dev._img))
    .pipe(reload({ stream: true }));
});
gulp.task('img-min', ['img'], function () {
  return gulp.src(paths.dev.img)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist._img))
});

// js
gulp.task('js', function () {
  return gulp.src(paths.src.js)
    .pipe(gulp.dest(paths.dev._js))
    .pipe(reload({ stream: true }));
});
gulp.task('js-min', ['js'], function () {
  return gulp.src(paths.dev.js)
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist._js))
});

// favicon
gulp.task('favicon', function () {
  return gulp.src(paths.src.favicon)
    .pipe(gulp.dest(paths.dev._path))
});
gulp.task('favicon-min', ['favicon'], function () {
  return gulp.src(paths.dev.favicon)
    .pipe(gulp.dest(paths.dist._path))
});

// clean
gulp.task('clean', function () {
  return gulp.src(paths.dev._path, {
    read: false
  })
    .pipe(clean());
});


gulp.task('default', ['dev'], function () {
  _task({
    projectName: 'Example'
  })
});

gulp.task('dev', ['css', 'html', 'img', 'js', 'favicon'], function () {
  browserSync({
    files: [
      paths.dev.css,
      paths.dev.html,
      paths.dev.img,
      paths.dev.js
    ],
    server: {
      baseDir: paths.dev._path
    }
  });
  gulp.watch(paths.src.css, ['css']);
  gulp.watch(paths.src.html, ['html']);
  gulp.watch(paths.src.img, ['img']);
  gulp.watch(paths.src.js, ['js']);
});

gulp.task('dist', function (cb) {
  runSequence('css-min', 'img-min', 'js-min', 'favicon-min', 'html-rev', cb);
});