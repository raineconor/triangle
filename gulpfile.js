var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('default', function() {
  var dest = 'app/js';
  var filesSource = gulp.src('app/js/modules/*.js');
  filesSource = filesSource.pipe(concat('triangle-gulp.js'));
  var destFile = filesSource.pipe(gulp.dest(dest));
  return destFile;
});
