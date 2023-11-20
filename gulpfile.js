var gulp = require('gulp');
var copy = require('gulp-copy');
var jade = require('gulp-jade');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

const paths = {
  assetsSrc: ['src/assets/**/*', 'src/js/**.js'],
  jadeSrc: 'src/**/*.jade',
  sassSrc: 'src/**/*.scss',
  outputDir: 'docs',
};

// Copy assets to dist folder
gulp.task('copy-assets', () => {
  return gulp
    .src(paths.assetsSrc)
    .pipe(copy(paths.outputDir, { prefix: 1 })) // Copies to the public folder with a depth of 1
    .on('end', () => {
      console.log('Assets copied to docs folder.');
    });
});

// Compile Jade templates to HTML
gulp.task('jade', () => {
  return gulp
    .src(paths.jadeSrc)
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest(paths.outputDir))
    .pipe(browserSync.stream()); // Reload browser on changes
});

// Compile Sass to CSS
gulp.task('sass', () => {
  return gulp
    .src(paths.sassSrc)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`${paths.outputDir}`))
    .pipe(browserSync.stream()); // Reload browser on changes
});

// Watch for changes in Jade and Sass files
gulp.task('watch', () => {
  gulp.watch(paths.jadeSrc, gulp.series('jade'));
  gulp.watch(paths.sassSrc, gulp.series('sass'));
  gulp.watch(paths.assetsSrc, gulp.series('copy-assets'));
});

// Initialize BrowserSync server
gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: paths.outputDir,
    },
  });

  // Watch for changes in HTML files and reload browser
  gulp.watch(`${paths.outputDir}/*.html`).on('change', browserSync.reload);
});

// Default task
gulp.task(
  'default',
  gulp.series('copy-assets', 'jade', 'sass', gulp.parallel('watch', 'serve'))
);

gulp.task('build', gulp.series('copy-assets', 'jade', 'sass'));
