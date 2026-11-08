/**
 * DataTables Initialization Module
 * Professional integration with elite styling, export features, and robust safety checks
 */
export const initDataTables = () => {
    const waitForDataTables = (callback, maxTries = 100) => {
        let tries = 0;
        const interval = setInterval(() => {
            if (window.jQuery && window.jQuery.fn && window.jQuery.fn.DataTable) {
                clearInterval(interval);
                callback(window.jQuery);
            } else if (tries >= maxTries) {
                clearInterval(interval);
                console.error("❌ DataTables Init: Timed out waiting for library.");
            }
            tries++;
        }, 100);
    };

    waitForDataTables(($) => {
        console.log("📊 DataTables: Initializing Elite Modules with Exports...");

        // Global Defaults for Elite Look
        $.extend(true, $.fn.dataTable.defaults, {
            paging: true,
            searching: true,
            info: true,
            lengthChange: true,
            pageLength: 5,
            pagingType: 'full_numbers',
            language: {
                paginate: {
                    first: '«',
                    previous: '‹',
                    next: '›',
                    last: '»'
                }
            }
        });

        // 1. Basic Datatable with Exports
        if ($('#example').length) {
            $('#example').DataTable({
                responsive: true,
                dom: '<"d-flex justify-content-between align-items-center mb-3"lBf>rt<"d-flex justify-content-between align-items-center mt-3"ip>',
                buttons: [
                    {
                        extend: 'collection',
                        text: '<i class="bi bi-download me-1"></i> Export',
                        className: 'btn btn-primary btn-sm rounded-pill px-4',
                        buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
                    }
                ],
                language: {
                    search: "",
                    searchPlaceholder: "Search records..."
                }
            });
            console.log("   - example table ready");
        }

        // 2. Directory Table
        const $directoryTable = $('#directory-table');
        if ($directoryTable.length) {
            $directoryTable.DataTable({
                dom: '<"d-flex justify-content-between align-items-center mb-3"f>rt<"d-flex justify-content-between align-items-center mt-3"ip>',
                language: {
                    search: "",
                    searchPlaceholder: "Find in directory..."
                }
            });
            console.log("   - directory table ready");
        }

        // 3. Batch Selection Table
        const $batchTable = $('#batch-table');
        if ($batchTable.length) {
            $batchTable.DataTable({
                dom: 'rt<"d-flex justify-content-between align-items-center mt-3"ip>',
                columnDefs: [{
                    orderable: false,
                    targets: 0
                }],
                order: [[1, 'asc']]
            });

            // Select All Checkbox Logic
            $('#selectAll').off('click').on('click', function() {
                const isChecked = this.checked;
                $('.row-checkbox').prop('checked', isChecked);
                toggleBulkBtn();
            });

            $(document).off('change', '.row-checkbox').on('change', '.row-checkbox', function() {
                toggleBulkBtn();
                const allChecked = $('.row-checkbox:checked').length === $('.row-checkbox').length;
                $('#selectAll').prop('checked', allChecked);
            });

            function toggleBulkBtn() {
                const checkedCount = $('.row-checkbox:checked').length;
                const $bulkBtn = $('#bulk-delete-btn');
                if (checkedCount > 0) {
                    $bulkBtn.removeClass('d-none').find('span').text(`Delete Selected (${checkedCount})`);
                } else {
                    $bulkBtn.addClass('d-none');
                }
            }
            console.log("   - batch table ready");
        }

        // 4. Reporting & Analytics Table
        const $reportingTable = $('#reporting-table');
        if ($reportingTable.length) {
            $reportingTable.DataTable({
                dom: '<"d-flex justify-content-between align-items-center mb-3"Bf>rt<"d-flex justify-content-between align-items-center mt-3"ip>',
                buttons: [
                    {
                        extend: 'collection',
                        text: '<i class="bi bi-download me-1"></i> Export',
                        className: 'btn btn-primary btn-sm rounded-pill px-4',
                        buttons: ['copy', 'excel', 'csv', 'pdf', 'print']
                    }
                ],
                language: {
                    search: "",
                    searchPlaceholder: "Filter analytics..."
                }
            });
            console.log("   - reporting table ready");
        }

        // 5. Responsive Inventory Table
        const $responsiveTable = $('#responsive-table');
        if ($responsiveTable.length) {
            $responsiveTable.DataTable({
                responsive: true,
                dom: '<"d-flex justify-content-between align-items-center mb-3"f>rt<"d-flex justify-content-between align-items-center mt-3"ip>',
                language: {
                    search: "",
                    searchPlaceholder: "Search inventory..."
                }
            });
            console.log("   - responsive inventory table ready");
        }

        // 6. Advanced Filtering Table
        const $filterTable = $('#filter-table');
        if ($filterTable.length) {
            $filterTable.find('tfoot th').each(function() {
                const title = $(this).text();
                $(this).html(`<input type="text" class="form-control form-control-sm rounded-pill px-3" placeholder="Search ${title}" />`);
            });

            const table = $filterTable.DataTable({
                dom: 'rt<"d-flex justify-content-between align-items-center mt-3"ip>',
                initComplete: function() {
                    this.api().columns().every(function() {
                        const that = this;
                        $('input', this.footer()).on('keyup change clear', function() {
                            if (that.search() !== this.value) {
                                that.search(this.value).draw();
                            }
                        });
                    });
                }
            });
            console.log("   - filter table ready");
        }
    });
};
