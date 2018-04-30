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
    	.pipe(htmlmin({
    		collapseWhitespace: true
    	}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('js', () => {
	gulp.src('src/js/**/*.*')
		.pipe(uglify())
		.pipe(rename({
        	suffix: ".min"
        }))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('img-build', () => {
	gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/img'));
});

gulp.task('img-build', () => {
	gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(cache(imgmin({
    		interlaced: true
    	})))
		.pipe(gulp.dest('./dist/img'));
});

gulp.task('img', () => {
	gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(gulp.dest('./dist/img'));
});

gulp.task('styles', () => {
	gulp.src('src/less/**/*.less')
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(autoprefixer())
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(rename({
        	suffix: ".min"
        }))
		.pipe(sourcemaps.write())
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
gulp.task('build', ['html', 'js', 'img-build', 'styles']);