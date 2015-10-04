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

module.exports = function(gulp, config) {
  var SubTask = require('gulp-subtask')(gulp);

  var that = this;

  this.config = initConfig(config); // property is public
  this.tasks = {};
  this.configuredTasks = require('./configured-tasks');
  this.gulpTasks = require('./gulp-tasks');

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

    that.gulpTasks[name](gulp, that, taskConfig);

    return that;
  };
};