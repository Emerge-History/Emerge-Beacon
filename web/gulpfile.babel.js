'use strict';

import gulp from 'gulp';
import less from 'gulp-less';
// import path from 'path';
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

gulp.task('css-min', ['css'], () => {
    return gulp.src(paths.dev.css)
        //.pipe(concat('all.min.css'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rev())
        .pipe(gulp.dest(paths.dist._css))
        .pipe(rev.manifest())
        .pipe(gulp.dest(paths.dev._rev + '/css'));
});


// fonts
gulp.task('fonts', () => {
    return gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.dev._fonts))
});

gulp.task('fonts-min', ['fonts'], () => {
    return gulp.src(paths.dev.fonts)
        .pipe(gulp.dest(paths.dist._fonts))
});

// html
gulp.task('html', () => {
    return gulp.src(paths.src.html)
        .pipe(gulp.dest(paths.dev._html))
        .pipe(reload({ stream: true }));
});

gulp.task('html-min', ['html'], () => {
    gulp.src([paths.dev.rev, paths.dev.html])
        .pipe(revCollector({ replaceReved: true }))
        // .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.dist._html));
});

// img
gulp.task('img', () => {
    return gulp.src(paths.src.img)
        .pipe(gulp.dest(paths.dev._img))
        .pipe(reload({ stream: true }));
});

gulp.task('img-min', ['img'], () => {
    return gulp.src(paths.dev.img)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dist._img))
});

// js
gulp.task('js', () => {
    return gulp.src(paths.src.js)
        .pipe(gulp.dest(paths.dev._js))
        .pipe(reload({ stream: true }));
});

gulp.task('js-min', ['js'], () => {
    return gulp.src(paths.dev.js)
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(paths.dist._js))
        .pipe(rev.manifest())
        .pipe(gulp.dest(paths.dev._rev + '/js'));
});




// favicon
gulp.task('favicon', () => {
    return gulp.src(paths.src.favicon)
        .pipe(gulp.dest(paths.dev._path))
});

gulp.task('favicon-min', ['favicon'], () => {
    return gulp.src(paths.src.favicon)
        .pipe(gulp.dest(paths.dev._path))
});



// clean
gulp.task('clean', () => {
    return gulp.src(paths.dev._path, {
        read: false
    })
        .pipe(clean());
});
gulp.task('clean-min', () => {
    return gulp.src([paths.dist._path, paths.dist._html], {
        read: false
    })
        .pipe(clean({ force: true }));
});


gulp.task('default', ['dev'], () => {

});

gulp.task('dev', (cb) => {
    runSequence('clean', ['css', 'fonts', 'html', 'img', 'js', 'favicon'], cb);
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

gulp.task('dist', (cb) => {
    runSequence('clean', 'clean-min', 'css-min', 'js-min', ['fonts-min', 'html-min', 'img-min', 'favicon-min'], 'clean', cb);
});