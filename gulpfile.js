const gulp = require('gulp');

const { recuperarDeputados } = require('./services/collector_service');

gulp.task('coletarDeputados', function() {
    recuperarDeputados();
})