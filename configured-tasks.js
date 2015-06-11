var wrap = require('gulp-wrap-amd');
var addsrc = require('gulp-add-src');
var dest = require('gulp-dest');
var rename = require('gulp-rename');

module.exports = {};

module.exports.bootstrap = function(builder) {
  builder.add('js', 'bootstrap')
    .src(['node_modules/bootstrap/js/*.js', '!**/popover.js'])
    .pipe(wrap, {
      deps: ['jquery'],
      params: ['jQuery'],
      exports: 'jQuery'
    })
    .pipe(dest, 'bootstrap');
  
  builder.add('js', 'bootstrap-popover')
    .src('node_modules/bootstrap/js/popover.js')
    .pipe(wrap, {
      deps: ['jquery', './tooltip'],
      params: ['jQuery'],
      exports: 'jQuery'
    })
    .pipe(dest, 'bootstrap');
};

module.exports.jquery = function(builder) {
  return builder.add('js', 'jquery')
    .src('node_modules/jquery/dist/jquery.js')
};

module.exports.knockout = function(builder) {
  return builder.add('js', 'knockout')
    .src('node_modules/knockout/build/output/knockout-latest.js')
    .pipe(rename, 'knockout.js');
}

module.exports.knockoutMapping = function(builder) {
  return builder.add('js', 'knockout-mapping')
    .src('node_modules/knockout-mapping/dist/knockout.mapping.js')
    .pipe(rename, 'knockout-mapping.js');
}
