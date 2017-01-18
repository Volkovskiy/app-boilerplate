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
	libs = require('./src/js/libs');

//init gulp tasks
gulp.task('browser-sync', () => {
	browserSync({
		server: {
			baseDir: './app'
		},
		notify: false
	});
});

gulp.task('sass', () => {
	let pipeline = gulp.src(['./src/sass/fonts.sass', './src/sass/main.sass']);
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
		.pipe(gulp.dest('./app/css'))
        .pipe(debug({title: 'css'}))
		.pipe(browserSync.stream())
});

gulp.task('headersass', () => {
	return gulp.src('./src/sass/header.sass')
		.pipe(sass({
			includePaths: bourbon.includePaths
		}).on('error', sass.logError))
		.pipe(rename({
			suffix: '.min',
			prefix: ''
		}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('./app/css'))
		.pipe(browserSync.stream())
});

gulp.task('html', () => {
	return gulp.src("./src/*.html")
		.pipe(debug({title: 'html-in'}))
		.pipe(styleInject())
		.pipe(gulp.dest("./app"))
		.pipe(debug({title: 'html-out'}));
});

gulp.task('libs', () => {
	return gulp.src(libs)
        .pipe(debug({title: 'libs'}))
		.pipe(concat('libs.min.js'))
		.pipe(isDevelopment ? debug() : uglify())
		.pipe(gulp.dest('app/js'));
});

gulp.task('webpack', () => {
	return gulp.src("./src/js/*.js")
        .pipe(debug({title: 'webpack'}))
		.pipe(webpackStream(webpackConfig))
		.pipe(gulp.dest('./app/js'));
});

gulp.task('watch', ['sass', 'headersass', 'libs', 'webpack', 'browser-sync', 'html'], () => {
	gulp.watch('./app/css/header.min.css', ['html', browserSync.reload]);
	gulp.watch('./src/sass/header.sass', ['headersass']);
	gulp.watch('./src/sass/**/*.sass', ['sass']);
	gulp.watch('./src/js/**/*.js', ['webpack', browserSync.reload]);
	gulp.watch('./src/*.html', ['html', browserSync.reload]);
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

gulp.task('build', ['removedist', 'webpack', 'imagemin', 'headersass', 'sass', 'libs', 'html'], () => {
    const buildCss = gulp.src([
		'app/css/fonts.min.css',
		'app/css/main.min.css'
	]).pipe(gulp.dest('dist/css'));

	const buildHtml = gulp.src([
		'app/*.html'
	]).pipe(gulp.dest('dist'));

	const buildFonts = gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'));

	const buildJs = gulp.src('app/js/*.js').pipe(gulp.dest('dist/js'));

});

gulp.task('clearcache', () => {
	return cache.clearAll();
});

gulp.task('default', ['watch']);


