var gulpif = require('gulp-if');
var path = require('path');
var concat = require('gulp-concat');

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

module.exports.css = function(gulp, builder, taskConfig) {
  gulp.task('css', ['clean'], function() {
    return builder.run('css')
      .pipe(gulpif(taskConfig.concat, concat(taskConfig.target || 'app.css')))
      .pipe(gulp.dest(builder.config.dest+'/css'));
  });
};

module.exports['requirejs-config'] = function(gulp, builder, taskConfig) {
  var modulePath = path.resolve(builder.resolveModule('requirejs'), '..');

  gulp.task('requirejs-config', ['clean', 'requirejs'], function() {
    return gulp.src([taskConfig.file, modulePath+'/require.js'])
      .pipe(concat('load-require.js'))
      .pipe(gulp.dest(builder.config.dest+'/js'))
  });
};

module.exports.javascript = function(gulp, builder, taskConfig) {
  if (taskConfig && taskConfig.combine) {
    var requireConfig = taskConfig.requirejs;

    requireConfig.appDir = builder.config.tmp+"/javascript"; // optimize this
    requireConfig.dir = builder.config.dest+'/js'; // into this

    if (!requireConfig.hasOwnProperty('baseUrl')) {
      requireConfig.baseUrl = './'; // everything is rooted in appDir (thats our convention)
    }

    requireConfig.keepBuildDir = false;  // start with empty dir

    if (!requireConfig.hasOwnProperty('removeCombined')) {
      // we can remove the optimized files, when we load (from html) always the module "main". Because this will contain all others. 
      //If you have other entry-points in html you have to add this entry point to modules!
      requireConfig.removeCombined = true;
    }

    if (!requireConfig.hasOwnProperty('findNestedDependencies')) {
      requireConfig.findNestedDependencies = true;
    }

    if (!requireConfig.hasOwnProperty('optimizeCss')) {
      requireConfig.optimizeCss = false;
    }

    requireConfig.optimize = "uglify2";
    requireConfig.uglify2 =  {
      output: {
        beautify: false
      },
      compress: {
        sequences: false
      },
      warnings: false,
      mangle: true
    };
      
    requireConfig.skipDirOptimize =  true;
    requireConfig.optimizeCss = "none";

    // pipe all files to www/assets/js directory and write them
    // because js files come from whole different locations (like node_modules, lib/, etc...)
    gulp.task('javascript-files', ['clean'], function(done) {
      return builder.run('js')
        .pipe(gulp.dest(requireConfig.appDir));
    });

    gulp.task('javascript', ['requirejs-config'], function() {
      // requirejs-config calls requirejs (so that the config is not removed from r.js optimizer)
    });

    // get those (hopfully written) files and optimize them
    gulp.task('requirejs', ['javascript-files'], function(done) {
      var requirejs = builder.require('requirejs');

      requirejs.optimize(requireConfig, function (buildResponse) {
        done();
      }, function(err) {
        done(err);
      });
    });

  } else if (taskConfig && taskConfig.concat) {
    gulp.task('requirejs-config', function() {
      // no requirejs-config when concat is not activated
    });

    gulp.task('javascript', ['clean', 'requirejs-config'], function() {
      return builder.run('js')
        .pipe(concat(taskConfig.target || 'app.js'))
        .pipe(gulp.dest(builder.config.dest+'/js'));
    });

  } else {
    gulp.task('requirejs', function() {
      // nothing todo if combine is not activated
      // but requirejs-config requires this task so we have to provide it!
    });

    gulp.task('javascript', ['clean', 'requirejs-config'], function() {
      return builder.run('js')
        .pipe(gulp.dest(builder.config.dest+'/js'));
    });
  }
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

module.exports.templates = function(gulp, builder, taskConfig) {
  var addsrc = require('gulp-add-src');
  var hogan = require('gulp-hogan-compile');

  gulp.task('templates', ['clean'], function() {
    var path = require('path');
    return gulp.src(taskConfig.path+'/**/*.mustache' || 'Resources/tpl/**/*.mustache')
      .pipe(addsrc('node_modules/webforge-js-components/Resources/tpl/**'))
      .pipe(
        hogan('templates-compiled.js', {
          templateName: function(file) {
            return file.relative.replace(/\\/g, '/').slice(0, -".mustache".length);
          },
        })
      )
      .pipe(gulp.dest(builder.config.dest+'/js'));
  });
};
