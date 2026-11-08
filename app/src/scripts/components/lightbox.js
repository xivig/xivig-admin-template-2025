import {
    Fancybox
} from "@fancyapps/ui";

export const initLightbox = () => {
    // Bind to all elements with data-fancybox attribute
    Fancybox.bind("[data-fancybox]", {
        // Elite Options
        Hash: false, // Prevents URL changes
        dragToClose: true,
        Toolbar: {
            display: {
                left: ["infobar"],
                middle: [],
                right: ["iterateZoom", "slideshow", "fullScreen", "download", "thumbs", "close"],
            },
        },
        Images: {
            initialSize: "fit",
        },
    });
};

/**
 * Gallery Filter Module for Xivig OS
 * Handles category switching and item visibility with smooth transitions
 */
export const initGalleryFilter = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterButtons.length || !galleryItems.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filterValue = this.getAttribute('data-filter');

            // 1. Handle Button States (Elite approach: cleaner class management)
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'btn-primary');
                btn.classList.add('btn-outline-primary');
            });
            this.classList.replace('btn-outline-primary', 'btn-primary');
            this.classList.add('active');

            // 2. Filter Logic with Opacity Transition
            galleryItems.forEach(item => {
                // Ensure item is prepared for animation
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.classList.remove('d-none');
                    // Small timeout to trigger the CSS transition after display change
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    // Wait for transition to finish before hiding from layout
                    setTimeout(() => {
                        item.classList.add('d-none');
                    }, 300);
                }
            });
        });
    });
};