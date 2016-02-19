'use strict'

const
    gulp = require('gulp'),
    exclude_gitignore = require('gulp-exclude-gitignore'),
    tape = require('gulp-tape'),
    faucet = require('faucet')

gulp.task('test', ['jshint', 'unit-test', 'functional-test'])

gulp.task('jshint', () => {
    const jshint = require('gulp-jshint')
    return gulp
        .src('t/**/*.j[st]')
        .pipe(exclude_gitignore())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
})

gulp.task('unit-test', () => {
    return gulp
        .src('**/*.jt')
        .pipe(exclude_gitignore())
        .pipe(tape({ reporter: faucet() }))
})

gulp.task('functional-test', ['unit-test'], () => {
    return gulp
        .src('t/t[0-9]*.js')
        .pipe(tape({ reporter: faucet() }))
})
