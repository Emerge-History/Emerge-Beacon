'use strict';

import gulp from 'gulp';
import less from 'gulp-less';
import path from 'path';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import plumber from 'gulp-plumber';
import clean from 'gulp-clean';
import browserSync from 'browser-sync';
import runSequence from 'gulp-run-sequence';
import imagemin from 'gulp-imagemin';
import uglify from 'gulp-uglify';
import rev from 'gulp-rev';
import htmlmin from 'gulp-htmlmin';
import revCollector from 'gulp-rev-collector';
import babel from 'gulp-babel';
import watch from 'gulp-watch';
import usemin from'gulp-usemin';
import {paths} from './gulpfile.paths';
const reload = browserSync.reload;

// css
gulp.task('css', () => {
    return gulp.src(paths.src.css)
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(paths.dev._css))
        .pipe(reload({ stream: true }));
});

// fonts
gulp.task('fonts', () => {
    return gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.dev._fonts))
});

// html
gulp.task('html', () => {
    return gulp.src(paths.src.html)
        .pipe(gulp.dest(paths.dev._html))
        .pipe(reload({ stream: true }));
});

// img
gulp.task('img', () => {
    return gulp.src(paths.src.img)
        .pipe(gulp.dest(paths.dev._img))
        .pipe(reload({ stream: true }));
});

// js
gulp.task('js', () => {
    return gulp.src(paths.src.js)
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(paths.dev._js))
        .pipe(reload({ stream: true }));
});

// favicon
gulp.task('favicon', () => {
    return gulp.src(paths.src.favicon)
        .pipe(gulp.dest(paths.dev._path))
});

// watch
gulp.task('watch-dev', () => {
    gulp.watch(paths.src.html, ['html']);
    gulp.watch(paths.src.img, ['img']);
    gulp.watch(paths.src.js, ['js']);
    gulp.watch(paths.src.css, ['css']);
});

// clean
gulp.task('clean-all', () => {
    return gulp.src([paths.dev._path, paths.dist._path, paths.dist._html, paths.temp._path], {
        read: false
    })
        .pipe(clean({ force: true }));
});
gulp.task('clean-dev-temp', () => {
    return gulp.src([paths.dev._path, paths.temp._path], {
        read: false
    })
        .pipe(clean({ force: true }));
});

gulp.task('default', ['dev']);

gulp.task('dev', ['watch-dev'], (cb) => {
    runSequence('clean-all', ['css', 'fonts', 'html', 'img', 'js', 'favicon'], 'watch-dev', cb);
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
});










gulp.task('dist', (cb) => {
runSequence('clean-all', ['css', 'fonts', 'html', 'img', 'js', 'favicon'], 'usemin-temp','usemin','clean-dev-temp', cb);
});



gulp.task('usemin-temp', function () {
    return gulp.src(paths.dev.html)
        .pipe(usemin({
            css: [rev, ()=>{return cleanCSS({ compatibility: 'ie8' })}],
            js: [rev, uglify]
        }))
        .pipe(gulp.dest('temp/'));
});

gulp.task('usemin',function (cb) {
    runSequence('assets-min', ['html-min', 'fonts-min', 'img-min', 'favicon-min'], cb);
});

gulp.task('assets-min', function () {
    return gulp.src(paths.temp.assets)
        .pipe(gulp.dest(paths.dist._path));
});
gulp.task('html-min', function () {
    return gulp.src(paths.temp.html)
        //.pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.dist._html));
});
gulp.task('fonts-min', ['fonts'], () => {
    return gulp.src(paths.dev.fonts)
        .pipe(gulp.dest(paths.dist._fonts))
});
gulp.task('img-min', ['img'], () => {
    return gulp.src(paths.dev.img)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dist._img))
});
gulp.task('favicon-min', ['favicon'], () => {
    return gulp.src(paths.src.favicon)
        .pipe(gulp.dest(paths.dev._path))
});





















