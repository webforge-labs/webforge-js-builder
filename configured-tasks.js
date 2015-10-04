var wrap = require('gulp-wrap-amd');
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
};

module.exports.knockoutMapping = function(builder) {
  return builder.add('js', 'knockout-mapping')
    .src('node_modules/knockout-mapping/dist/knockout.mapping.js')
    .pipe(rename, 'knockout-mapping.js');
};

module.exports.moment = function(builder) {
  return builder.add('js', 'moment')
    .src('node_modules/moment/moment.js')
};

module.exports['font-awesome'] = function(builder) {
  return builder.add('fonts', 'font-awesome')
    .src(['node_modules/font-awesome/fonts/**/*']);
};

module.exports.sammy = function(builder) {
  return builder.add('js', 'sammy')
    .src('node_modules/shimney-sammy/main.js')
    .pipe(rename, 'sammy.js');
};

module.exports['cookie-monster'] = function(builder) {
  return builder.add('js', 'cookie-monster')
    .src('node_modules/shimney-cookie-monster/main.js')
    .pipe(rename, 'cookie-monster.js');
};

module.exports.hogan = function(builder, config) {
  var version = config.version || '2.0.0';

  return builder.add('js', 'hogan')
    .src('node_modules/hogan.js/web/builds/'+version+'/hogan-'+version+'.amd.js')
    .pipe(rename, 'hogan.js');
};

module.exports.lodash = function(builder, config) {
  return builder.add('js', 'lodash')
    .src('node_modules/lodash/dist/lodash.compat.js')
    .pipe(rename, 'lodash.js');
};

module.exports.json = function(builder, config) {
  return builder.add('js', 'json')
    .src('node_modules/shimney-json/main.js')
    .pipe(rename, 'JSON.js');
};
