// init development & production modes
module.exports = isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

//init packages
const gulp = require('gulp'),
	sass = require('gulp-sass'),
	uncss = require('gulp-uncss'),
	browserSync = require('browser-sync'),
	cleanCSS = require('gulp-clean-css'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	webpackStream = require('webpack-stream'),
	styleInject = require("gulp-style-inject"),
	debug = require("gulp-debug"),
	sourcemaps = require('gulp-sourcemaps'),
	gulpif = require("gulp-if"),
	bourbon = require('node-bourbon'),
	webpackConfig = require('./webpack.config');

const uncssConfig = {
        html: ['app/*.html'],
        ignore: ['h1']
    };

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
	return gulp.src('./src/sass/main.sass')
		.pipe(gulpif(isDevelopment, sourcemaps.init()))
		.pipe(debug({title: 'sass'}))
		.pipe(sass({
			includePaths: bourbon.includePaths
		}).on('error', sass.logError))
		.pipe(gulpif(!isDevelopment, uncss(uncssConfig)))
        .pipe(cleanCSS())
		.pipe(autoprefixer(['last 15 versions']))
    	.pipe(gulpif(isDevelopment, sourcemaps.write()))
		.pipe(gulp.dest('./app/css'))
        .pipe(debug({title: 'css'}))
		.pipe(browserSync.stream())
});

gulp.task('headersass', () => {
	return gulp.src('./src/sass/header.sass')
		.pipe(sass({
			includePaths: bourbon.includePaths
		}).on('error', sass.logError))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
        .pipe(uncss(uncssConfig))
		.pipe(gulp.dest('./app/css'));
		//.pipe(browserSync.stream())
});

gulp.task('html', () => {
	return gulp.src("./src/*.html")
		.pipe(debug({title: 'html-in'}))
		.pipe(styleInject())
		.pipe(gulp.dest("./app"))
		.pipe(debug({title: 'html-out'}));
});

gulp.task('webpack', () => {
	return gulp.src("./src/js/*.js")
        .pipe(debug({title: 'webpack'}))
		.pipe(webpackStream(webpackConfig))
		.pipe(gulp.dest('./app/js'));
});

gulp.task('watch', ['sass', 'headersass', 'webpack', 'browser-sync', 'html'], () => {
	gulp.watch('./app/css/header.css', ['html', browserSync.reload]);
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

gulp.task('build', ['removedist', 'webpack', 'headersass', 'sass', 'imagemin','html'], () => {
    const buildCss = gulp.src([
		'app/css/fonts.css',
		'app/css/main.css'
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