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
                <h2 class = "text-dark"><i class="fas fa-history"></i> Lịch Sử Khám Bệnh</h2>
                <div>
                    <a href="/patients" class="btn btn-secondary">
                        <i class="fas fa-arrow-left"></i> Quay lại
                    </a>
                </div>
            </div>

            <!-- Search and Filter -->
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <label for="searchInput" class="form-label">Tìm kiếm:</label>
                            <input type="text" id="searchInput" class="form-control" placeholder="Tìm theo lý do khám, chẩn đoán...">
                        </div>
                        <div class="col-md-3">
                            <label for="departmentFilter" class="form-label">Khoa:</label>
                            <select id="departmentFilter" class="form-select">
                                <option value="">Tất cả khoa</option>
                                <?php 
                                $departments = [];
                                if (isset($visitHistory)) {
                                    foreach ($visitHistory as $visit) {
                                        if (!empty($visit['department'])) {
                                            $departments[] = $visit['department'];
                                        }
                                    }
                                    $departments = array_unique($departments);
                                    foreach ($departments as $dept): ?>
                                        <option value="<?php echo htmlspecialchars($dept); ?>"><?php echo htmlspecialchars($dept); ?></option>
                                    <?php endforeach;
                                }
                                ?>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="dateFilter" class="form-label">Năm:</label>
                            <select id="dateFilter" class="form-select">
                                <option value="">Tất cả năm</option>
                                <?php 
                                    $years = [];
                                    if (isset($visitHistory)) {
                                        foreach ($visitHistory as $visit) {
                                            if (!empty($visit['visitDate']['seconds'])) {
                                                $timestamp = $visit['visitDate']['seconds'];
                                                $year = date('Y', $timestamp);
                                                $years[] = $year;
                                            }
                                        }
                                        $years = array_unique($years);
                                        rsort($years); // Sort in descending order

                                        foreach ($years as $year): ?>
                                            <option value="<?php echo $year; ?>"><?php echo $year; ?></option>
                                        <?php endforeach;
                                    }
                                ?>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">&nbsp;</label>
                            <button type="button" id="clearFilter" class="btn btn-outline-secondary d-block w-100">
                                <i class="fas fa-times"></i> Xóa lọc
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Visit History Table -->
            <div class="card">
                <div class="card-body">
                    <?php if (isset($visitHistory) && !empty($visitHistory)): ?>
                        <div class="table-responsive">
                            <table class="table table-striped" id="visitHistoryTable">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Ngày khám</th>
                                        <th>Khoa</th>
                                        <th>Lý do khám</th>
                                        <th>Chẩn đoán</th>
                                        <th>Chỉ số cơ thể</th>
                                        <th>Xem chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($visitHistory as $visit): 
                                        $diagnosis = $visit['diagnosis_description'];
                                        $vitalSigns = $visit['vital_signs_formatted'];
                                    ?>
                                        <tr>
                                            <td>
                                                <?php 
                                                if (isset($visit['visitDate']['seconds'])) {
                                                    $timestamp = (int)$visit['visitDate']['seconds'];
                                                    $date = (new DateTime())->setTimestamp($timestamp);
                                                    echo $date->format('d/m/Y H:i');
                                                } else {
                                                    echo 'N/A';
                                                }
                                                ?>
                                            </td>
                                            <td>
                                                <span class="badge bg-primary"><?php echo htmlspecialchars($visit['department'] ?? 'N/A'); ?></span>
                                            </td>
                                            <td>
                                                <div class="text-truncate" style="max-width: 200px;" title="<?php echo htmlspecialchars($visit['reason_for_visit'] ?? ''); ?>">
                                                    <?php echo htmlspecialchars($visit['reason_for_visit'] ?? 'N/A'); ?>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="text-truncate" style="max-width: 200px;" title="<?php echo htmlspecialchars($diagnosis); ?>">
                                                    <?php echo htmlspecialchars($diagnosis ?: 'N/A'); ?>
                                                </div>
                                            </td>
                                            <td>
                                                <small>
                                                    <?php if (!empty($vitalSigns)): ?>
                                                        <?php foreach (array_slice($vitalSigns, 0, 2) as $key => $value): ?>
                                                            <div><?php echo $key; ?>: <?php echo $value; ?></div>
                                                        <?php endforeach; ?>
                                                        <?php if (count($vitalSigns) > 2): ?>
                                                            <div class="text-muted">...</div>
                                                        <?php endif; ?>
                                                    <?php else: ?>
                                                        <span class="text-muted">N/A</span>
                                                    <?php endif; ?>
                                                </small>
                                            </td>
                                            <td>
                                                <a href="/patients/detail/<?php echo $visit['id']; ?>?return_url=<?= urlencode($_SERVER['REQUEST_URI']) ?>" class="btn btn-sm btn-outline-primary">
                                                    <i class="fas fa-eye"></i> Chi tiết
                                                </a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
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

<!-- JavaScript for filtering -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const departmentFilter = document.getElementById('departmentFilter');
    const dateFilter = document.getElementById('dateFilter');
    const clearFilter = document.getElementById('clearFilter');
    const table = document.getElementById('visitHistoryTable');
    const tbody = table ? table.querySelector('tbody') : null;

    if (!tbody) return;

    const originalRows = Array.from(tbody.querySelectorAll('tr'));

    function filterTable() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedDepartment = departmentFilter.value;
        const selectedYear = dateFilter.value;

        originalRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const date = cells[0].textContent;
            const department = cells[1].textContent;
            const reason = cells[2].textContent.toLowerCase();
            const diagnosis = cells[3].textContent.toLowerCase();

            const matchesSearch = !searchTerm || reason.includes(searchTerm) || diagnosis.includes(searchTerm);
            const matchesDepartment = !selectedDepartment || department.includes(selectedDepartment);
            const matchesYear = !selectedYear || date.includes(selectedYear);

            if (matchesSearch && matchesDepartment && matchesYear) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    searchInput.addEventListener('input', filterTable);
    departmentFilter.addEventListener('change', filterTable);
    dateFilter.addEventListener('change', filterTable);

    clearFilter.addEventListener('click', function() {
        searchInput.value = '';
        departmentFilter.value = '';
        dateFilter.value = '';
        filterTable();
    });
});
</script>


<?php require_once(__DIR__ . '/../template/footer.php'); ?>
<?php require_once(__DIR__ . '/../template/scripts.php'); ?>