const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const fileinclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();

// Compile sass into CSS & auto inject into browsers
gulp.task('sass', function() {
    return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'])
    .pipe(sass({
        outputStyle: 'compressed'
    }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest("build/css/"))
    .pipe(browserSync.stream());
});

// Move the javascript files into our /src/js folder
gulp.task('js', function() {
    return gulp.src(['src/templates/components/Atoms/**/*.js', 'src/templates/components/Molecules/**/*.js', 'src/templates/components/Organisms/**/*.js', 'node_modules/bootstrap/dist/js/*.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/tether/dist/js/tether.min.js'])
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest("build/js"))
    .pipe(browserSync.stream());
});

// Static Server + watching scss/html/js files
gulp.task('serve', ['sass', 'js'], function() {
    gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/templates/components/Atoms/**/*.scss', 'src/templates/components/Molecules/**/*.scss', 'src/templates/components/Organisms/**/*.scss'], ['sass']).on('change', browserSync.reload);
    gulp.watch(['src/templates/components/Atoms/**/*.js', 'src/templates/components/Molecules/**/*.js', 'src/templates/components/Organisms/**/*.js', 'node_modules/bootstrap/dist/js/*.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/tether/dist/js/tether.min.js'], ['js']).on('change', browserSync.reload);
    gulp.watch(["src/templates/components/Templates/*.html", "src/templates/components/Atoms/**/*.html", "src/templates/components/Molecules/**/*.html", "src/templates/components/Organisms/**/*.html"]).on('change', browserSync.reload);
});

gulp.task('fileinclude', function() {
    gulp.src(['src/templates/components/Templates/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./build'))
});

gulp.task('copyImages', function () {
    gulp.src('src/assets/**/*')
    .pipe(gulp.dest('./build/assets'))
});

gulp.task('default', ['fileinclude', 'js', 'copyImages', 'serve'], function () {
    // serve files from the build folder
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
    // watch files and run tasks
    gulp.watch(["src/templates/components/Templates/*.html", "src/templates/components/Atoms/**/*.html", "src/templates/components/Molecules/**/*.html", "src/templates/components/Organisms/**/*.html", "node_modules/bootstrap/scss/bootstrap.scss", "src/scss/**/*.scss", "src/js/**/*.js"], ['fileinclude', 'copyImages']);
});
