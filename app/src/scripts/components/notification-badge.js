/**
 * NotificationBadge module for managing notification badges dynamically.
 */
export class NotificationBadge {
    constructor(id) {
        this.element = document.getElementById(id);
        this.count = 0;
        if (this.element) {
            const currentCount = parseInt(this.element.textContent.trim());
            this.count = isNaN(currentCount) ? 0 : currentCount;
            this.updateVisibility();
        }
    }

    /**
     * Set the badge count.
     * @param {number} count 
     */
    setCount(count) {
        this.count = count;
        if (this.element) {
            // Find the text node or the first child that isn't the visually-hidden span
            const textNode = Array.from(this.element.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            if (textNode) {
                textNode.textContent = ` ${count} `;
            } else {
                // Fallback: prepend count before visually-hidden
                const hiddenSpan = this.element.querySelector('.visually-hidden');
                if (hiddenSpan) {
                    this.element.insertBefore(document.createTextNode(` ${count} `), hiddenSpan);
                } else {
                    this.element.textContent = count;
                }
            }
            this.updateVisibility();
        }
    }

    /**
     * Increment the badge count.
     * @param {number} amount 
     */
    increment(amount = 1) {
        this.setCount(this.count + amount);
    }

    /**
     * Decrement the badge count.
     * @param {number} amount 
     */
    decrement(amount = 1) {
        this.setCount(Math.max(0, this.count - amount));
    }

    /**
     * Clear the badge count.
     */
    clear() {
        this.setCount(0);
    }

    /**
     * Update badge visibility based on count.
     */
    updateVisibility() {
        if (this.element) {
            if (this.count <= 0) {
                this.element.classList.add('d-none');
            } else {
                this.element.classList.remove('d-none');
            }
        }
    }
}

// Global initialization or export
export default NotificationBadge;
