<?php require_once '../template/header.php'; ?>

<div class="container mt-4">
    <div class="row">
        <div class="col-md-12">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2><i class="fas fa-user-circle"></i> Thông Tin Bệnh Nhân</h2>
                <div>
                    <a href="" class="btn btn-info">
                        <i class="fas fa-history"></i> Lịch Sử Lịch Hẹn
                    </a>
                </div>
            </div>

            <!-- Personal Information Card -->
            <div class="card mb-4">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0"><i class="fas fa-user"></i> Thông Tin Cá Nhân</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <table class="table table-borderless">
                                <tr>
                                    <td><strong>Họ và tên:</strong></td>
                                    <td><?php echo htmlspecialchars($userInfo['name'] ?? 'N/A'); ?></td>
                                </tr>
                                <tr>
                                    <td><strong>Email:</strong></td>
                                    <td><?php echo htmlspecialchars($userInfo['email'] ?? 'N/A'); ?></td>
                                </tr>
                                <tr>
                                    <td><strong>Số điện thoại:</strong></td>
                                    <td><?php echo htmlspecialchars($userInfo['phone'] ?? 'N/A'); ?></td>
                                </tr>
                                <tr>
                                    <td><strong>Ngày sinh:</strong></td>
                                    <td><?php 
                                        if (isset($userInfo['birth_date'])) {
                                            $date = new DateTime($userInfo['birth_date']);
                                            echo $date->format('d/m/Y');
                                        } else {
                                            echo 'N/A';
                                        }
                                    ?></td>
                                </tr>
                            </table>
                        </div>
                        <div class="col-md-6">
                            <table class="table table-borderless">
                                <tr>
                                    <td><strong>Giới tính:</strong></td>
                                    <td><?php echo htmlspecialchars($userInfo['gender'] ?? 'N/A'); ?></td>
                                </tr>
                                <tr>
                                    <td><strong>Địa chỉ:</strong></td>
                                    <td><?php echo htmlspecialchars($userInfo['address'] ?? 'N/A'); ?></td>
                                </tr>
                                <tr>
                                    <td><strong>CCCD/CMND:</strong></td>
                                    <td><?php echo htmlspecialchars($userInfo['id_card'] ?? 'N/A'); ?></td>
                                </tr>
                                <tr>
                                    <td><strong>Ngày tạo tài khoản:</strong></td>
                                    <td><?php 
                                        if (isset($userInfo['created_at'])) {
                                            $date = new DateTime($userInfo['created_at']);
                                            echo $date->format('d/m/Y H:i');
                                        } else {
                                            echo 'N/A';
                                        }
                                    ?></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Visit History Summary Card -->
            <div class="card">
                <div class="card-header bg-success text-white">
                    <h5 class="mb-0"><i class="fas fa-history"></i> Lịch Sử Khám Bệnh Gần Đây</h5>
                </div>
                <div class="card-body">
                    <?php if (isset($visitHistory) && !empty($visitHistory)): ?>
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Ngày khám</th>
                                        <th>Khoa</th>
                                        <th>Lý do khám</th>
                                        <th>Chẩn đoán</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php 
                                    $recentVisits = array_slice($visitHistory, 0, 5); // Show only 5 recent visits
                                    foreach ($recentVisits as $visit): 
                                        $diagnosis = $this->patientModel->getDiagnosisDescription($visit['diagnosis'] ?? []);
                                    ?>
                                        <tr>
                                            <td>
                                                <?php 
                                                if (isset($visit['visit_date'])) {
                                                    $date = new DateTime($visit['visit_date']);
                                                    echo $date->format('d/m/Y H:i');
                                                } else {
                                                    echo 'N/A';
                                                }
                                                ?>
                                            </td>
                                            <td><?php echo htmlspecialchars($visit['department'] ?? 'N/A'); ?></td>
                                            <td><?php echo htmlspecialchars($visit['reason_for_visit'] ?? 'N/A'); ?></td>
                                            <td>
                                                <span class="text-truncate" style="max-width: 200px;" title="<?php echo htmlspecialchars($diagnosis); ?>">
                                                    <?php echo htmlspecialchars($diagnosis ?: 'N/A'); ?>
                                                </span>
                                            </td>
                                            <td>
                                                <a href="/patient/detail/<?php echo $visit['id']; ?>" class="btn btn-sm btn-outline-primary">
                                                    <i class="fas fa-eye"></i> Chi tiết
                                                </a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                        
                        <?php if (count($visitHistory) > 5): ?>
                            <div class="text-center mt-3">
                                <a href="/patient/history" class="btn btn-primary">
                                    <i class="fas fa-list"></i> Xem tất cả lịch sử khám bệnh
                                </a>
                            </div>
                        <?php endif; ?>
                    <?php else: ?>
                        <div class="alert alert-info text-center">
                            <i class="fas fa-info-circle"></i> Chưa có lịch sử khám bệnh nào.
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once '../template/footer.php'; ?>