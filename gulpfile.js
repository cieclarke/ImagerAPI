'use strict'

var gulp = require('gulp');
var mocha = require('gulp-mocha');
const data = require('./data')
const rename = require('./rename')
const resize = require('./resize')
const eventData = require('./testdata/event.json')
const handler = require('./handler')

gulp.task('run', () => {
  
    handler.process(eventData, '', (v1, v2) => { console.log('gulp: ' + v2)})

})

gulp.task('file', () => {

    const file = 'Gallery_One/IMG33400.jpg'
    const data = {name: 'medium', width: 300}
    console.log(rename(file, data))
})

gulp.task('test', function() {
  return gulp.src(['tests/*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec'
    }));
});