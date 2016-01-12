var wrap = require('gulp-wrap-amd');
var dest = require('gulp-dest');
var rename = require('gulp-rename');

module.exports = {};

module.exports.bootstrap = function(builder) {
  var srcPath;

  try {
    srcPath = require('path').resolve(builder.resolveModule('bootstrap'), '..', '..', 'js');
  } catch (exc) {
    srcPath = builder.resolveModule('bootstrap-sass')+'/bootstrap';
  }

  builder.add('js', 'bootstrap')
    .src([srcPath+'/*.js', '!**/popover.js'])
    .pipe(wrap, {
      deps: ['jquery'],
      params: ['jQuery'],
      exports: 'jQuery'
    })
    .pipe(dest, 'bootstrap');
  
  builder.add('js', 'bootstrap-popover')
    .src(srcPath+'/popover.js')
    .pipe(wrap, {
      deps: ['jquery', './tooltip'],
      params: ['jQuery'],
      exports: 'jQuery'
    })
    .pipe(dest, 'bootstrap');
};

module.exports.amplify = function(builder, config) {
  if (config && config.shimney) {
    builder.add('js', 'amplify')
      .src(builder.resolveModule('shimney-amplify')+'/main.js')
      .pipe(rename, 'amplify.js');

  } else {

    throw new Error('cannot build amplify from npm :(. use { shimney: true } for config');
    /*
    builder.add('js', 'amplify')
      .src([builder.resolveModule('amplify')+'/lib/amplify/amplify.js'])
      .pipe(wrap, {
        deps: [],
        params: [],
        exports: 'amplify'
      });
    */
   }
};

module.exports.jquery = function(builder) {
  return builder.add('js', 'jquery')
    .src(builder.resolveModule('jquery')+'/jquery.js')
};

module.exports.knockout = function(builder, config) {
  return builder.add('js', 'knockout')
    .src(builder.resolveModule('knockout')+'/knockout-latest'+(config.debug ? '.debug' : '' )+'.js')
    .pipe(rename, 'knockout.js');
};

module.exports['knockout-mapping'] = module.exports.knockoutMapping = function(builder) {
  return builder.add('js', 'knockout-mapping')
    .src(builder.resolveModule('knockout-mapping')+'/knockout.mapping.js')
    .pipe(rename, 'knockout-mapping.js');
};

module.exports.moment = function(builder) {
  return builder.add('js', 'moment')
    .src(builder.resolveModule('moment')+'/moment.js')
};

module.exports['font-awesome'] = function(builder) {
  return builder.add('fonts', 'font-awesome')
    .src([builder.resolveModule('font-awesome')+'/fonts/**/*']);
};

module.exports.sammy = function(builder) {
  return builder.add('js', 'sammy')
    .src(builder.resolveModule('shimney-sammy')+'/main.js')
    .pipe(rename, 'sammy.js');
};

module.exports['cookie-monster'] = function(builder) {
  return builder.add('js', 'cookie-monster')
    .src(builder.resolveModule('shimney-cookie-monster')+'/main.js')
    .pipe(rename, 'cookie-monster.js');
};

module.exports.hogan = function(builder, config) {
  var version = config.version || '2.0.0';

  return builder.add('js', 'hogan')
    .src(builder.resolveModule('hogan.js')+'/../web/builds/'+version+'/hogan-'+version+'.amd.js')
    .pipe(rename, 'hogan.js');
};

module.exports.lodash = function(builder, config) {
  if (config && config.shimney) {
    return builder.add('js', 'lodash')
      .src(builder.resolveModule('shimney-lodash')+'/main.js')
      .pipe(rename, 'lodash.js');

  } else {
    return builder.add('js', 'lodash')
      .src(builder.resolveModule('lodash')+'/lodash.compat.js')
      .pipe(rename, 'lodash.js');
  }
};

module.exports.json = function(builder, config) {
  return builder.add('js', 'json')
    .src(builder.resolveModule('shimney-json')+'/main.js')
    .pipe(rename, 'JSON.js');
};

module.exports.superagent = function(builder, config) {
  if (config && config.shimney) {
    return builder.add('js', 'superagent')
      .src(builder.resolveModule('shimney-superagent')+'/main.js')
      .pipe(rename, 'superagent.js');

  } else {

    var execSync = require('child_process').execSync;
    var modulePath = builder.resolveModule('superagent');

    execSync('browserify --standalone superagent --outfile superagent.js .', {'cwd': modulePath});

    return builder.add('js', 'superagent')
      .src(modulePath+'/superagent.js')
  }
};

module.exports['webforge-js-components'] = function(builder, config) {
  var modulePath = builder.resolveModule('webforge-js-components');

  builder.add('js', 'webforge-js-components')
    .src(modulePath+'/src/js/Webforge/**/*.js')
    .pipe(builder.dest, 'Webforge')

  builder.add('js', 'webforge-js-components-modules')
    .src(modulePath+'/src/js/default-modules/**/*.js')
    .pipe(builder.dest, 'modules')
};

module.exports.accounting = function(builder, config) {
  return builder.add('js', 'accounting')
    .src(builder.resolveModule('accounting')+'/accounting.js')
    //.pipe(rename, '.js');
};

module.exports['knockout-collection'] = function(builder, config) {
  return builder.add('js', 'knockout-collection')
    .src(builder.resolveModule('knockout-collection')+'/index.js')
    .pipe(rename, 'knockout-collection.js');
};


module.exports['requirejs-text'] = function(builder, config) {
  return builder.add('js', 'requirejs-text')
    .src(builder.resolveModule('requirejs-text')+'/text.js')
    .pipe(rename, 'text.js');
};

module.exports['requirejs-json'] = function(builder, config) {
  return builder.add('js', 'requirejs-json')
    .src(builder.resolveModule('shimney-requirejs-json')+'/main.js')
    .pipe(rename, 'json.js');
};
