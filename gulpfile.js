module.exports = isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
const webpackConfig = require('./webpack.config');

const gulp = require('gulp'),
	gutil = require('gulp-util'),
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
	bourbon = require('node-bourbon');


gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('sass', function() {
	var pipeline = gulp.src('app/sass/*.sass');
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

gulp.task('headersass', ['html'], function() {
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

gulp.task('libs', function() {
	return gulp.src([
			//'app/libs/jquery/dist/jquery.js',
			//'app/libs/react/react.js'
		])
        .pipe(debug({title: 'libs'}))
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'));
});

gulp.task('es5', function() {
	return gulp.src("app/js/src/*.js")
        .pipe(debug({title: 'ES6'}))
		.pipe(webpackStream(webpackConfig))
        //.pipe(uglify())
		.pipe(gulp.dest('app/js'));
});

gulp.task('watch', ['sass', 'headersass', 'libs', 'es5', 'browser-sync'], function() {
	gulp.watch('app/header.sass', ['headersass']);
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/js/**/*.js', ['es5', browserSync.reload]);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
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

gulp.task('removedist', function() {
	return del.sync('dist');
});

gulp.task('build', ['removedist', 'es5', 'imagemin', 'headersass', 'sass', 'libs'], function() {
    var buildCss = gulp.src([
		'app/css/fonts.min.css',
		'app/css/main.min.css'
	]).pipe(gulp.dest('dist/css'));

	var buildFiles = gulp.src([
		'app/index.html'
	]).pipe(gulp.dest('dist'));

	var buildFonts = gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src('app/js/common.js').pipe(gulp.dest('dist/js'));

});

gulp.task('clearcache', function() {
	return cache.clearAll();
});

gulp.task('default', ['watch']);


