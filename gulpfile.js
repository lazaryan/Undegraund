const gulp          = require('gulp');
const htmlmin		= require('gulp-htmlmin');
const uglify		= require('gulp-uglify-es').default;
const gulpif 		= require('gulp-if');
const imagemin 		= require('gulp-imagemin');
const rename        = require('gulp-rename');
const less 			= require('gulp-less');
const sourcemaps    = require('gulp-sourcemaps');
const autoprefixer  = require('gulp-autoprefixer');
const cleanCSS 		= require('gulp-clean-css');
const imgmin 		= require('gulp-imagemin');
const cache 		= require('gulp-cache');
const browserSync   = require('browser-sync');

const IsDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV ==='production';

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

gulp.task('html', () => {
    gulp.src('src/**/*.+(html|php)')
    	.pipe(gulpif(IsDevelopment, htmlmin({
    		collapseWhitespace: true
    	})))
        .pipe(gulp.dest('./dist'));
});

gulp.task('js', () => {
	gulp.src('src/js/**/*.*')
		.pipe(gulpif(IsDevelopment, uglify()))
		.pipe(rename({
        	suffix: ".min"
        }))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('img', () => {
	gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(gulpif(IsDevelopment, imgmin({
    		interlaced: true
    	})))
		.pipe(gulp.dest('./dist/img'));
});

gulp.task('styles', () => {
	gulp.src('src/less/**/*.less')
		.pipe(gulpif(!IsDevelopment, sourcemaps.init()))
		.pipe(less())
		.pipe(autoprefixer())
		.pipe(gulpif(IsDevelopment, cleanCSS({compatibility: 'ie8'})))
		.pipe(rename({
        	suffix: ".min"
        }))
		.pipe(gulpif(!IsDevelopment, sourcemaps.write()))
		.pipe(gulp.dest('./dist/css'));  
});

// Отслеживание изменений в файлах, нужно только при локальной разработке
gulp.task('watch', () => {
    gulp.watch('src/less/**/*.less', ['styles']);
    gulp.watch('src/**/*.+(html|php)', ['html']);
    gulp.watch('src/img/**/*.+(png|jpg|jpeg|gif|svg)', ['img']);
    gulp.watch('src/js/**/*.js', ['js']);
});

gulp.task('default', ['html', 'js', 'img', 'styles','livereload', 'watch']);
gulp.task('prod', ['html', 'js', 'img', 'styles']);