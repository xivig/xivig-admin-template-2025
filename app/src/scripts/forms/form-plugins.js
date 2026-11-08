/**
 * Form Plugins Module - Image Cropper & Summernote
 */
import EditorModule from '../components/editor-module.js';

// 1. Summernote Initialization
export const initSummernote = () => {
    if (document.querySelector('#summernote-editor')) {
        const editor = new EditorModule('#summernote-editor', {
            placeholder: 'Start writing your elite architecture notes...'
        });
        editor.init();
    }
};

/**
 * 2. Image Cropper Module
 * Modular implementation as per elite architecture standards
 */
export const initImageCropper = function () {
    // Small delay to ensure global Cropper (from CDN) is populated if this runs very early
    setTimeout(() => {
        const image = document.getElementById('image');
        if (!image) return;

        console.log("Initializing Image Cropper Logic...");
        
        const dataX = document.getElementById('dataX');
        const dataY = document.getElementById('dataY');
        const dataWidth = document.getElementById('dataWidth');
        const dataHeight = document.getElementById('dataHeight');
        const dataRotate = document.getElementById('dataRotate');
        const resultContainer = document.getElementById('croppedResult');
        const downloadBtn = document.getElementById('download');

        const CropperClass = window.Cropper;

        if (!CropperClass) {
            console.error("Cropper.js library not found. Ensure CDN is loaded.");
            return;
        }

        let cropper;
        const options = {
            aspectRatio: 16 / 9,
            preview: '.img-preview',
            viewMode: 2,
            dragMode: 'crop',
            autoCropArea: 0.8,
            restore: false,
            guides: true,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: true,
            crop(event) {
                if (dataX) dataX.value = Math.round(event.detail.x);
                if (dataY) dataY.value = Math.round(event.detail.y);
                if (dataWidth) dataWidth.value = Math.round(event.detail.width);
                if (dataHeight) dataHeight.value = Math.round(event.detail.height);
                if (dataRotate) dataRotate.value = Math.round(event.detail.rotate || 0);
            },
        };

        const startCropper = () => {
            if (cropper) cropper.destroy();
            cropper = new CropperClass(image, options);
            console.log("Cropper instance created.");
        };

        // Initialize when image is ready
        if (image.complete) {
            startCropper();
        } else {
            image.addEventListener('load', startCropper);
        }

        // Actions Toolbar Logic
        const actions = document.getElementById('actions');
        if (actions) {
            actions.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-method]');
                if (!btn || !cropper) return;

                const method = btn.getAttribute('data-method');
                let option = btn.getAttribute('data-option');
                let secondOption = btn.getAttribute('data-second-option');

                // Parse options
                if (option && !isNaN(option)) {
                    option = parseFloat(option);
                } else if (option === 'NaN') {
                    option = NaN;
                }

                if (secondOption && !isNaN(secondOption)) {
                    secondOption = parseFloat(secondOption);
                }

                // Execute Methods
                switch (method) {
                    case 'getCroppedCanvas':
                        const canvas = cropper.getCroppedCanvas({
                            imageSmoothingEnabled: true,
                            imageSmoothingQuality: 'high',
                        });
                        if (canvas && resultContainer) {
                            resultContainer.innerHTML = '';
                            resultContainer.appendChild(canvas);
                            if (downloadBtn) {
                                downloadBtn.href = canvas.toDataURL('image/jpeg', 0.9);
                            }
                        }
                        break;
                    case 'scaleX':
                        cropper.scaleX(option);
                        btn.setAttribute('data-option', -option);
                        break;
                    case 'scaleY':
                        cropper.scaleY(option);
                        btn.setAttribute('data-option', -option);
                        break;
                    case 'move':
                        cropper.move(option, secondOption || 0);
                        break;
                    default:
                        if (typeof cropper[method] === 'function') {
                            cropper[method](option);
                        }
                }
            });
        }

        // Handle File Upload
        const inputImage = document.getElementById('inputImage');
        if (inputImage) {
            const URL = window.URL || window.webkitURL;
            inputImage.addEventListener('change', function () {
                const files = this.files;
                if (files && files.length && cropper) {
                    const file = files[0];
                    if (/^image\/\w+$/.test(file.type)) {
                        const uploadedImageURL = URL.createObjectURL(file);
                        cropper.replace(uploadedImageURL);
                        inputImage.value = null;
                    } else {
                        window.alert('Please choose an image file.');
                    }
                }
            });
        }
    }, 200);
};

export const initImageDropzone = () => {
    const dropzoneEl = document.querySelector("#admin-media-upload");
    if (dropzoneEl && typeof window.Dropzone !== 'undefined') {
        // Prevent Dropzone from auto-discovering
        window.Dropzone.autoDiscover = false;
        const Dropzone = window.Dropzone;

        try {
            new Dropzone(dropzoneEl, {
                url: "https://httpbin.org/post", // Demo endpoint
                maxFilesize: 5,
                acceptedFiles: "image/*",
                // 1. Enable the "Remove file" link in the UI
                addRemoveLinks: true,
                dictRemoveFile: "Delete",
                
                // 2. Handle the deletion logic
                init: function () {
                    this.on("removedfile", function (file) {
                        // Only attempt server-side deletion if the file was actually uploaded
                        if (file.status === window.Dropzone.SUCCESS) {
                            const fileId = file.serverId || 'mock-id-123';
                            
                            fetch("/admin/delete", {
                                method: "POST",
                                body: JSON.stringify({
                                    filename: file.name, 
                                    id: fileId
                                }),
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            })
                            .then(response => {
                                if (!response.ok) console.error("Server-side delete failed.");
                                else console.log("Server-side delete successful.");
                            })
                            .catch(err => console.error("Network error during delete:", err));
                        }
                    });

                    this.on("success", function(file, response) {
                        // We assume your server returns an ID in the response
                        // For demo purposes, we'll attach a mock ID
                        file.serverId = response.id || 'mock-id-' + Math.floor(Math.random() * 1000);
                        console.log("Upload successful. Server ID attached:", file.serverId);
                    });
                }
            });
        } catch (e) {
            console.error("Dropzone initialization error:", e);
        }
    }
};
