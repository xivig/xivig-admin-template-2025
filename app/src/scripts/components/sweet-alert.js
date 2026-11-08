// scripts/NotificationService.js
import Swal from 'sweetalert2';

export default class NotificationService {
    static baseConfig = {
        confirmButtonColor: '#6366f1',
        cancelButtonColor: '#94a3b8',
        customClass: {
            popup: 'xivig-swal-popup',
            title: 'xivig-swal-title',
            confirmButton: 'swal2-confirm-modern'
        },
        buttonsStyling: true
    };

    static basic(title, text) {
        return Swal.fire({
            ...this.baseConfig,
            title,
            text
        });
    }

    static success(title, text) {
        return Swal.fire({
            ...this.baseConfig,
            icon: 'success',
            title,
            text,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
    }

    static error(title, text) {
        return Swal.fire({
            ...this.baseConfig,
            icon: 'error',
            title,
            text,
            confirmButtonColor: '#ef4444'
        });
    }

    static confirm(title, text, confirmText = 'Yes, proceed!') {
        return Swal.fire({
            ...this.baseConfig,
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: confirmText,
            reverseButtons: true
        });
    }

    static async loader(title, html, action) {
        Swal.fire({
            ...this.baseConfig,
            title,
            html,
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            const result = await action();
            await this.success('Completed', 'The operation was successful.');
            return result;
        } catch (err) {
            this.error('Failed', err.message || 'An error occurred.');
            throw err;
        }
    }
}