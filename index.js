var merge = require('merge-stream');
var rimraf = require('rimraf');

var initConfig = function(config) {
  if (!config) {
    throw new Error('You need to define a config (argument #2)');
  }

  if (!config.dest) {
    throw new Error("The property .dest needs to be defined in the config (argument #2)");
  }

  if (!config.root) {
    throw new Error("The property .root needs to be defined in the config (argument #2)");
  }

  if (!config.hasOwnProperty('dev')) {
    config.dev = true;
  }

  if (!config.hasOwnProperty('tmp')) {
    config.tmp = 'files/cache/webforge-js-builder';
  }
  
  return config;
};

var specifySubTask = function(spec) {
  if (typeof(spec) === 'string') {
    spec = { name: spec };
  }

  if (!spec.type) {
    spec.type = 'lib';
  }

  return spec;
};

module.exports = function(gulp, config, rootRequire) {
  var SubTask = require('gulp-subtask')(gulp);

  var that = this;

  this.config = initConfig(config); // property is public
  this.tasks = {};
  this.configuredTasks = require('./configured-tasks');
  this.gulpTasks = require('./gulp-tasks');
  this.require = rootRequire;
  this.resolvedModules = {};

  if (!that.require) {
    throw new Error('Please pass the require function from the gulpfile.js to the builder as third Argument');
  }

  this.add = function(lane, spec) {
    spec = specifySubTask(spec);

    var task = new SubTask(lane+':'+spec.name);
    task.spec = spec;

    if (!that.tasks[lane]) {
      that.tasks[lane] = [];
    }

    that.tasks[lane].push(task);

    return task;
  };

  that.dest = require('gulp-dest');
  that.rename = require('gulp-rename');

  this.addConfigured = function(lane, name, config) {
    if (!that.configuredTasks[name]) {
      throw new Error('The builder has no configuration for: '+name);
    }

    that.configuredTasks[name](that, config || {});
    return that;
  };

  this.run = function(lane) {
    var streams = [];

    that.tasks[lane].forEach(function(task) {
      streams.push(
        task.run()
      );
    });

    return merge.apply(this, streams);
  };

  this.registerTask = function(name, taskConfig) {
    if (!that.gulpTasks[name]) {
      throw new Error('The builder has no task named: '+name);
    }

    that.gulpTasks[name](gulp, that, taskConfig || {});

    return that;
  };

  this.resolveModule = function(name, alternative) {
    var path = require('path');

    if (that.resolvedModules.hasOwnProperty(name)) {
      return that.resolvedModules[name];
    }

    if (that.resolvedModules.hasOwnProperty(alternative)) {
      return that.resolvedModules[alternative];
    }

    // this does not have a "main" defined, so that it cannot be required()
    if (name === 'font-awesome') {
      var execSync = require('child_process').execSync;
      var lspath;
      try {
        lspath = execSync('npm ls '+name+' --parseable', { cwd: that.config.root});
      } catch (e) {
        if (e.status === 1) {
          lspath = e.stdout;
        } else {
          throw e;
        }
      }
      // take the first line
      var match = lspath.toString().match(/^(.*?)([\r\n]+|$)/);
      if (match === null) {
        throw new Error('Could not parse ls output: '+lspath.toString());
      }
      
      return that.resolvedModules[name] = match[1];
    }

    try {
      return that.resolvedModules[name] = path.dirname(that.require.resolve(name));
    } catch (exc) {

      if (alternative) {
        try {
          return that.resolvedModules[alternative] = path.dirname(that.require.resolve(alternative));
        } catch (exc2) {
        }
      }

      throw exc;
    }
  }
};