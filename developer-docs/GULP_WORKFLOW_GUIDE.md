# Gulp Workflow & Task Customization Guide

This guide explains the architecture of our **Gulp** automation system, how tasks are structured, and how you can create and register your own custom tasks.

---

## 1. The Gulp Architecture

In this project, Gulp acts as the "Orchestrator". While **Vite** handles the fast compilation of JS and SCSS, Gulp manages the complex filesystem operations, image optimizations, and deployment syncing.

### 1.1 Key Concepts
-   **`gulp.src()`**: Defines the source files to process.
-   **`gulp.dest()`**: Defines the destination folder.
-   **`.pipe()`**: Chains actions together (e.g., source -> optimize -> destination).
-   **`gulp.series()`**: Executes tasks one after another (Sequential).
-   **`gulp.parallel()`**: Executes tasks at the same time (Concurrent).

---

## 2. How to Write a New Task

There are two ways to add a task: **Inline** (directly in `gulpfile.js`) or **Modular** (in a separate file).

### 2.1 Writing an Inline Task
For simple tasks, add them directly to the main `gulpfile.js`:

```javascript
// Example: A task to copy fonts
export const copyFonts = () => {
    return gulp.src('app/src/fonts/**/*')
        .pipe(gulp.dest('dist/assets/fonts'));
};
```

### 2.2 Writing a Modular Task
For complex logic, create a new file in `tasks/gulp/` (e.g., `tasks/gulp/my-task.js`):

```javascript
// tasks/gulp/my-task.js
import fs from 'fs/promises';

export async function myCustomTask() {
    console.log("Running custom logic...");
    // Your Node.js code here
}
```

Then, import and export it in `gulpfile.js`:
```javascript
import { myCustomTask } from './tasks/gulp/my-task.js';
export { myCustomTask };
```

---

## 3. Adding a Task to a Workflow

Once a task is written, you need to add it to a "Workflow" (a series of tasks) to make it run during the build.

### 3.1 Updating the Build Workflow
Find the `build` constant in `gulpfile.js` and insert your task:

```javascript
export const build = gulp.series(
    clean,
    viteBuild,
    copyFonts,     // <--- Your new task inserted here
    optimizeImages,
    // ... rest of the tasks
    exportAssets
);
```

---

## 4. Registering as an NPM Script

To run your task directly from the terminal, add it to the `scripts` section of `package.json`:

```json
"scripts": {
    "copy-fonts": "gulp copyFonts",
    "my-custom-task": "gulp myCustomTask"
}
```

Now you can run: `npm run copy-fonts`

---

## 5. Best Practices for Gulp Tasks

1.  **Always Return**: A Gulp task must return a stream, a promise, or call a callback function (`cb()`) so Gulp knows when the task is finished.
    -   *Stream:* `return gulp.src(...)...`
    -   *Promise:* `return fs.rm(...)`
    -   *Callback:* `export const myTask = (cb) => { ...; cb(); }`
2.  **Safety First**: Use `allowEmpty: true` in `gulp.src()` to prevent the build from crashing if a folder is missing.
3.  **Modularize**: Keep `gulpfile.js` clean by moving heavy logic into the `tasks/` directory.
4.  **Error Handling**: Use `.on('error', ...)` in your pipes to prevent a single error from killing the entire build process.

---

## 6. Example: Creating a "Cleanup Data" Task

1.  **Write the task in `gulpfile.js`**:
    ```javascript
    export const cleanData = () => deleteAsync(['dist/data/*.tmp']);
    ```
2.  **Add to build workflow**:
    ```javascript
    export const build = gulp.series(clean, viteBuild, cleanData, ...);
    ```
3.  **Run and verify**:
    `npm run build`
