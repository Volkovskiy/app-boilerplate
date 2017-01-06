var gulp = require('gulp'),
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
 	webpack = require('webpack-stream'),
	babel = require('babel-loader'),
	styleInject = require("gulp-style-inject"),
    debug = require("gulp-debug"),
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
	return gulp.src('app/sass/main.sass')
		.pipe(debug({title: 'sass'}))
		.pipe(sass({
			includePaths: bourbon.includePaths
		}).on('error', sass.logError))
		.pipe(rename({
			suffix: '.min',
			prefix: ''
		}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
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
	}, 500)

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
		.pipe(webpack({
			output: {
				filename: 'common.js'
			},
			module: {
				loaders: [{
					loader: 'babel',
					query: {
						presets: ['es2015']
					}
				}]
			},
				resolve: {
					extensions: ['', '.js']
				}
			}
		))
		.pipe(gulp.dest('app/js'));
});

gulp.task('watch', ['sass', 'headersass', 'libs', 'es5', 'browser-sync'], function() {
	gulp.watch('app/header.sass', ['headersass']);
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/js/**/*.js', ['es5']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
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

gulp.task('build', ['removedist', 'imagemin', 'headersass', 'sass', 'libs'], function() {

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
