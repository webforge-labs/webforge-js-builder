var gulp = require('gulp');
var SubTask = require('gulp-subtask')(gulp);
var merge = require('merge-stream');
var configuredTasks = require('./configured-tasks');

var Builder = function(gulp) {
  var that = this;

  this.tasks = {};
  this.configuredTasks = configuredTasks;

  this.add = function(lane, spec) {
    spec = that.specify(spec);

    var task = new SubTask(lane+':'+spec.name);
    task.spec = spec;

    if (!that.tasks[lane]) {
      that.tasks[lane] = [];
    }

    that.tasks[lane].push(task);

    return task;
  };

  this.addConfigured = function(lane, name) {
    if (!that.configuredTasks[name]) {
      throw new Error('The builder has no configuration for: '+name);
    }

    that.configuredTasks[name](that);
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

  this.specify = function(spec) {
    if (typeof(spec) === 'string') {
      spec = { name: spec };
    }

    if (!spec.type) {
      spec.type = 'lib';
    }

    return spec;
  };
};

module.exports = new Builder(gulp);