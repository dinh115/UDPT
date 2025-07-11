<?php
// filepath: d:\UDPT\source\frontend\app\views\prescription\index.php
$title = 'MedPortal - Quản lý Đơn thuốc';
$description = 'Các chức năng quản lý đơn thuốc và kê đơn.';
require_once(__DIR__ . '/../template/header.php'); ?>

<body>
    <?php require_once(__DIR__ . '/../template/navbar.php'); ?>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title"><?php echo $title ?></h1>
                <p class="hero-subtitle"><?php echo $description ?></p>
            </div>
        </div>
    </section>

    <div class="container">
        <!-- Dashboard Grid -->
        <div class="dashboard-grid">
            <!-- Quick Actions -->
            <div class="quick-actions mt-0">
                <a href="#prescriptionList" class="action-btn">
                    <i class="fas fa-list"></i>
                    <span>Danh sách đơn thuốc</span>
                </a>
                <a href="/medicine" class="action-btn">
                    <i class="fas fa-pills"></i>
                    <span>Quản lý thuốc</span>
                </a>
            </div>
        </div>

        <!-- Prescription List -->
        <div class="dashboard-card slide-up" id="prescriptionList">
            <div class="card-header">
                <div class="card-icon">
                    <i class="fas fa-prescription"></i>
                </div>
                <div>
                    <h3 class="card-title">Danh Sách Đơn Thuốc</h3>
                    <p class="card-subtitle">Quản lý thông tin đơn thuốc</p>
                </div>
            </div>

            <!-- Filters -->
            <div class="row mb-3">
                <div class="col-md-3">
                    <select class="form-control" id="statusFilter">
                        <option value="">Tất cả trạng thái</option>
                        <option value="CREATED">Đã tạo</option>
                        <option value="READY">Sẵn sàng</option>
                        <option value="PICKED_UP">Đã lấy thuốc</option>
                        <option value="DELETED">Đã xóa</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <select class="form-control" id="paymentFilter">
                        <option value="">Tất cả thanh toán</option>
                        <option value="true">Đã thanh toán</option>
                        <option value="false">Chưa thanh toán</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <input type="text" class="form-control" id="searchInput" placeholder="Tìm kiếm đơn thuốc...">
                </div>
                <div class="col-md-3">
                    <select class="form-control" id="sortBy">
                        <option value="created_at">Sắp xếp theo ngày tạo</option>
                        <option value="total_cost">Sắp xếp theo tổng tiền</option>
                        <option value="status">Sắp xếp theo trạng thái</option>
                    </select>
                </div>
            </div>

            <!-- Prescription Cards -->
            <div id="prescriptionsList">
                <div class="text-center">
                    <i class="fas fa-spinner fa-spin fa-2x"></i>
                    <p>Đang tải dữ liệu...</p>
                </div>
            </div>
        </div>
    </div>

    <?php require_once(__DIR__ . '/../template/footer.php'); ?>
    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const statusFilter = document.getElementById('statusFilter');
            const paymentFilter = document.getElementById('paymentFilter');
            const searchInput = document.getElementById('searchInput');
            const sortBySelect = document.getElementById('sortBy');
            const prescriptionsList = document.getElementById('prescriptionsList');

            let prescriptions = [];
            let filteredPrescriptions = [];
            let modalCounter = 0;

            // Event listeners
            statusFilter.addEventListener('change', filterAndDisplayPrescriptions);
            paymentFilter.addEventListener('change', filterAndDisplayPrescriptions);
            searchInput.addEventListener('input', filterAndDisplayPrescriptions);
            sortBySelect.addEventListener('change', filterAndDisplayPrescriptions);

            async function fetchPrescriptions() {
                try {
                    const response = await fetch('http://localhost:3000/api/prescription/GetAllPrescriptions');
                    const data = await response.json();

                    console.log('API Response:', data);

                    if (data && data.prescriptions && Array.isArray(data.prescriptions)) {
                        prescriptions = data.prescriptions;
                        filterAndDisplayPrescriptions();
                    } else {
                        console.error('Invalid response structure:', data);
                        prescriptionsList.innerHTML = '<div class="alert alert-danger"><i class="fas fa-exclamation-triangle"></i> Cấu trúc dữ liệu không hợp lệ.</div>';
                    }
                } catch (error) {
                    console.error('Error fetching prescriptions:', error);
                    prescriptionsList.innerHTML = '<div class="alert alert-danger"><i class="fas fa-exclamation-triangle"></i> Có lỗi xảy ra khi tải dữ liệu đơn thuốc.</div>';
                }
            }

            function filterAndDisplayPrescriptions() {
                filteredPrescriptions = [...prescriptions];

                // Filter by status
                const selectedStatus = statusFilter.value;
                if (selectedStatus) {
                    if (selectedStatus === 'DELETED') {
                        filteredPrescriptions = filteredPrescriptions.filter(prescription => 
                            prescription.is_deleted === true
                        );
                    } else {
                        filteredPrescriptions = filteredPrescriptions.filter(prescription => 
                            prescription.status === selectedStatus && !prescription.is_deleted
                        );
                    }
                } else {
                    // Default: chỉ hiển thị đơn thuốc chưa xóa
                    filteredPrescriptions = filteredPrescriptions.filter(prescription => 
                        !prescription.is_deleted
                    );
                }

                // Filter by payment (chỉ áp dụng cho đơn thuốc chưa xóa)
                const selectedPayment = paymentFilter.value;
                if (selectedPayment && selectedStatus !== 'DELETED') {
                    const isPaid = selectedPayment === 'true';
                    filteredPrescriptions = filteredPrescriptions.filter(prescription => 
                        prescription.is_paid === isPaid
                    );
                }

                // Filter by search
                const searchTerm = searchInput.value.toLowerCase();
                if (searchTerm) {
                    filteredPrescriptions = filteredPrescriptions.filter(prescription =>
                        prescription.prescription_id.toLowerCase().includes(searchTerm) ||
                        prescription.medical_record_id.toLowerCase().includes(searchTerm) ||
                        prescription.items.some(item => 
                            item.medicine.name.toLowerCase().includes(searchTerm)
                        )
                    );
                }

                // Sort
                const sortBy = sortBySelect.value;
                filteredPrescriptions.sort((a, b) => {
                    switch (sortBy) {
                        case 'created_at':
                            return new Date(b.created_at) - new Date(a.created_at);
                        case 'total_cost':
                            return b.total_cost - a.total_cost;
                        case 'status':
                            return a.status.localeCompare(b.status);
                        default:
                            return 0;
                    }
                });

                displayPrescriptions(filteredPrescriptions);
            }

            function displayPrescriptions(prescriptionList) {
                if (!prescriptionList.length) {
                    prescriptionsList.innerHTML = '<div class="alert alert-info"><i class="fas fa-info-circle"></i> Không có đơn thuốc phù hợp với tiêu chí tìm kiếm.</div>';
                    return;
                }

                const prescriptionCards = prescriptionList.map(prescription => {
                    const isDeleted = prescription.is_deleted || false;
                    const statusClass = getStatusClass(prescription.status, isDeleted);
                    const paymentClass = prescription.is_paid ? 'bg-success' : 'bg-warning';
                    const paymentText = prescription.is_paid ? 'Đã thanh toán' : 'Chưa thanh toán';
                    
                    // Determine next status and button
                    let statusButton = '';
                    let paymentButton = '';
                    
                    if (!isDeleted) {
                        if (prescription.status === 'CREATED') {
                            statusButton = `<button onclick="updatePrescriptionStatus('${prescription.prescription_id}', 'READY')" class="btn btn-success btn-sm mb-2 me-1">
                                <i class="fas fa-check"></i> Sẵn sàng
                            </button>`;
                        } else if (prescription.status === 'READY') {
                            statusButton = `<button onclick="updatePrescriptionStatus('${prescription.prescription_id}', 'PICKED_UP')" class="btn btn-primary btn-sm mb-2 me-1">
                                <i class="fas fa-hand-holding"></i> Đã lấy thuốc
                            </button>`;
                        }
                        
                        // Payment button
                        if (!prescription.is_paid) {
                            paymentButton = `<button onclick="updatePrescriptionPayment('${prescription.prescription_id}')" class="btn btn-warning btn-sm mb-2 me-1">
                                <i class="fas fa-credit-card"></i> Thanh toán
                            </button>`;
                        }
                    }
                    
                    return `
                        <div class="prescription-card-item mb-3 ${isDeleted ? 'deleted-prescription' : ''}">
                            <div class="card prescription-item-card">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-8">
                                            <h4 class="prescription-title mb-2">
                                                Đơn thuốc #${prescription.prescription_id.substr(-8)}
                                                <span class="badge ${statusClass.class} ms-2">${statusClass.text}</span>
                                                ${!isDeleted ? `<span class="badge ${paymentClass} ms-2">${paymentText}</span>` : ''}
                                            </h4>
                                            <div class="row">
                                                <div class="col-6">
                                                    <p class="prescription-info"><strong>Mã hồ sơ:</strong> ${prescription.medical_record_id}</p>
                                                    <p class="prescription-info"><strong>Số loại thuốc:</strong> ${prescription.items.length}</p>
                                                    <p class="prescription-info price-highlight"><strong>Tổng tiền:</strong> ${formatCurrency(prescription.total_cost)}</p>
                                                </div>
                                                <div class="col-6">
                                                    <p class="prescription-info"><strong>Trạng thái:</strong> ${statusClass.text}</p>
                                                    <p class="prescription-info"><strong>Tạo lúc:</strong> ${formatDateTime(prescription.created_at)}</p>
                                                    ${prescription.updated_at ? `<p class="prescription-info"><strong>Cập nhật:</strong> ${formatDateTime(prescription.updated_at)}</p>` : ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4 text-end">
                                            <button onclick="viewPrescriptionDetails('${prescription.prescription_id}')" class="btn btn-info btn-sm mb-2 me-1">
                                                <i class="fas fa-eye"></i> Chi tiết
                                            </button>
                                            ${!isDeleted ? `
                                                ${statusButton}
                                                ${paymentButton}
                                                <button onclick="deletePrescription('${prescription.prescription_id}')" class="btn btn-danger btn-sm mb-2">
                                                    <i class="fas fa-trash"></i> Xóa
                                                </button>
                                            ` : `
                                                <button onclick="restorePrescription('${prescription.prescription_id}')" class="btn btn-success btn-sm mb-2">
                                                    <i class="fas fa-undo"></i> Khôi phục
                                                </button>
                                            `}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });

                prescriptionsList.innerHTML = prescriptionCards.join('');
            }

            function getStatusClass(status, isDeleted) {
                if (isDeleted) {
                    return { class: 'bg-danger', text: 'Đã xóa' };
                }
                
                switch (status) {
                    case 'CREATED':
                        return { class: 'bg-info', text: 'Đã tạo' };
                    case 'READY':
                        return { class: 'bg-success', text: 'Sẵn sàng' };
                    case 'PICKED_UP':
                        return { class: 'bg-secondary', text: 'Đã lấy thuốc' };
                    default:
                        return { class: 'bg-light text-dark', text: 'Không xác định' };
                }
            }

            function formatCurrency(amount) {
                return new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                }).format(amount);
            }

            function formatDateTime(dateString) {
                const date = new Date(dateString);
                return date.toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }

            // UPDATE STATUS - Cập nhật trạng thái đơn thuốc
            async function updatePrescriptionStatus(prescriptionId, newStatus) {
                const statusText = {
                    'READY': 'Sẵn sàng',
                    'PICKED_UP': 'Đã lấy thuốc'
                };

                if (!confirm(`Bạn có chắc chắn muốn cập nhật trạng thái đơn thuốc thành "${statusText[newStatus]}"?`)) {
                    return;
                }

                try {
                    // Tìm prescription trong danh sách để lấy thông tin đầy đủ
                    const prescription = prescriptions.find(p => p.prescription_id === prescriptionId);
                    if (!prescription) {
                        alert('Không tìm thấy thông tin đơn thuốc');
                        return;
                    }

                    const updateRequest = {
                        prescriptionId: prescription.prescription_id,
                        medicalRecordId: prescription.medical_record_id,
                        isPaid: prescription.is_paid,
                        status: newStatus,
                        items: prescription.items.map(item => ({
                            prescriptionItemId: item.prescription_item_id,
                            medicineId: item.medicine.medicine_id,
                            quantity: item.quantity,
                            dosageInstruction: item.dosage_instruction || ""
                        }))
                    };

                    console.log('Update status request:', JSON.stringify(updateRequest, null, 2));

                    const response = await fetch(`http://localhost:3000/api/prescription/UpdatePrescription/${prescriptionId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updateRequest)
                    });

                    if (response.ok) {
                        alert(`Cập nhật trạng thái thành "${statusText[newStatus]}" thành công!`);
                        removeExistingModals();
                        fetchPrescriptions();
                    } else {
                        const errorText = await response.text();
                        console.error('Error response:', response.status, errorText);
                        alert(`Có lỗi xảy ra khi cập nhật trạng thái: ${response.status} - ${errorText}`);
                    }
                } catch (error) {
                    console.error('Error updating prescription status:', error);
                    alert('Có lỗi xảy ra khi cập nhật trạng thái: ' + error.message);
                }
            }

            // UPDATE PAYMENT - Cập nhật thanh toán
            async function updatePrescriptionPayment(prescriptionId) {
                if (!confirm('Bạn có chắc chắn muốn đánh dấu đơn thuốc này là đã thanh toán?')) {
                    return;
                }

                try {
                    // Tìm prescription trong danh sách để lấy thông tin đầy đủ
                    const prescription = prescriptions.find(p => p.prescription_id === prescriptionId);
                    if (!prescription) {
                        alert('Không tìm thấy thông tin đơn thuốc');
                        return;
                    }

                    const updateRequest = {
                        prescriptionId: prescription.prescription_id,
                        medicalRecordId: prescription.medical_record_id,
                        isPaid: true,
                        status: prescription.status,
                        items: prescription.items.map(item => ({
                            prescriptionItemId: item.prescription_item_id,
                            medicineId: item.medicine.medicine_id,
                            quantity: item.quantity,
                            dosageInstruction: item.dosage_instruction || ""
                        }))
                    };

                    console.log('Update payment request:', JSON.stringify(updateRequest, null, 2));

                    const response = await fetch(`http://localhost:3000/api/prescription/UpdatePrescription/${prescriptionId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updateRequest)
                    });

                    if (response.ok) {
                        alert('Cập nhật thanh toán thành công!');
                        removeExistingModals();
                        fetchPrescriptions();
                    } else {
                        const errorText = await response.text();
                        console.error('Error response:', response.status, errorText);
                        alert(`Có lỗi xảy ra khi cập nhật thanh toán: ${response.status} - ${errorText}`);
                    }
                } catch (error) {
                    console.error('Error updating prescription payment:', error);
                    alert('Có lỗi xảy ra khi cập nhật thanh toán: ' + error.message);
                }
            }

            // VIEW - Xem chi tiết đơn thuốc
            async function viewPrescriptionDetails(prescriptionId) {
                try {
                    const response = await fetch(`http://localhost:3000/api/prescription/GetPrescriptionById/${prescriptionId}`);
                    const data = await response.json();

                    if (data && data.prescription_id) {
                        modalCounter++;
                        const modalId = `prescriptionModal_${modalCounter}`;
                        const prescription = data;
                        const statusClass = getStatusClass(prescription.status);
                        const paymentClass = prescription.is_paid ? 'bg-success' : 'bg-warning';
                        const paymentText = prescription.is_paid ? 'Đã thanh toán' : 'Chưa thanh toán';
                        
                        const modalContent = `
                            <div class="modal fade" id="${modalId}" tabindex="-1">
                                <div class="modal-dialog modal-xl">
                                    <div class="modal-content">
                                        <div class="modal-header bg-info text-white">
                                            <h5 class="modal-title">
                                                <i class="fas fa-prescription me-2"></i>Chi tiết đơn thuốc #${prescription.prescription_id.substr(-8)}
                                            </h5>
                                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                        </div>
                                        <div class="modal-body prescription-detail-body">
                                            <div class="row mb-4">
                                                <div class="col-md-6">
                                                    <div class="detail-item">
                                                        <strong class="detail-label">ID đơn thuốc:</strong>
                                                        <span class="detail-value">${prescription.prescription_id}</span>
                                                    </div>
                                                    <div class="detail-item">
                                                        <strong class="detail-label">Mã hồ sơ:</strong>
                                                        <span class="detail-value">${prescription.medical_record_id}</span>
                                                    </div>
                                                    <div class="detail-item">
                                                        <strong class="detail-label">Trạng thái:</strong>
                                                        <span class="badge ${statusClass.class}">${statusClass.text}</span>
                                                    </div>
                                                    <div class="detail-item">
                                                        <strong class="detail-label">Thanh toán:</strong>
                                                        <span class="badge ${paymentClass}">${paymentText}</span>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="detail-item">
                                                        <strong class="detail-label">Tổng tiền:</strong>
                                                        <span class="detail-value price-value">${formatCurrency(prescription.total_cost)}</span>
                                                    </div>
                                                    <div class="detail-item">
                                                        <strong class="detail-label">Tạo lúc:</strong>
                                                        <span class="detail-value">${formatDateTime(prescription.created_at)}</span>
                                                    </div>
                                                    ${prescription.updated_at ? `
                                                    <div class="detail-item">
                                                        <strong class="detail-label">Cập nhật:</strong>
                                                        <span class="detail-value">${formatDateTime(prescription.updated_at)}</span>
                                                    </div>` : ''}
                                                </div>
                                            </div>
                                            <h6><strong>Danh sách thuốc:</strong></h6>
                                            <div class="table-responsive">
                                                <table class="table table-bordered">
                                                    <thead class="table-light">
                                                        <tr>
                                                            <th>Tên thuốc</th>
                                                            <th>Đơn vị</th>
                                                            <th>Số lượng</th>
                                                            <th>Đơn giá</th>
                                                            <th>Thành tiền</th>
                                                            <th>Hướng dẫn sử dụng</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        ${prescription.items.map(item => `
                                                            <tr>
                                                                <td>${item.medicine.name}</td>
                                                                <td>${item.medicine.unit}</td>
                                                                <td>${item.quantity}</td>
                                                                <td>${formatCurrency(item.medicine.price)}</td>
                                                                <td>${formatCurrency(item.total_cost)}</td>
                                                                <td>${item.dosage_instruction || 'Không có'}</td>
                                                            </tr>
                                                        `).join('')}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                                <i class="fas fa-times me-1"></i>Đóng
                                            </button>
                                            <button type="button" class="btn btn-danger" onclick="deletePrescription('${prescription.prescription_id}')">
                                                <i class="fas fa-trash me-1"></i>Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        removeExistingModals();
                        document.body.insertAdjacentHTML('beforeend', modalContent);
                        const modal = new bootstrap.Modal(document.getElementById(modalId));
                        modal.show();
                    } else {
                        alert('Không thể tải chi tiết đơn thuốc');
                    }
                } catch (error) {
                    console.error('Error fetching prescription details:', error);
                    alert('Có lỗi xảy ra khi tải chi tiết đơn thuốc');
                }
            }

            // DELETE - Xóa đơn thuốc
            async function deletePrescription(prescriptionId) {
                if (!confirm(`Bạn có chắc chắn muốn xóa đơn thuốc #${prescriptionId.substr(-8)}?`)) {
                    return;
                }

                try {
                    const response = await fetch(`http://localhost:3000/api/prescription/DeletePrescription/${prescriptionId}`, {
                        method: 'PUT'
                    });

                    if (response.ok) {
                        alert('Xóa đơn thuốc thành công!');
                        removeExistingModals();
                        fetchPrescriptions();
                    } else {
                        const errorText = await response.text();
                        console.error('Error response:', response.status, errorText);
                        alert(`Có lỗi xảy ra khi xóa đơn thuốc: ${response.status} - ${errorText}`);
                    }
                } catch (error) {
                    console.error('Error deleting prescription:', error);
                    alert('Có lỗi xảy ra khi xóa đơn thuốc: ' + error.message);
                }
            }

            // RESTORE - Khôi phục đơn thuốc (sử dụng endpoint riêng)
            async function restorePrescription(prescriptionId) {
                if (!confirm(`Bạn có chắc chắn muốn khôi phục đơn thuốc #${prescriptionId.substr(-8)}?`)) {
                    return;
                }

                try {
                    const response = await fetch(`http://localhost:3000/api/prescription/RestorePrescription/${prescriptionId}`, {
                        method: 'PUT'
                    });

                    if (response.ok) {
                        alert('Khôi phục đơn thuốc thành công!');
                        removeExistingModals();
                        fetchPrescriptions();
                    } else {
                        const errorText = await response.text();
                        console.error('Error response:', response.status, errorText);
                        alert(`Có lỗi xảy ra khi khôi phục đơn thuốc: ${response.status} - ${errorText}`);
                    }
                } catch (error) {
                    console.error('Error restoring prescription:', error);
                    alert('Có lỗi xảy ra khi khôi phục đơn thuốc: ' + error.message);
                }
            }

            function removeExistingModals() {
                const existingModals = document.querySelectorAll('.modal');
                existingModals.forEach(modal => {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    if (modalInstance) {
                        modalInstance.dispose();
                    }
                    modal.remove();
                });
                
                const backdrops = document.querySelectorAll('.modal-backdrop');
                backdrops.forEach(backdrop => backdrop.remove());
                
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }

            // Make functions global
            window.viewPrescriptionDetails = viewPrescriptionDetails;
            window.updatePrescriptionStatus = updatePrescriptionStatus;
            window.updatePrescriptionPayment = updatePrescriptionPayment;
            window.deletePrescription = deletePrescription;
            window.removeExistingModals = removeExistingModals;
            window.restorePrescription = restorePrescription;

            // Initialize
            fetchPrescriptions();
        });
    </script>

    <style>
        .prescription-card-item {
            transition: all 0.3s ease;
        }

        .prescription-card-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .prescription-item-card {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
        }

        .prescription-title {
            color: #2c3e50;
            font-weight: 600;
        }

        .prescription-info {
            margin-bottom: 0.5rem;
            color: #555;
        }

        .price-highlight {
            color: #27ae60;
            font-weight: 600;
        }

        .prescription-detail-body {
            max-height: 70vh;
            overflow-y: auto;
        }

        .detail-item {
            margin-bottom: 1rem;
        }

        .detail-label {
            color: #2c3e50;
            margin-right: 0.5rem;
        }

        .detail-value {
            color: #555;
        }

        .price-value {
            color: #27ae60;
            font-weight: 600;
            font-size: 1.1em;
        }

        .table th {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #2c3e50;
        }

        .badge {
            font-size: 0.8em;
        }

        /* Deleted prescription styles */
        .deleted-prescription {
            opacity: 0.7;
        }

        .deleted-prescription .prescription-item-card {
            border-color: #dc3545;
            background-color: #f8f9fa;
        }

        .deleted-prescription .prescription-title {
            color: #6c757d;
        }

        .deleted-prescription .prescription-info {
            color: #6c757d;
        }
    </style>
</body>
</html>