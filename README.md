# Webforge js Builder

Manages the build with gulp.

## Concept

You will call the builder from your gulpfile. The builder contains several lanes. A lane consists of several gulp streams. When a lane is run the streams will be merged afterwards and returned back to your gulpfile.  
This setup allows you to use a lane for all your javascript:

```
builder.js('bootstrap')
 .src('node_modules/bootstrap/dist/bootstrap.js')
 .pipe('plugin', arg1, arg2)

builder.js('jquery')
 .src('node_modules/jquery/dist/jquery.js')
 .pipe('plugin', arg1, arg2)

builder.js('knockout')
  .src('lib/knockout.js')
```

in your gulpfile.js
```
gulp.task('javascript', function() {
  return builder.run('js')
    // optionaly: run them through r.js or combine or uglify or jshint them ...
    .pipe(gulp.dest('build/js'))
});
``` 


## Pitfalls

- use the [gulp-subtask - Syntax](https://www.npmjs.com/package/gulp-subtask/) after .js() or .task()
- use the normal gulp syntax after builder.run()

## why should I use something so complicated?

Have you ever had a project that needs to be build with more than 5 dependencies installed from different sources? One comes from npm, one relies in the git repository, one is installed by bower, etc. It's really a pain to list all those files that need to be integrated into your build. E.g. twitter-bootstrap needs jquery, you want to use knockout and the knockout-mapping plugin. You will find yourself writing a lot of simple tasks just to copy files from the targets to your build folder just to optimize or concat them. This is slow and error prone. Think of the example above in the concept. The `builder.task('js', ...)`- calls could rely in any node module you like. This way you can combine the source AND the code to build the source for every dependency. When the build mechanism for a dependency might change, you are prepared and you wouldn't have to change all your builds in every project.

Look at the `gulp.dest` call. It's only done once so that your dependency build script does not need to worry about the build target. Your build is still in charge of all file locations and tasks!