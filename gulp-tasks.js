module.exports = {};

module.exports.clean = function(gulp, builder) {
  var rimraf = require('rimraf');

  gulp.task('clean', function (cb) {
    rimraf(builder.config.dest, cb);
  });
};

module.exports.fonts = function(gulp, builder) {
  gulp.task('fonts', ['clean'], function() {
    return builder.run('fonts')
      .pipe(gulp.dest(builder.config.dest+'/fonts'));
  });
};

module.exports['requirejs-config'] = function(gulp, builder, taskConfig) {
  var concat = require('gulp-concat');

  gulp.task('requirejs-config', ['clean'], function() {
    return gulp.src([taskConfig.file, 'node_modules/requirejs/require.js'])
      .pipe(concat('load-require.js'))
      .pipe(gulp.dest(builder.config.dest+'/js'))
  });
};

module.exports.javascript = function(gulp, builder, taskConfig) {
  gulp.task('javascript', ['clean', 'requirejs-config'], function() {
    return builder.run('js')
      .pipe(gulp.dest(builder.config.dest+'/js'));
  });
};

module.exports.less = function(gulp, builder, taskConfig) {
  var less = require('gulp-less');
  var path = require('path');

  var includePaths = taskConfig.includes.map(function(includePath) {
    return path.join( builder.config.root, includePath )
  });

  gulp.task('less', ['clean'], function () {
    return gulp.src(taskConfig.src)
      .pipe(less({
         paths: includePaths,
         compress: !builder.config.dev
      }))
      .pipe(gulp.dest(builder.config.dest+'/css'));
  });

};