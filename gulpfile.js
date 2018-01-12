/**
 * Gulp
 */

var pkg                     	= require('./package.json');
var projectURL              	= 'http://gutenkit.local';
var styleWatchFile   		= './block/style.scss';
var editorWatchFile   		= './block/editor.scss';
var scriptWatchFiles   		= [ './block/block.build.js', './block/frontend.js' ];
var PHPWatchFiles    		= [ './**/*.php' ];

var buildFiles      	    	= ['./**', '!dist/', '!wordpress.org/**/*', '!wordpress.org/**', '!wordpress.org/', '!sublime-project',  '!.gitattributes', '!.csscomb.json', '!node_modules/**', '!/**/node_modules/**', '!/**/**/**/.sublime-project', '!/**/.sublime-workspace', '!/**/.block.jsx', '!*.sublime-project', '!package.json', '!/**/package.json', '!/**/package-lock.json', '!/**/webpack.config.js', '!/**/*.sublime-project', '!/**/*.jsx', '!/**/gulpfile.js', '!/**/*.sublime-workspace', '!/**/frontend.js', '!/**/style.css', '!/**/style.scss', '!/**/editor.css', '!/**/editor.scss', '!/**/block.build.js', '!gulpfile.js', '!assets/scss/**', '!*.json', '!*.map', '!*.md', '!*.xml', '!*.sublime-workspace', '!*.sublime-gulp.cache', '!*.log', '!*.gitattributes', '!*.DS_Store','!*.gitignore', '!TODO', '!*.git' ];
var buildDestination        	= './dist/'+ pkg.slug +'/';
var distributionFiles       	= './dist/'+ pkg.slug +'/**/*';

var text_domain             	= '@@textdomain';
var destFile                	= pkg.slug+'.pot';
var packageName             	= pkg.title;
var bugReport               	= pkg.author_uri;
var lastTranslator          	= pkg.author;
var team                    	= pkg.author_shop;
var translatePath           	= './languages';
var translatableFiles       	= ['./**/*.php'];

const AUTOPREFIXER_BROWSERS = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
];

/**
 * Load Plugins.
 */
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var minifycss    = require('gulp-uglifycss');
var autoprefixer = require('gulp-autoprefixer');
var cleaner      = require('gulp-clean');
var copy         = require('gulp-copy');
var sort         = require('gulp-sort');
var rename       = require('gulp-rename');
var notify       = require('gulp-notify');
var replace      = require('gulp-replace-task');
var runSequence  = require('run-sequence');
var lineec       = require('gulp-line-ending-corrector');
var csscomb      = require('gulp-csscomb');
var sourcemaps   = require('gulp-sourcemaps');
var browserSync  = require('browser-sync').create();
var cache        = require('gulp-cache');
var uglify       = require('gulp-uglify');
var wpPot        = require('gulp-wp-pot');
var zip          = require('gulp-zip');
var reload       = browserSync.reload;

/**
 * Tasks
 */
gulp.task('clear', function () {
	cache.clearAll();
});

// gulp.task( 'browser_sync', function() {
// 	browserSync.init( {
// 		proxy: projectURL,
// 		open: true,
// 		injectChanges: true,
// 	});
// });

gulp.task( 'styles', function () {
	gulp.src( styleWatchFile, { base: './' } )
	.pipe( sass( {
		errLogToConsole: true,
		outputStyle: 'expanded',
		precision: 10
	} ) )
	.on( 'error', console.error.bind( console ) )
	.pipe( autoprefixer( AUTOPREFIXER_BROWSERS ) )
	.pipe( lineec() )
	.pipe( gulp.dest( './' ) )
	.pipe( csscomb() )
	.pipe( gulp.dest( './' ) )
	// .pipe( browserSync.stream() )
	.pipe( rename( { suffix: '.min' } ) )
	.pipe( minifycss() )
	.pipe( lineec() )
	.pipe( gulp.dest( './' ) )
	// .pipe( browserSync.stream() )
});

gulp.task( 'editor_styles', function () {
	gulp.src( editorWatchFile, { base: './' } )
	.pipe( sass( {
		errLogToConsole: true,
		outputStyle: 'expanded',
		precision: 10
	} ) )
	.on( 'error', console.error.bind( console ) )
	.pipe( autoprefixer( AUTOPREFIXER_BROWSERS ) )
	.pipe( lineec() )
	.pipe( csscomb() )
	.pipe( gulp.dest( '.' ) )
	// .pipe( browserSync.stream() )
	.pipe( rename( { suffix: '.min' } ) )
	.pipe( minifycss() )
	.pipe( lineec() )
	.pipe( gulp.dest( '.' ) )
	// .pipe( browserSync.stream() )
});

gulp.task( 'scripts', function() {
	gulp.src( scriptWatchFiles, { base: './' } )
	.pipe( rename( { suffix: '.min' } ) )
	.pipe( uglify() )
	.pipe( lineec() )
	.pipe( gulp.dest( '.' ) )
	// .pipe( browserSync.stream() )
});

/**
 * Default Command.
 */
gulp.task( 'default', [ 'clear', 'styles', 'editor_styles', 'scripts' ], function () {
	gulp.watch( PHPWatchFiles, reload );
	gulp.watch( styleWatchFile, [ 'styles' ] );
	gulp.watch( editorWatchFile, [ 'editor_styles' ] );
});




/**
 * Build Tasks
 */
gulp.task( 'translate', function () {

	gulp.src( translatableFiles )

	.pipe( sort() )
	.pipe( wpPot( {
		domain        : text_domain,
		destFile      : destFile,
		package       : pkg.title,
		bugReport     : bugReport,
		lastTranslator: lastTranslator,
		team          : team
	} ))
	.pipe( gulp.dest( translatePath ) )

});

gulp.task( 'clean', function () {
	return gulp.src( ['./dist/*'] , { read: false } )
	.pipe(cleaner());
});

gulp.task( 'copy', function() {
    return gulp.src( buildFiles )
    .pipe( copy( buildDestination ) );
});

gulp.task( 'variables', function () {
	return gulp.src( distributionFiles )
	.pipe( replace( {
		patterns: [
		{
			match: 'pkg.version',
			replacement: pkg.version
		},
		{
			match: 'textdomain',
			replacement: pkg.textdomain
		},
		{
			match: 'pkg.title',
			replacement: pkg.title
		},
		{
			match: 'pkg.slug',
			replacement: pkg.slug
		},
		{
			match: 'pkg.license',
			replacement: pkg.license
		},
		{
			match: 'pkg.plugin_uri',
			replacement: pkg.plugin_uri
		},
		{
			match: 'pkg.author',
			replacement: pkg.author
		},
		{
			match: 'pkg.author_uri',
			replacement: pkg.author_uri
		},
		{
			match: 'pkg.requires',
			replacement: pkg.requires
		},
		{
			match: 'pkg.tested_up_to',
			replacement: pkg.tested_up_to
		},
		{
			match: 'pkg.tags',
			replacement: pkg.tags
		}
		]
	}))
	.pipe( gulp.dest( buildDestination ) );
});

gulp.task( 'use_minified_assets', function () {
	return gulp.src( distributionFiles )

	.pipe( replace( {
		patterns: [
		{
			match: 'style.css',
			replacement: 'style.min.css',
		},
		{
			match: 'editor.css',
			replacement: 'editor.min.css',
		},
		{
			match: 'block.build.js',
			replacement: 'block.build.min.js',
		},
		{
			match: 'frontend.js',
			replacement: 'frontend.min.js',
		}
		],
		usePrefix: false
	} ) )
	.pipe( gulp.dest( buildDestination ) );
});

gulp.task( 'zip', function() {
    return gulp.src( buildDestination+'/**', { base: 'dist'} )
    .pipe( zip( pkg.slug +'.zip' ) )
    .pipe( gulp.dest( './dist/' ) );
});

gulp.task( 'clean-after-zip', function () {
	return gulp.src( [ buildDestination, '!/dist/' + pkg.slug + '.zip'] , { read: false } )
	.pipe(cleaner());
});

gulp.task( 'finished-building', function () {
	return gulp.src( '' )
	.pipe( notify( { message: '👷 Your build of ' + pkg.title + ' is complete.', onLast: true } ) );
});

gulp.task( 'build', function( callback ) {
	runSequence( 'clear', 'clean', [ 'styles', 'editor_styles', 'scripts', 'translate' ], 'copy', 'variables', 'use_minified_assets', 'zip', 'clean-after-zip', 'finished-building', callback);
});
