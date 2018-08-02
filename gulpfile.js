const gulp = require('gulp');

const { recuperarDeputados } = require('./services/coletorService');

gulp.task('coletarDeputados', function() {
    recuperarDeputados();
})