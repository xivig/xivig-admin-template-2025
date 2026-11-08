import gulp from "gulp";
import browserSync from "browser-sync";

// Serve the docs folder
export function serveDocs() {
    browserSync.init({
        server: {
            baseDir: "docs" // 👈 serve from docs folder
        },
        port: 5000, // optional: custom port
        open: true, // auto-open browser
        notify: false // disable BrowserSync notifications
    });

    // Watch for changes inside docs
    gulp.watch("docs/**/*").on("change", browserSync.reload);
}

// Default task
// export default serveDocs;