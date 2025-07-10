<?php
$title = 'Hồ Sơ Bệnh Nhân';
require_once(__DIR__ . '/../template/header.php');
require_once(__DIR__ . '/../template/navbar.php');

// Lấy dữ liệu từ userInfo
$fullName = trim(($userInfo['lastName'] ?? '') . ' ' . ($userInfo['firstName'] ?? ''));
$createdAt = isset($userInfo['createdAt']['seconds']) ? 
    (new DateTime())->setTimestamp($userInfo['createdAt']['seconds'])->format('d/m/Y H:i') : 'N/A';
$dateOfBirth = isset($userInfo['dateOfBirth']) ? 
    (new DateTime($userInfo['dateOfBirth']))->format('d/m/Y') : 'N/A';
?>

<div class="container-fluid py-4">
    <!-- Header Section -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card border-0 shadow-sm bg-gradient-primary text-white">
                <div class="card-body py-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-1"><i class="fas fa-user-circle me-2"></i><?= $title ?></h1>
                            <p class="mb-0 opacity-75">Quản lý thông tin và lịch sử khám bệnh</p>
                        </div>
                        <div class="d-flex gap-2">
                            <a href="/patient/history" class="btn btn-light btn-lg">
                                <i class="fas fa-history me-2"></i>Lịch Sử Lịch hẹn
                            </a>
                            <a href="/patient/edit" class="btn btn-outline-light btn-lg">
                                <i class="fas fa-edit me-2"></i>Chỉnh Sửa
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <!-- Personal Information -->
        <div class="col-lg-8 mb-4">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white border-0 pb-0">
                    <div class="d-flex align-items-center">
                        <div class="icon-shape icon-sm bg-primary text-white rounded-circle me-3">
                            <i class="fas fa-user"></i>
                        </div>
                        <div>
                            <h5 class="card-title mb-0 text-dark">Thông Tin Cá Nhân</h5>
                            <small class="text-muted">Chi tiết thông tin bệnh nhân</small>
                        </div>
                    </div>
                </div>
                <div class="card-body pt-3">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <div class="info-item">
                                <label class="form-label text-muted mb-1">Họ và tên</label>
                                <div class="fw-semibold"><?= htmlspecialchars($fullName ?: 'Chưa cập nhật') ?></div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <label class="form-label text-muted mb-1">Email</label>
                                <div class="fw-semibold"><?= htmlspecialchars($userInfo['email'] ?? 'Chưa cập nhật') ?></div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <label class="form-label text-muted mb-1">Số điện thoại</label>
                                <div class="fw-semibold"><?= htmlspecialchars($userInfo['phone'] ?? 'Chưa cập nhật') ?></div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <label class="form-label text-muted mb-1">Ngày sinh</label>
                                <div class="fw-semibold"><?= $dateOfBirth ?></div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="info-item">
                                <label class="form-label text-muted mb-1">Địa chỉ</label>
                                <div class="fw-semibold"><?= htmlspecialchars($userInfo['address'] ?? 'Chưa cập nhật') ?></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Stats -->
        <div class="col-lg-4 mb-4">
            <div class="row g-3">
                <div class="col-12">
                    <div class="card border-0 shadow-sm bg-success text-white">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="icon-shape icon-lg bg-white text-success rounded-circle me-3">
                                    <i class="fas fa-calendar-check"></i>
                                </div>
                                <div>
                                    <h6 class="mb-1">Lần khám gần nhất</h6>
                                    <p class="mb-0 h5">
                                        <?= !empty($visitHistory) ? (new DateTime($visitHistory[0]['visit_date']))->format('d/m/Y') : 'Chưa có' ?>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="card border-0 shadow-sm bg-info text-white">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="icon-shape icon-lg bg-white text-info rounded-circle me-3">
                                    <i class="fas fa-chart-line"></i>
                                </div>
                                <div>
                                    <h6 class="mb-1">Tổng lượt khám</h6>
                                    <p class="mb-0 h5"><?= count($visitHistory ?? []) ?> lượt</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="card border-0 shadow-sm bg-warning text-white">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="icon-shape icon-lg bg-white text-warning rounded-circle me-3">
                                    <i class="fas fa-user-clock"></i>
                                </div>
                                <div>
                                    <h6 class="mb-1">Thành viên từ</h6>
                                    <p class="mb-0 h6"><?= $createdAt ?></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Medical History -->
    <div class="row">
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0 pb-0">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <div class="icon-shape icon-sm bg-success text-white rounded-circle me-3">
                                <i class="fas fa-history"></i>
                            </div>
                            <div>
                                <h5 class="card-title mb-0 text-dark">Lịch Sử Khám Bệnh</h5>
                                <small class="text-muted">5 lần khám gần nhất</small>
                            </div>
                        </div>
                        <?php if (!empty($visitHistory) && count($visitHistory) > 5): ?>
                            <a href="/patient/history" class="btn btn-outline-primary">
                                <i class="fas fa-list me-2"></i>Xem tất cả
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
                <div class="card-body pt-3">
                    <?php if (!empty($visitHistory)): ?>
                        <div class="table-responsive">
                            <table class="table table-hover align-middle">
                                <thead class="table-light">
                                    <tr>
                                        <th class="border-0 fw-semibold">Ngày khám</th>
                                        <th class="border-0 fw-semibold">Khoa</th>
                                        <th class="border-0 fw-semibold">Lý do khám</th>
                                        <th class="border-0 fw-semibold">Chẩn đoán</th>
                                        <th class="border-0 fw-semibold text-center">Xem chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach (array_slice($visitHistory, 0, 5) as $visit): ?>
                                        <tr>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div class="icon-shape icon-xs bg-primary text-white rounded-circle me-2">
                                                        <i class="fas fa-calendar"></i>
                                                    </div>
                                                    <span class="fw-semibold">
                                                        <?= isset($visit['visit_date']) ? (new DateTime($visit['visit_date']))->format('d/m/Y') : 'N/A' ?>
                                                    </span>
                                                </div>
                                                <small class="text-muted d-block">
                                                    <?= isset($visit['visit_date']) ? (new DateTime($visit['visit_date']))->format('H:i') : '' ?>
                                                </small>
                                            </td>
                                            <td>
                                                <span class="badge bg-light text-dark">
                                                    <?= htmlspecialchars($visit['department'] ?? 'N/A') ?>
                                                </span>
                                            </td>
                                            <td>
                                                <span class="text-truncate d-inline-block" style="max-width: 200px;">
                                                    <?= htmlspecialchars($visit['reason_for_visit'] ?? 'N/A') ?>
                                                </span>
                                            </td>
                                            <td>
                                                <span class="text-truncate d-inline-block" style="max-width: 200px;">
                                                    <?= htmlspecialchars($visit['diagnosis_description'] ?? 'N/A') ?>
                                                </span>
                                            </td>
                                            <td class="text-center">
                                                <a href="/patients/detail/<?= $visit['id'] ?>" 
                                                   class="btn btn-sm btn-outline-primary rounded-pill">
                                                    <i class="fas fa-eye me-1"></i>Chi tiết
                                                </a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php else: ?>
                        <div class="text-center py-5">
                            <div class="icon-shape icon-xl bg-light text-muted rounded-circle mx-auto mb-3">
                                <i class="fas fa-file-medical"></i>
                            </div>
                            <h6 class="text-muted mb-2">Chưa có lịch sử khám</h6>
                            <p class="text-muted mb-3">Bạn chưa có lịch sử khám bệnh nào trong hệ thống</p>
                            <a href="/appointment/create" class="btn btn-primary">
                                <i class="fas fa-plus me-2"></i>Đặt lịch khám
                            </a>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.bg-gradient-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.icon-shape {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    vertical-align: middle;
}

.icon-xs {
    width: 24px;
    height: 24px;
    font-size: 0.75rem;
}

.icon-sm {
    width: 36px;
    height: 36px;
    font-size: 0.875rem;
}

.icon-lg {
    width: 48px;
    height: 48px;
    font-size: 1.125rem;
}

.icon-xl {
    width: 72px;
    height: 72px;
    font-size: 1.5rem;
}

.info-item {
    padding: 0.5rem 0;
}

.card {
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-2px);
}

.table-hover tbody tr:hover {
    background-color: rgba(0, 123, 255, 0.05);
}

.btn {
    transition: all 0.3s ease;
}

.rounded-pill {
    border-radius: 50rem !important;
}

@media (max-width: 768px) {
    .container-fluid {
        padding-left: 15px;
        padding-right: 15px;
    }
    
    .d-flex.gap-2 {
        flex-direction: column;
    }
    
    .btn-lg {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
    }
}
</style>

<?php require_once(__DIR__ . '/../template/footer.php'); ?>
<?php require_once(__DIR__ . '/../template/scripts.php'); ?>