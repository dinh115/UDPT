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
<div class="container mt-4">
    <div class="row">
        <div class="col-md-12">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class = "text-dark"><i class="fas fa-file-medical"></i> Chi Tiết Lượt Khám</h2>
                <div>
                    <?php
                        $returnUrl = $_GET['return_url'] ?? '/patients';
                    ?>
                    <a href="<?= htmlspecialchars($returnUrl) ?>" class="btn btn-secondary">
                        <i class="fas fa-arrow-left"></i> Quay lại
                    </a>
                    <button onclick="window.print()" class="btn btn-outline-primary">
                        <i class="fas fa-print"></i> In
                    </button>
                </div>
            </div>

            <?php if (isset($visitDetail)): ?>
                <!-- Visit Information -->
                <div class="card mb-4">
                    <div class="card-header bg-primary text-white py-3">
                        <h5 class="mb-0"><i class="fas fa-info-circle"></i> Thông Tin Lượt Khám</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <table class="table table-borderless">
                                    <tr>
                                        <td><strong>Ngày khám:</strong></td>
                                        <td>
                                            <?php 
                                            if (isset($visitDetail['visit_date'])) {
                                                $date = new DateTime($visitDetail['visit_date']);
                                                echo $date->format('d/m/Y H:i');
                                            } else {
                                                echo 'N/A';
                                            }
                                            ?>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Khoa:</strong></td>
                                        <td><span class="badge bg-primary"><?php echo htmlspecialchars($visitDetail['department'] ?? 'N/A'); ?></span></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Bác sĩ:</strong></td>
                                        <td><?php echo htmlspecialchars($visitDetail['doctor'] ?? 'N/A'); ?></td>
                                    </tr>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <table class="table table-borderless">
                                    <tr>
                                        <td class = 'text-nowrap'><strong>Lý do khám:</strong></td>
                                        <td><?php echo htmlspecialchars($visitDetail['reason_for_visit'] ?? 'N/A'); ?></td>
                                    </tr>
                                    <tr>
                                        <td class = 'text-nowrap'><strong>Ghi chú:</strong></td>
                                        <td><?php echo htmlspecialchars($visitDetail['notes'] ?? 'Không có ghi chú'); ?></td>
                                    </tr>
                                    <tr>
                                        <td class = 'text-nowrap'><strong>Đơn thuốc:</strong></td>
                                        <td>
                                            <?php if (!empty($visitDetail['prescription_id'])): ?>
                                                <span class="badge bg-success">Có đơn thuốc</span>
                                                <small class="text-muted d-block">ID: <?php echo htmlspecialchars($visitDetail['prescription_id']); ?></small>
                                            <?php else: ?>
                                                <span class="badge bg-secondary">Không có đơn thuốc</span>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Diagnosis -->
                <div class="card mb-4">
                    <div class="card-header bg-success text-white py-3">
                        <h5 class="mb-0"><i class="fas fa-stethoscope"></i> Chẩn Đoán</h5>
                    </div>
                    <div class="card-body">
                        <?php if (isset($visitDetail['diagnosis']) && !empty($visitDetail['diagnosis'])): ?>
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Mã ICD</th>
                                            <th>Mô tả</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($visitDetail['diagnosis'] as $diagnosis): ?>
                                            <tr>
                                                <td><code><?php echo htmlspecialchars($diagnosis['code'] ?? 'N/A'); ?></code></td>
                                                <td><?php echo htmlspecialchars($diagnosis['description'] ?? 'N/A'); ?></td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        <?php else: ?>
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle"></i> Chưa có chẩn đoán.
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Vital Signs -->
                <div class="card mb-4">
                    <div class="card-header bg-warning text-dark py-3">
                        <h5 class="mb-0"><i class="fas fa-heartbeat"></i> Chỉ Số Cơ Thể </h5>
                    </div>
                    <div class="card-body">
                        <?php if (isset($visitDetail['vital_signs']) && !empty($visitDetail['vital_signs'])): ?>
                            <div class="row">
                                <?php 
                                $chunks = array_chunk($vitalSigns, 3, true);
                                foreach ($chunks as $chunk): ?>
                                    <div class="col-md-6">
                                        <table class="table table-borderless">
                                            <?php foreach ($chunk as $label => $value): ?>
                                                <tr>
                                                    <td><strong><?php echo $label; ?>:</strong></td>
                                                    <td><?php echo $value; ?></td>
                                                </tr>
                                            <?php endforeach; ?>
                                        </table>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php else: ?>
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle"></i> Chưa có thông tin chỉ số cơ thể.
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Tests -->
                <div class="card mb-4">
                    <div class="card-header bg-info text-white py-3">
                        <h5 class="mb-0"><i class="fas fa-vials"></i> Xét Nghiệm & Cận Lâm Sàng</h5>
                    </div>
                    <div class="card-body">
                        <?php if (isset($visitDetail['tests']) && !empty($visitDetail['tests'])): ?>
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Tên xét nghiệm</th>
                                            <th>Kết quả</th>
                                            <th>Ngày thực hiện</th>
                                            <th>File kết quả</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($visitDetail['tests'] as $test): ?>
                                            <tr>
                                                <td><?php echo htmlspecialchars($test['name'] ?? 'N/A'); ?></td>
                                                <td><?php echo htmlspecialchars($test['result'] ?? 'N/A'); ?></td>
                                                <td>
                                                    <?php 
                                                    if (isset($test['date']['seconds'])) {
                                                        $date = (new DateTime())->setTimestamp($test['date']['seconds']);
                                                        echo $date->format('d/m/Y H:i');
                                                    } else {
                                                        echo 'N/A';
                                                    }
                                                    ?>
                                                </td>
                                                <td>
                                                    <?php if (!empty($test['file_url'])): ?>
                                                        <a href="<?php echo htmlspecialchars($test['file_url']); ?>" target="_blank" class="btn btn-sm btn-outline-primary">
                                                            <i class="fas fa-download"></i> Tải xuống
                                                        </a>
                                                    <?php else: ?>
                                                        <span class="text-muted">Không có file</span>
                                                    <?php endif; ?>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        <?php else: ?>
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle"></i> Chưa có xét nghiệm nào.
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

            <?php else: ?>
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle"></i> Không tìm thấy thông tin lượt khám.
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<style>
@media print {
    .btn, .card-header {
        display: none !important;
    }
    
    .card {
        border: 1px solid #000 !important;
        margin-bottom: 20px !important;
    }
    
    .container {
        max-width: 100% !important;
    }
    
    .table {
        font-size: 12px !important;
    }
}
</style>