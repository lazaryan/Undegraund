"use strict";
/*общие*/
const gulp          = require('gulp');
const browserSync   = require('browser-sync');
const gulpif        = require('gulp-if');
const plumber       = require('gulp-plumber');
const rename        = require('gulp-rename');
const combine       = require('stream-combiner2').obj;

/*styles*/
const less          = require('gulp-less');
const autoprefixer  = require('gulp-autoprefixer');
<<<<<<< HEAD
const sourcemaps    = require('gulp-sourcemaps');
const csso          = require('gulp-csso');

/*js*/
const uglify        = require('gulp-uglify-es').default;
=======
const cleanCSS 		= require('gulp-clean-css');
const imgmin 		= require('gulp-imagemin');
const cache 		= require('gulp-cache');
const browserSync   = require('browser-sync');
const csso          = require('gulp-csso');
const plumber       = require('gulp-plumber');
>>>>>>> #3

/*images*/
const imgmin        = require('gulp-imagemin');

/*html*/
const htmlmin       = require('gulp-htmlmin');
const fileinclude   = require('gulp-file-include')
//const useref        = require('gulp-useref');

// Автоперезагрузка при изменении файлов в папке `dist`:
// Принцип: меняем файлы в `/src`, они обрабатываются и переносятся в `dist` и срабатывает автоперезагрузка.

const IsDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV ==='development';

// Это таск нужен только при локальной разработке.
gulp.task('livereload', () => {
    browserSync.create();

    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        files: [
            'dist/**/*.*'
        ]
    });
});

gulp.task('styles', () => {
    gulp.src('src/less/**/[^_]*.less')
        .pipe(plumber())
        .pipe(gulpif(IsDevelopment, sourcemaps.init()))
        .pipe(less())
        .pipe(autoprefixer(['last 50 versions']))
        .pipe(gulpif(IsDevelopment, sourcemaps.write()))
        .pipe(gulpif(!IsDevelopment, csso({
            restructure: true,
            sourceMap: true,
            debug: true
        })))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('img', () => {
    gulp.src('src/img/**/*.*')
        .pipe(gulpif(!IsDevelopment, imgmin({
            interlaced: true
        })))
        .pipe(gulp.dest('./dist/img'));
});

<<<<<<< HEAD
gulp.task('js', () => {
    gulp.src('src/js/**/*.*')
        .pipe(plumber())
        .pipe(gulpif(!IsDevelopment, uglify()))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('html', () => {
    gulp.src('src/[^_]*.+(html|php)')
        .pipe(fileinclude())
        .pipe(gulpif(!IsDevelopment, htmlmin({
            collapseWhitespace: true
        })))
        .pipe(gulp.dest('./dist'));
=======
gulp.task('styles', () => {
	gulp.src('src/less/**/*.less')
        .pipe(plumber())
		.pipe(gulpif(!IsDevelopment, sourcemaps.init()))
		.pipe(less())
		.pipe(autoprefixer(['last 15 versions']))
        .pipe(gulpif(IsDevelopment, csso({
            restructure: true,
            sourceMap: true,
            debug: true
        })))
		.pipe(rename({
        	suffix: ".min"
        }))
		.pipe(gulpif(!IsDevelopment, sourcemaps.write()))
		.pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.reload({stream: true}));  
>>>>>>> #3
});

// Отслеживание изменений в файлах, нужно только при локальной разработке
gulp.task('watch', () => {
    gulp.watch('src/less/**/*.less', ['styles']);
    gulp.watch('src/**/*.+(html|php)', ['html']);
    gulp.watch('src/img/**/*.*', ['img']);
    gulp.watch('src/js/**/*.*', ['js']);
});

gulp.task('default', ['styles', 'img','html', 'js', 'livereload', 'watch']);
gulp.task('prod', ['styles', 'html', 'img', 'js']);
