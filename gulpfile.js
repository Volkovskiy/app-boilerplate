// init development & production modes
module.exports = isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

//init packages
const gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	webpackStream = require('webpack-stream'),
	styleInject = require("gulp-style-inject"),
	debug = require("gulp-debug"),
	sourcemaps = require('gulp-sourcemaps'),
	bourbon = require('node-bourbon'),
	webpackConfig = require('./webpack.config'),
	libs = require('./libs');

//init gulp tasks
gulp.task('browser-sync', () => {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('sass', () => {
	let pipeline = gulp.src('app/sass/*.sass');
		if (isDevelopment) {
            pipeline.pipe(sourcemaps.init())
		}

		pipeline = pipeline

		.pipe(debug({title: 'sass'}))
		.pipe(sass({
			includePaths: bourbon.includePaths
		}).on('error', sass.logError))
        .pipe(cleanCSS())
		.pipe(autoprefixer(['last 15 versions']))
        .pipe(rename({
            suffix: '.min',
            prefix: ''
        }));
    if (isDevelopment) {
        pipeline.pipe(sourcemaps.write())
    }
		return pipeline
		.pipe(gulp.dest('app/css'))
        .pipe(debug({title: 'css'}))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('html', function () {
	return setTimeout(function () {
		return	gulp.src("./app/html/*.html")
			.pipe(styleInject({title: 'file'}))
            .pipe(debug())
			.pipe(gulp.dest("./app"));
	}, 1000)

});

gulp.task('headersass', ['html'], () => {
	return gulp.src('app/header.sass')
		.pipe(sass({
			includePaths: bourbon.includePaths
		}).on('error', sass.logError))
		.pipe(rename({
			suffix: '.min',
			prefix: ''
		}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('app'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('libs', () => {
	return gulp.src(libs)
        .pipe(debug({title: 'libs'}))
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'));
});

gulp.task('webpack', () => {
	return gulp.src("app/js/src/*.js")
        .pipe(debug({title: 'ES6'}))
		.pipe(webpackStream(webpackConfig))
		.pipe(gulp.dest('app/js'));
});

gulp.task('watch', ['sass', 'headersass', 'libs', 'webpack', 'browser-sync'], () => {
	gulp.watch('app/header.sass', ['headersass']);
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/js/src/**/*.js', ['webpack', browserSync.reload]);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('imagemin', () => {
	return gulp.src('app/img/**/*')
        .pipe(debug({title: 'img'}))
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('removedist', () => {
	return del.sync('dist');
});

gulp.task('build', ['removedist', 'webpack', 'imagemin', 'headersass', 'sass', 'libs'], () => {
    const buildCss = gulp.src([
		'app/css/fonts.min.css',
		'app/css/main.min.css'
	]).pipe(gulp.dest('dist/css'));

	const buildFiles = gulp.src([
		'app/index.html'
	]).pipe(gulp.dest('dist'));

	const buildFonts = gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'));

	const buildJs = gulp.src('app/js/*.js').pipe(gulp.dest('dist/js'));

});

gulp.task('clearcache', () => {
	return cache.clearAll();
});

gulp.task('default', ['watch']);


