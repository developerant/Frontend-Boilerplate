/**
 * GULPFILE - By Architect
 */

var $           = require('gulp-load-plugins')(),
    gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    del         = require('del'),
    argv        = require('yargs').argv,
    runSequence = require('run-sequence')

    // Environments
    production = !!(argv.production), // true if --production flag is used

    // Base Paths
    basePaths = {
        src: 'assets/',
        dest: 'public/'
    },

    onError = function (error) {
        gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
        this.emit('end');
    }

/*----------------------------------------------------*\
     SASS - LIBSASS COMPILE, MINIFY, OUTPUT
\*----------------------------------------------------*/
gulp.task('styles', function() {

    gulp.src(basePaths.src + 'scss/**/*.scss')
    .pipe($.sass({
      errLogToConsole: true,
      includePaths: ['scss']
    }))
    .pipe($.plumber())
    .pipe($.autoprefixer({
        browsers: ['last 4 versions']
    }))
    .pipe(gulp.dest(basePaths.dest + '_css'))
    .pipe($.minifyCss({ keepSpecialComments: 0 }))
    .pipe($.rename({ extname: '.min.css' }))
    .pipe(gulp.dest(basePaths.dest + '_css'));

});



/*----------------------------------------------------*\
     SCRIPTS - COMPILE, MINIFY, OUTPUT
     Generates both minified and unminifed versions
\*----------------------------------------------------*/
gulp.task('scripts', function() {
    var gulpTasks = gulp.src(basePaths.src + 'js/src/*.js')
        .pipe($.plumber() );

    if ( ! production ) {
        gulpTasks = gulpTasks.pipe($.jshint() )
            .pipe($.jshint.reporter('default') );
    }

    return gulpTasks
        .pipe( $.concat('scripts.js') )
        .pipe( gulp.dest(basePaths.dest + '_js') )
        .pipe( $.uglify() )
        .pipe( $.rename({ suffix: '.min' }) )
        .pipe(gulp.dest(basePaths.dest + '_js'))
});

/*------------------------------------------------------*\
     INLINE SVG - CREATES <SYMBOL> BLOCK OF SVG GOODNESS
\*------------------------------------------------------*/
gulp.task('svgstore', function () {
    return gulp.src(basePaths.src + 'img/svg/*.svg')
        .pipe($.svgmin())
        .pipe($.svgstore())
        .pipe(gulp.dest(basePaths.dest + '_img/svg'))
});

// Inject SVG Block into DOM
gulp.task('inject', function () {
    var symbols = gulp
        .src(basePaths.dest + '_img/svg/svg.svg')

    function fileContents (filePath, file) {
            return file.contents.toString();
    }

    return gulp
        .src('public/index.php')
        .pipe($.inject(symbols, { transform: fileContents }))
        .pipe(gulp.dest('public'));
});

// Create PNG sprite fallback for no-svg browsers, IE8 etc.
gulp.task('svgfallback', function () {
    return gulp
        .src(basePaths.src + '/img/svg/*.svg', {base: basePaths.src + 'img/svg/'})
        .pipe($.svgfallback())
        .pipe(gulp.dest(basePaths.dest + '_img/png/sprite'))
});

/*------------------------------------------*\
     COPY FONTS
\*------------------------------------------*/
gulp.task('fonts', function () {
    return gulp.src(basePaths.src + 'fonts/*')
        .pipe(gulp.dest(basePaths.dest + '_fonts'))
});

/*------------------------------------------*\
     COPY IMAGES
\*------------------------------------------*/
gulp.task('images', function () {
    return gulp.src(basePaths.src + 'img/**/*')
        .pipe(gulp.dest(basePaths.dest + '_img'))
});

/*--------------------------------------------------*\
     MODERNIZR
     MOVE FROM ASSETS INTACT (BOWER v. NOT AVAILABLE)
\*--------------------------------------------------*/
gulp.task('modernizr', function () {
    return gulp.src(basePaths.src + 'js/vendor/modernizr-custom.js')
        .pipe(gulp.dest(basePaths.dest + '_js'))
});

/*-----------------------------------------*\
    BOWER/VENDOR SCRIPTS
\*-----------------------------------------*/
gulp.task('vendorScripts', function() {
    var bower = [
        basePaths.dest + '_bower-packages/jquery/dist/jquery.min.js',
    ]
    return gulp.src(bower)
        .pipe($.concat('vendor.js'))
        .pipe($.uglify() )
        .pipe(gulp.dest(basePaths.dest + '_js'))
});

gulp.task('bower', function() {
    return $.bower()
        .pipe(gulp.dest(basePaths.dest + '_bower-packages'))
 });

/*-----------------------------------------*\
     CLEAN OUTPUT DIRECTORIES
\*-----------------------------------------*/
gulp.task('clean', function() {
    del(['public/_bower-packages',
         'public/_css',
         'public/_js',
         'public/_img/',
         '!public/_img/png*',
         'public/_fonts',
         ],
         { read: false })
});

/*---------------------------------------------*\
     WATCHING...
\*---------------------------------------------*/
gulp.task('watch', function() {
    gulp.watch('assets/scss/**/*.scss', ['styles']);
    gulp.watch('assets/js/*.js', ['scripts']);
    gulp.watch('assets/img/*', ['images']);
});

/*---------------------------------------------*\
     DEFAULT TASK
\*---------------------------------------------*/

gulp.task('default', ['clean'], function(cb) {
  if ( ! production )
    runSequence( 'bower', 'styles', 'vendorScripts', 'scripts', 'modernizr', 'images', 'fonts', ['svgstore'], 'inject', 'svgfallback', cb);
  else
    runSequence( 'bower', 'styles', 'vendorScripts', 'scripts', 'modernizr', 'images', 'fonts', ['svgstore'], 'inject', cb);
});
