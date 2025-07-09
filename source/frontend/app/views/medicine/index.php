<?php
$title = 'MedPortal - Quản lý Thuốc';
$description = 'Các chức năng quản lý thuốc và dược phẩm.';
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
                <a href="#medicineList" class="action-btn">
                    <i class="fas fa-list"></i>
                    <span>Danh sách thuốc</span>
                </a>
                <button onclick="openCreateModal()" class="action-btn">
                    <i class="fas fa-plus"></i>
                    <span>Thêm thuốc mới</span>
                </button>
            </div>
        </div>

        <!-- Medicine List -->
        <div class="dashboard-card slide-up" id="medicineList">
            <div class="card-header">
                <div class="card-icon">
                    <i class="fas fa-list"></i>
                </div>
                <div>
                    <h3 class="card-title">Danh Sách Thuốc</h3>
                    <p class="card-subtitle">Quản lý thông tin thuốc</p>
                </div>
            </div>

            <!-- Filters -->
            <div class="row mb-3">
                <div class="col-md-3">
                    <select class="form-control" id="supplierFilter">
                        <option value="">Tất cả nhà cung cấp</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <input type="text" class="form-control" id="searchInput" placeholder="Tìm kiếm thuốc...">
                </div>
                <div class="col-md-3">
                    <select class="form-control" id="sortBy">
                        <option value="name">Sắp xếp theo tên</option>
                        <option value="price">Sắp xếp theo giá</option>
                        <option value="stock">Sắp xếp theo tồn kho</option>
                        <option value="supplier">Sắp xếp theo nhà cung cấp</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <select class="form-control" id="stockFilter">
                        <option value="">Tất cả trạng thái</option>
                        <option value="available">Còn hàng</option>
                        <option value="low">Sắp hết (< 100)</option>
                        <option value="out">Hết hàng</option>
                    </select>
                </div>
            </div>

            <!-- Medicine Cards -->
            <div id="medicinesList">
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
            const supplierFilter = document.getElementById('supplierFilter');
            const searchInput = document.getElementById('searchInput');
            const sortBySelect = document.getElementById('sortBy');
            const stockFilter = document.getElementById('stockFilter');
            const medicinesList = document.getElementById('medicinesList');

            let medicines = [];
            let filteredMedicines = [];
            let modalCounter = 0; // Counter để tạo unique modal ID

            // Event listeners
            supplierFilter.addEventListener('change', filterAndDisplayMedicines);
            searchInput.addEventListener('input', filterAndDisplayMedicines);
            sortBySelect.addEventListener('change', filterAndDisplayMedicines);
            stockFilter.addEventListener('change', filterAndDisplayMedicines);

            async function fetchMedicines() {
                try {
                    const response = await fetch('http://localhost:3000/api/medicine/GetAllMedicines');
                    const data = await response.json();

                    console.log('API Response:', data);

                    if (data && data.medicines && Array.isArray(data.medicines)) {
                        medicines = data.medicines;
                        populateSupplierFilter();
                        filterAndDisplayMedicines();
                    } else {
                        console.error('Invalid response structure:', data);
                        medicinesList.innerHTML = '<div class="alert alert-danger"><i class="fas fa-exclamation-triangle"></i> Cấu trúc dữ liệu không hợp lệ.</div>';
                    }
                } catch (error) {
                    console.error('Error fetching medicines:', error);
                    medicinesList.innerHTML = '<div class="alert alert-danger"><i class="fas fa-exclamation-triangle"></i> Có lỗi xảy ra khi tải dữ liệu thuốc.</div>';
                }
            }

            function populateSupplierFilter() {
                const suppliers = [...new Set(medicines.map(medicine => medicine.supplier))];
                supplierFilter.innerHTML = '<option value="">Tất cả nhà cung cấp</option>';
                suppliers.forEach(supplier => {
                    const option = document.createElement('option');
                    option.value = supplier;
                    option.textContent = supplier;
                    supplierFilter.appendChild(option);
                });
            }

            function filterAndDisplayMedicines() {
                filteredMedicines = [...medicines];

                // Filter by supplier
                const selectedSupplier = supplierFilter.value;
                if (selectedSupplier) {
                    filteredMedicines = filteredMedicines.filter(medicine => 
                        medicine.supplier === selectedSupplier
                    );
                }

                // Filter by search
                const searchTerm = searchInput.value.toLowerCase();
                if (searchTerm) {
                    filteredMedicines = filteredMedicines.filter(medicine =>
                        medicine.name.toLowerCase().includes(searchTerm) ||
                        medicine.supplier.toLowerCase().includes(searchTerm) ||
                        medicine.unit.toLowerCase().includes(searchTerm)
                    );
                }

                // Filter by stock status
                const stockStatus = stockFilter.value;
                if (stockStatus) {
                    switch (stockStatus) {
                        case 'available':
                            filteredMedicines = filteredMedicines.filter(medicine => medicine.stock_quantity > 0);
                            break;
                        case 'low':
                            filteredMedicines = filteredMedicines.filter(medicine => medicine.stock_quantity > 0 && medicine.stock_quantity < 100);
                            break;
                        case 'out':
                            filteredMedicines = filteredMedicines.filter(medicine => medicine.stock_quantity === 0);
                            break;
                    }
                }

                // Sort
                const sortBy = sortBySelect.value;
                filteredMedicines.sort((a, b) => {
                    switch (sortBy) {
                        case 'name':
                            return a.name.localeCompare(b.name);
                        case 'price':
                            return a.price - b.price;
                        case 'stock':
                            return b.stock_quantity - a.stock_quantity;
                        case 'supplier':
                            return a.supplier.localeCompare(b.supplier);
                        default:
                            return 0;
                    }
                });

                displayMedicines(filteredMedicines);
            }

            function displayMedicines(medicineList) {
                if (!medicineList.length) {
                    medicinesList.innerHTML = '<div class="alert alert-info"><i class="fas fa-info-circle"></i> Không có thuốc phù hợp với tiêu chí tìm kiếm.</div>';
                    return;
                }

                const medicineCards = medicineList.map(medicine => {
                    const stockStatus = getStockStatus(medicine.stock_quantity);
                    return `
                        <div class="medicine-card-item mb-3">
                            <div class="card medicine-item-card">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-8">
                                            <h4 class="medicine-title mb-2">
                                                ${medicine.name}
                                                <span class="badge ${stockStatus.class} ms-2">${stockStatus.text}</span>
                                            </h4>
                                            <div class="row">
                                                <div class="col-6">
                                                    <p class="medicine-info"><strong>Đơn vị:</strong> ${medicine.unit}</p>
                                                    <p class="medicine-info"><strong>Nhà cung cấp:</strong> ${medicine.supplier}</p>
                                                    <p class="medicine-info price-highlight"><strong>Giá:</strong> ${formatCurrency(medicine.price)}/${medicine.unit}</p>
                                                </div>
                                                <div class="col-6">
                                                    <p class="medicine-info"><strong>Tồn kho:</strong> ${medicine.stock_quantity.toLocaleString()} ${medicine.unit}</p>
                                                    <p class="medicine-info"><strong>Tạo lúc:</strong> ${formatDateTime(medicine.created_at)}</p>
                                                    ${medicine.updated_at ? `<p class="medicine-info"><strong>Cập nhật:</strong> ${formatDateTime(medicine.updated_at)}</p>` : ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4 text-end">
                                            <button onclick="viewMedicineDetails('${medicine.medicine_id}')" class="btn btn-info btn-sm mb-2 me-1">
                                                <i class="fas fa-eye"></i> Chi tiết
                                            </button>
                                            <button onclick="editMedicine('${medicine.medicine_id}')" class="btn btn-warning btn-sm mb-2 me-1">
                                                <i class="fas fa-edit"></i> Sửa
                                            </button>
                                            <button onclick="deleteMedicine('${medicine.medicine_id}', '${medicine.name}')" class="btn btn-danger btn-sm mb-2">
                                                <i class="fas fa-trash"></i> Xóa
                                            </button>
                                            ${medicine.stock_quantity < 100 ? 
                                                `<div class="alert alert-warning alert-sm mt-2">
                                                    <i class="fas fa-exclamation-triangle"></i> Sắp hết hàng
                                                </div>` : ''
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });

                medicinesList.innerHTML = medicineCards.join('');
            }

            function getStockStatus(stockQuantity) {
                if (stockQuantity === 0) {
                    return { class: 'bg-danger', text: 'Hết hàng' };
                } else if (stockQuantity < 100) {
                    return { class: 'bg-warning text-dark', text: 'Sắp hết' };
                } else {
                    return { class: 'bg-success', text: 'Còn hàng' };
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

            // CREATE - Thêm thuốc mới
            function openCreateModal() {
                modalCounter++;
                const modalId = `medicineModal_${modalCounter}`;
                const formId = `medicineForm_${modalCounter}`;
                
                const modalContent = `
                    <div class="modal fade" id="${modalId}" tabindex="-1">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header bg-primary text-white">
                                    <h5 class="modal-title">
                                        <i class="fas fa-plus me-2"></i>Thêm thuốc mới
                                    </h5>
                                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <form id="${formId}" class="medicine-form">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3 form-group-custom">
                                                    <label for="medicineName_${modalCounter}" class="form-label-custom">Tên thuốc *</label>
                                                    <input type="text" class="form-control form-input-custom" id="medicineName_${modalCounter}" required>
                                                </div>
                                                <div class="mb-3 form-group-custom">
                                                    <label for="medicineUnit_${modalCounter}" class="form-label-custom">Đơn vị *</label>
                                                    <input type="text" class="form-control form-input-custom" id="medicineUnit_${modalCounter}" required>
                                                </div>
                                                <div class="mb-3 form-group-custom">
                                                    <label for="medicineSupplier_${modalCounter}" class="form-label-custom">Nhà cung cấp *</label>
                                                    <input type="text" class="form-control form-input-custom" id="medicineSupplier_${modalCounter}" required>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3 form-group-custom">
                                                    <label for="medicinePrice_${modalCounter}" class="form-label-custom">Giá (VND) *</label>
                                                    <input type="number" class="form-control form-input-custom" id="medicinePrice_${modalCounter}" min="0" required>
                                                </div>
                                                <div class="mb-3 form-group-custom">
                                                    <label for="medicineStock_${modalCounter}" class="form-label-custom">Số lượng tồn kho *</label>
                                                    <input type="number" class="form-control form-input-custom" id="medicineStock_${modalCounter}" min="0" required>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                        <i class="fas fa-times me-1"></i>Hủy
                                    </button>
                                    <button type="button" class="btn btn-primary" onclick="saveMedicine('${modalId}', '${formId}')">
                                        <i class="fas fa-save me-1"></i>Lưu
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
            }

            // VIEW - Xem chi tiết thuốc
            async function viewMedicineDetails(medicineId) {
                try {
                    const response = await fetch(`http://localhost:3000/api/medicine/GetMedicineById/${medicineId}`);
                    const data = await response.json();

                    if (data && data.medicine_id) {
                        modalCounter++;
                        const modalId = `medicineModal_${modalCounter}`;
                        const medicine = data;
                        
                        const modalContent = `
                            <div class="modal fade" id="${modalId}" tabindex="-1">
                                <div class="modal-dialog modal-lg">
                                    <div class="modal-content">
                                        <div class="modal-header bg-info text-white">
                                            <h5 class="modal-title">
                                                <i class="fas fa-eye me-2"></i>Chi tiết thuốc: ${medicine.name}
                                            </h5>
                                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                        </div>
                                        <div class="modal-body medicine-detail-body">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="detail-item">
                                                        <strong class="detail-label">ID:</strong>
                                                        <span class="detail-value">${medicine.medicine_id}</span>
                                                    </div>
                                                    <div class="detail-item">
                                                        <strong class="detail-label">Tên thuốc:</strong>
                                                        <span class="detail-value">${medicine.name}</span>
                                                    </div>
                                                    <div class="detail-item">
                                                        <strong class="detail-label">Đơn vị:</strong>
                                                        <span class="detail-value">${medicine.unit}</span>
                                                    </div>
                                                    <div class="detail-item">
                                                        <strong class="detail-label">Nhà cung cấp:</strong>
                                                        <span class="detail-value">${medicine.supplier}</span>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="detail-item">
                                                        <strong class="detail-label">Giá:</strong>
                                                        <span class="detail-value price-value">${formatCurrency(medicine.price)}/${medicine.unit}</span>
                                                    </div>
                                                    <div class="detail-item">
                                                        <strong class="detail-label">Tồn kho:</strong>
                                                        <span class="detail-value stock-value">${medicine.stock_quantity.toLocaleString()} ${medicine.unit}</span>
                                                    </div>
                                                    <div class="detail-item">
                                                        <strong class="detail-label">Tạo lúc:</strong>
                                                        <span class="detail-value">${formatDateTime(medicine.created_at)}</span>
                                                    </div>
                                                    ${medicine.updated_at ? `
                                                    <div class="detail-item">
                                                        <strong class="detail-label">Cập nhật:</strong>
                                                        <span class="detail-value">${formatDateTime(medicine.updated_at)}</span>
                                                    </div>` : ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                                <i class="fas fa-times me-1"></i>Đóng
                                            </button>
                                            <button type="button" class="btn btn-warning" onclick="editMedicine('${medicine.medicine_id}')">
                                                <i class="fas fa-edit me-1"></i>Sửa
                                            </button>
                                            <button type="button" class="btn btn-danger" onclick="deleteMedicine('${medicine.medicine_id}', '${medicine.name}')">
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
                        alert('Không thể tải chi tiết thuốc');
                    }
                } catch (error) {
                    console.error('Error fetching medicine details:', error);
                    alert('Có lỗi xảy ra khi tải chi tiết thuốc');
                }
            }

            // EDIT - Sửa thuốc
            async function editMedicine(medicineId) {
                try {
                    // Đóng tất cả modal hiện tại
                    removeExistingModals();

                    const response = await fetch(`http://localhost:3000/api/medicine/GetMedicineById/${medicineId}`);
                    const data = await response.json();

                    if (data && data.medicine_id) {
                        modalCounter++;
                        const modalId = `medicineModal_${modalCounter}`;
                        const formId = `medicineForm_${modalCounter}`;
                        const medicine = data;
                        
                        setTimeout(() => {
                            const modalContent = `
                                <div class="modal fade" id="${modalId}" tabindex="-1">
                                    <div class="modal-dialog modal-lg">
                                        <div class="modal-content">
                                            <div class="modal-header bg-warning text-dark">
                                                <h5 class="modal-title">
                                                    <i class="fas fa-edit me-2"></i>Sửa thuốc: ${medicine.name}
                                                </h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                            </div>
                                            <div class="modal-body">
                                                <form id="${formId}" class="medicine-form">
                                                    <input type="hidden" id="medicineId_${modalCounter}" value="${medicine.medicine_id}">
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="mb-3 form-group-custom">
                                                                <label for="medicineName_${modalCounter}" class="form-label-custom">Tên thuốc *</label>
                                                                <input type="text" class="form-control form-input-custom" id="medicineName_${modalCounter}" value="${medicine.name}" required>
                                                            </div>
                                                            <div class="mb-3 form-group-custom">
                                                                <label for="medicineUnit_${modalCounter}" class="form-label-custom">Đơn vị *</label>
                                                                <input type="text" class="form-control form-input-custom" id="medicineUnit_${modalCounter}" value="${medicine.unit}" required>
                                                            </div>
                                                            <div class="mb-3 form-group-custom">
                                                                <label for="medicineSupplier_${modalCounter}" class="form-label-custom">Nhà cung cấp *</label>
                                                                <input type="text" class="form-control form-input-custom" id="medicineSupplier_${modalCounter}" value="${medicine.supplier}" required>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="mb-3 form-group-custom">
                                                                <label for="medicinePrice_${modalCounter}" class="form-label-custom">Giá (VND) *</label>
                                                                <input type="number" class="form-control form-input-custom" id="medicinePrice_${modalCounter}" value="${medicine.price}" min="0" required>
                                                            </div>
                                                            <div class="mb-3 form-group-custom">
                                                                <label for="medicineStock_${modalCounter}" class="form-label-custom">Số lượng tồn kho *</label>
                                                                <input type="number" class="form-control form-input-custom" id="medicineStock_${modalCounter}" value="${medicine.stock_quantity}" min="0" required>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                                    <i class="fas fa-times me-1"></i>Hủy
                                                </button>
                                                <button type="button" class="btn btn-primary" onclick="saveMedicine('${modalId}', '${formId}')">
                                                    <i class="fas fa-save me-1"></i>Cập nhật
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                            
                            document.body.insertAdjacentHTML('beforeend', modalContent);
                            const modal = new bootstrap.Modal(document.getElementById(modalId));
                            modal.show();
                        }, 200);
                    } else {
                        alert('Không thể tải thông tin thuốc');
                    }
                } catch (error) {
                    console.error('Error fetching medicine details:', error);
                    alert('Có lỗi xảy ra khi tải thông tin thuốc');
                }
            }

            // SAVE - Lưu thuốc (tạo mới hoặc cập nhật)
            async function saveMedicine(modalId, formId) {
                const form = document.getElementById(formId);
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                const counter = modalId.split('_')[1];
                const medicineId = document.getElementById(`medicineId_${counter}`)?.value;
                const medicineData = {
                    name: document.getElementById(`medicineName_${counter}`).value,
                    unit: document.getElementById(`medicineUnit_${counter}`).value,
                    supplier: document.getElementById(`medicineSupplier_${counter}`).value,
                    price: parseFloat(document.getElementById(`medicinePrice_${counter}`).value),
                    stock_quantity: parseInt(document.getElementById(`medicineStock_${counter}`).value)
                };

                console.log('Saving medicine data:', medicineData);
                console.log('Medicine ID:', medicineId);

                try {
                    let response;
                    let url;
                    let requestBody;

                    if (medicineId) {
                        // Update existing medicine - theo đúng proto: URL không có ID, ID trong body
                        url = `http://localhost:3000/api/medicine/UpdateMedicine/${medicineId}`;
                        requestBody = {
                            medicine_id: medicineId,
                            name: medicineData.name,
                            unit: medicineData.unit,
                            supplier: medicineData.supplier,
                            price: medicineData.price,
                            stock_quantity: medicineData.stock_quantity
                        };
                        
                        console.log('Updating medicine with URL:', url);
                        console.log('Request body:', requestBody);
                        
                        response = await fetch(url, {
                            method: 'PUT',  // Sử dụng PUT method
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(requestBody)
                        });
                    } else {
                        // Create new medicine - theo CreateMedicineRequest
                        url = `http://localhost:3000/api/medicine/CreateMedicine`;
                        requestBody = {
                            name: medicineData.name,
                            unit: medicineData.unit,
                            supplier: medicineData.supplier,
                            price: medicineData.price,
                            stock_quantity: medicineData.stock_quantity
                        };
                        
                        console.log('Creating new medicine with URL:', url);
                        console.log('Request body:', requestBody);
                        
                        response = await fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(requestBody)
                        });
                    }

                    console.log('Response status:', response.status);
                    console.log('Response URL:', response.url);

                    if (response.ok) {
                        const result = await response.json();
                        console.log('Success result:', result);
                        
                        alert(medicineId ? 'Cập nhật thuốc thành công!' : 'Thêm thuốc mới thành công!');
                        
                        // Đóng modal
                        const modalElement = document.getElementById(modalId);
                        if (modalElement) {
                            const modalInstance = bootstrap.Modal.getInstance(modalElement);
                            if (modalInstance) {
                                modalInstance.hide();
                            }
                        }
                        
                        // Refresh danh sách
                        setTimeout(() => {
                            removeExistingModals();
                            fetchMedicines();
                        }, 300);
                    } else {
                        const errorText = await response.text();
                        console.error('Error response:', response.status, errorText);
                        alert(`Có lỗi xảy ra: ${response.status} - ${errorText}`);
                    }
                } catch (error) {
                    console.error('Error saving medicine:', error);
                    alert('Có lỗi xảy ra khi lưu thuốc: ' + error.message);
                }
            }

            // DELETE - Xóa thuốc
            async function deleteMedicine(medicineId, medicineName) {
                if (!confirm(`Bạn có chắc chắn muốn xóa thuốc "${medicineName}"?`)) {
                    return;
                }

                try {
                    const response = await fetch(`http://localhost:3000/api/medicine/DeleteMedicine/${medicineId}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        alert('Xóa thuốc thành công!');
                        // Đóng modal nếu có
                        removeExistingModals();
                        fetchMedicines(); // Refresh danh sách
                    } else {
                        alert('Có lỗi xảy ra khi xóa thuốc');
                    }
                } catch (error) {
                    console.error('Error deleting medicine:', error);
                    alert('Có lỗi xảy ra khi xóa thuốc');
                }
            }

            function removeExistingModals() {
                // Xóa tất cả modal có class modal
                const existingModals = document.querySelectorAll('.modal');
                existingModals.forEach(modal => {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    if (modalInstance) {
                        modalInstance.dispose();
                    }
                    modal.remove();
                });
                
                // Xóa backdrop
                const backdrops = document.querySelectorAll('.modal-backdrop');
                backdrops.forEach(backdrop => backdrop.remove());
                
                // Reset body
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }

            // Make functions global
            window.openCreateModal = openCreateModal;
            window.viewMedicineDetails = viewMedicineDetails;
            window.editMedicine = editMedicine;
            window.deleteMedicine = deleteMedicine;
            window.saveMedicine = saveMedicine;

            // Initialize
            fetchMedicines();
        });
    </script>

    <style>
        /* Medicine Cards */
        .medicine-card-item {
            transition: transform 0.2s;
            border-radius: 10px;
            overflow: hidden;
        }

        .medicine-card-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .medicine-item-card {
            border: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            border-radius: 10px;
        }

        .medicine-title {
            color: #2c3e50;
            font-weight: 700;
            font-size: 1.3rem;
            margin-bottom: 0.75rem;
        }

        .medicine-info {
            color: #495057;
            margin-bottom: 0.5rem;
            font-size: 0.95rem;
            line-height: 1.4;
        }

        .medicine-info strong {
            color: #343a40;
            font-weight: 600;
        }

        .price-highlight {
            color: #28a745;
            font-weight: 600;
        }

        .price-highlight strong {
            color: #28a745;
        }

        /* Modal Styles */
        .medicine-form {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
        }

        .form-group-custom {
            margin-bottom: 1rem;
        }

        .form-label-custom {
            font-weight: 600;
            color: #495057;
            margin-bottom: 0.5rem;
        }

        .form-input-custom {
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 0.75rem;
            transition: border-color 0.3s ease;
        }

        .form-input-custom:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .medicine-detail-body {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
        }

        .detail-item {
            margin-bottom: 1rem;
            padding: 0.5rem 0;
            border-bottom: 1px solid #e9ecef;
        }

        .detail-item:last-child {
            border-bottom: none;
        }

        .detail-label {
            color: #6c757d;
            font-weight: 600;
            display: inline-block;
            min-width: 120px;
        }

        .detail-value {
            color: #495057;
            font-weight: 500;
        }

        .price-value {
            color: #28a745;
            font-weight: 600;
        }

        .stock-value {
            color: #17a2b8;
            font-weight: 600;
        }

        /* Alert */
        .alert-sm {
            padding: 0.5rem;
            font-size: 0.8rem;
            border-radius: 5px;
        }

        /* Badge */
        .badge {
            font-size: 0.75rem;
            padding: 0.4rem 0.8rem;
            border-radius: 20px;
        }

        /* Buttons */
        .btn-info {
            background-color: #17a2b8;
            border-color: #17a2b8;
            font-weight: 500;
        }

        .btn-info:hover {
            background-color: #138496;
            border-color: #117a8b;
        }

        .action-btn {
            display: inline-flex;
            align-items: center;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 500;
            transition: all 0.3s ease;
            margin-right: 1rem;
            margin-bottom: 1rem;
            border: none;
            cursor: pointer;
        }

        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            color: white;
            text-decoration: none;
        }

        .action-btn i {
            margin-right: 0.5rem;
        }
    </style>
</body>
</html>