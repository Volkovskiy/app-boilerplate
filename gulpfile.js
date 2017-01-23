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


gulp.task(styles);
function styles() {
    return gulp.src('./src/sass/main.sass')
        .pipe(gulpif(isDevelopment, sourcemaps.init()))
        .pipe(debug({title: 'sass'}))
        .pipe(sass({
            includePaths: bourbon.includePaths
        }).on('error', sass.logError))
        .pipe(gulpif(!isDevelopment, uncss({
            html: ['app/*.html'],
        })))
        .pipe(cleanCSS())
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(gulpif(isDevelopment, sourcemaps.write()))
        .pipe(gulp.dest('./app/css'))
        .pipe(debug({title: 'css'}))
        .pipe(browserSync.stream())
}

gulp.task(headersass);
function headersass() {
    return gulp.src('./src/sass/header.sass')
        .pipe(sass({
            includePaths: bourbon.includePaths
        }).on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleanCSS())
        .pipe(gulpif(!isDevelopment, uncss({
            html: ['app/*.html'],
            ignore: ['h1']
        })))
        .pipe(gulp.dest('./app/css'))
}

gulp.task(html);
function html() {
    return gulp.src("./src/*.html")
        .pipe(debug({title: 'html-in'}))
        .pipe(styleInject())
        .pipe(gulp.dest("./app"))
        .pipe(debug({title: 'html-out'}))
		.pipe(browserSync.stream())

}

gulp.task(webpack);
function webpack() {
    return gulp.src("./src/js/*.js")
        .pipe(debug({title: 'webpack'}))
        .pipe(webpackStream(webpackConfig))
        .pipe(gulp.dest('./app/js'))
		.pipe(browserSync.stream())
}

gulp.task(img);
function img() {
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
}

gulp.task(removedist);
function removedist() {
    return del('dist');
}

gulp.task(clearcache);
function clearcache() {
    return cache.clearAll();
}

gulp.task(brsync);
function brsync() {
    browserSync({
        server: {
            baseDir: './app'
        },
        notify: false
    });
    browserSync.watch()
}

gulp.task(watch);
function watch() {
    gulp.watch('./src/sass/header.sass', gulp.series(headersass, html) );
    gulp.watch('./src/sass/**/main.sass', gulp.series(styles));
    gulp.watch('./src/js/**/*.js', gulp.series(webpack));
    gulp.watch('./src/*.html', gulp.series(html));
}

function toDest(done) {
    const buildCss = gulp.src([
        'app/css/main.css'
    ]).pipe(gulp.dest('dist/css'));
    const buildHtml = gulp.src([
        'app/*.html'
    ]).pipe(gulp.dest('dist'));
    const buildFonts = gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'));
    const buildImg = gulp.src('app/img/**/*').pipe(gulp.dest('dist/img'));
    const buildJs = gulp.src('app/js/*.js').pipe(gulp.dest('dist/js'));
    done()
}

gulp.task('bundle', gulp.parallel(webpack, styles, img, gulp.series(headersass, html)));
gulp.task('default', gulp.series('bundle', gulp.parallel(watch, brsync)));
gulp.task('build', gulp.series(removedist, 'bundle', toDest));
