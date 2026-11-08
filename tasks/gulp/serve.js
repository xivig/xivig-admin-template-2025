import gulp from 'gulp';
import browserSyncPkg from 'browser-sync';
import { scss } from './scss.js';
import { script } from './script.js';

const browserSync = browserSyncPkg.create();

export function serve() {
  browserSync.init({ server: './' });
  gulp.watch('src/scss/**/*.scss', scss).on('change', browserSync.reload);
  gulp.watch('src/scripts/**/*.js', js).on('change', browserSync.reload);
  gulp.watch('./*.html').on('change', browserSync.reload);
}
