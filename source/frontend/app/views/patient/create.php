<?php
$title = 'Tạo Phiếu Khám Bệnh';
require_once(__DIR__ . '/../template/header.php');
require_once(__DIR__ . '/../template/navbar.php');
?>

<div class="container mt-4">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white py-3">
                    <div class="d-flex justify-content-between align-items-center w-100">
                        <h4 class="mb-0">
                            <i class="fas fa-file-medical me-2"></i>
                            Tạo Phiếu Khám Bệnh
                        </h4>
                        <a href="/appointments/my" class="btn btn-light btn-sm">
                            <i class="fas fa-arrow-left me-1"></i>Quay lại
                        </a>
                    </div>

                </div>
                
                <div class="card-body">
                    <form id="createVisitForm" method="POST" action="/patients/createPatientVisit">
                        <!-- Basic Information -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="patient" class="form-label">Bệnh nhân <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="patient" name="patient" required value="<?= htmlspecialchars($patientId) ?>">
                            </div>
                            <div class="col-md-6">
                                <label for="doctor" class="form-label">Bác sĩ <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="doctor" name="doctor" required value="<?= htmlspecialchars($doctorId) ?>">
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="visitDate" class="form-label">Ngày khám <span class="text-danger">*</span></label>
                                <input type="datetime-local" class="form-control" id="visitDate" name="visitDate" 
                                       value="<?= date('Y-m-d\TH:i') ?>" required>
                            </div>
                            <div class="col-md-6">
                                <label for="department" class="form-label">Khoa <span class="text-danger">*</span></label>
                                <select class="form-select" id="department" name="department" required>
                                    <option value="">Chọn khoa</option>
                                    <option value="Nội khoa" <?= ($department === 'Nội khoa') ? 'selected' : '' ?>>Nội khoa</option>
                                    <option value="Ngoại khoa" <?= ($department === 'Ngoại khoa') ? 'selected' : '' ?>>Ngoại khoa</option>
                                    <option value="Sản phụ khoa" <?= ($department === 'Sản phụ khoa') ? 'selected' : '' ?>>Sản phụ khoa</option>
                                    <option value="Nhi khoa" <?= ($department === 'Nhi khoa') ? 'selected' : '' ?>>Nhi khoa</option>
                                    <option value="Tai mũi họng" <?= ($department === 'Tai mũi họng') ? 'selected' : '' ?>>Tai mũi họng</option>
                                    <option value="Mắt" <?= ($department === 'Mắt') ? 'selected' : '' ?>>Mắt</option>
                                    <option value="Da liễu" <?= ($department === 'Da liễu') ? 'selected' : '' ?>>Da liễu</option>
                                    <option value="Thần kinh" <?= ($department === 'Thần kinh') ? 'selected' : '' ?>>Thần kinh</option>
                                    <option value="Tim mạch" <?= ($department === 'Tim mạch') ? 'selected' : '' ?>>Tim mạch</option>
                                    <option value="Hô hấp" <?= ($department === 'Hô hấp') ? 'selected' : '' ?>>Hô hấp</option>
                                    <option value="Tiêu hóa" <?= ($department === 'Tiêu hóa') ? 'selected' : '' ?>>Tiêu hóa</option>
                                    <option value="Cơ xương khớp" <?= ($department === 'Cơ xương khớp') ? 'selected' : '' ?>>Cơ xương khớp</option>
                                </select>
                            </div>
                        </div>

                        <!-- Reason for Visit -->
                        <div class="mb-3">
                            <label for="reason_for_visit" class="form-label">Lý do khám <span class="text-danger">*</span></label>
                            <textarea class="form-control" id="reason_for_visit" name="reason_for_visit" rows="3" required 
                                      placeholder="Mô tả lý do đến khám bệnh..."></textarea>
                        </div>

                        <!-- Vital Signs -->
                        <div class="card mb-4">
                            <div class="card-header bg-warning text-dark py-3">
                                <h6 class="mb-0"><i class="fas fa-heartbeat me-2"></i>Chỉ số cơ thể</h6>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-4">
                                        <label for="temperature" class="form-label">Nhiệt độ (°C)</label>
                                        <input type="number" class="form-control" id="temperature" name="vital_signs[temperature]" 
                                               step="0.1" min="35" max="42" placeholder="36.5">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="blood_pressure" class="form-label">Huyết áp (mmHg)</label>
                                        <input type="text" class="form-control" id="blood_pressure" name="vital_signs[blood_pressure]" 
                                               placeholder="120/80">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="pulse" class="form-label">Mạch (bpm)</label>
                                        <input type="number" class="form-control" id="pulse" name="vital_signs[pulse]" 
                                               min="30" max="200" placeholder="72">
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-4">
                                        <label for="respiratory_rate" class="form-label">Nhịp thở (lần/phút)</label>
                                        <input type="number" class="form-control" id="respiratory_rate" name="vital_signs[respiratory_rate]" 
                                               min="10" max="40" placeholder="16">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="weight" class="form-label">Cân nặng (kg)</label>
                                        <input type="number" class="form-control" id="weight" name="vital_signs[weight]" 
                                               step="0.1" min="1" max="300" placeholder="70">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="height" class="form-label">Chiều cao (cm)</label>
                                        <input type="number" class="form-control" id="height" name="vital_signs[height]" 
                                               min="50" max="250" placeholder="170">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Symptoms -->
                        <div class="mb-3">
                            <label for="symptoms" class="form-label">Triệu chứng</label>
                            <div id="symptoms-container">
                                <div class="input-group mb-2">
                                    <input type="text" class="form-control" name="symptoms[]" placeholder="Nhập triệu chứng">
                                    <button type="button" class="btn btn-outline-success" onclick="addSymptom()">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Allergies -->
                        <div class="mb-3">
                            <label for="allergies" class="form-label">Dị ứng</label>
                            <div id="allergies-container">
                                <div class="input-group mb-2">
                                    <input type="text" class="form-control" name="allergies[]" placeholder="Nhập dị ứng">
                                    <button type="button" class="btn btn-outline-success" onclick="addAllergy()">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Diagnosis -->
                        <div class="card mb-4">
                            <div class="card-header bg-success text-white py-3">
                                <h6 class="mb-0"><i class="fas fa-stethoscope me-2"></i>Chẩn đoán</h6>
                            </div>
                            <div class="card-body">
                                <div id="diagnosis-container">
                                    <div class="row mb-2">
                                        <div class="col-md-3">
                                            <input type="text" class="form-control" name="diagnosis[0][code]" placeholder="Mã ICD">
                                        </div>
                                        <div class="col-md-7">
                                            <input type="text" class="form-control" name="diagnosis[0][description]" placeholder="Mô tả chẩn đoán">
                                        </div>
                                        <div class="col-md-2">
                                            <button type="button" class="btn btn-outline-success w-100" onclick="addDiagnosis()">
                                                <i class="fas fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tests -->
                        <div class="card mb-4">
                            <div class="card-header bg-info text-white py-3">
                                <h6 class="mb-0"><i class="fas fa-vial me-2"></i>Xét nghiệm</h6>
                            </div>
                            <div class="card-body">
                                <div id="tests-container">
                                    <div class="row mb-2">
                                        <div class="col-md-3">
                                            <input type="text" class="form-control" name="tests[0][name]" placeholder="Tên xét nghiệm">
                                        </div>
                                        <div class="col-md-3">
                                            <input type="text" class="form-control" name="tests[0][result]" placeholder="Kết quả">
                                        </div>
                                        <div class="col-md-3">
                                            <input type="date" class="form-control" name="tests[0][date]">
                                        </div>
                                        <div class="col-md-3">
                                            <div class="input-group">
                                                <input type="url" class="form-control" name="tests[0][file_url]" placeholder="Link file">
                                                <button type="button" class="btn btn-outline-success" onclick="addTest()">
                                                    <i class="fas fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Prescription -->
                        <div class="mb-3">
                            <label for="prescription" class="form-label">Đơn thuốc</label>
                            <textarea class="form-control" id="prescription" name="prescription" rows="4" 
                                      placeholder="Kê đơn thuốc cho bệnh nhân..."></textarea>
                        </div>

                        <!-- Notes -->
                        <div class="mb-4">
                            <label for="notes" class="form-label">Ghi chú</label>
                            <textarea class="form-control" id="notes" name="notes" rows="3" 
                                      placeholder="Ghi chú thêm về tình trạng bệnh nhân..."></textarea>
                        </div>

                        <!-- Submit Buttons -->
                        <div class="d-flex justify-content-end gap-2">
                            <a href="/appointments/doctor" class="btn btn-secondary">
                                <i class="fas fa-times me-1"></i>Hủy
                            </a>
                            <button type="reset" class="btn btn-outline-secondary">
                                <i class="fas fa-undo me-1"></i>Làm mới
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save me-1"></i>Tạo phiếu khám
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// Add symptom
function addSymptom() {
    const container = document.getElementById('symptoms-container');
    const div = document.createElement('div');
    div.className = 'input-group mb-2';
    div.innerHTML = `
        <input type="text" class="form-control" name="symptoms[]" placeholder="Nhập triệu chứng">
        <button type="button" class="btn btn-outline-danger" onclick="removeSymptom(this)">
            <i class="fas fa-minus"></i>
        </button>
    `;
    container.appendChild(div);
}

function removeSymptom(button) {
    button.closest('.input-group').remove();
}

// Add allergy
function addAllergy() {
    const container = document.getElementById('allergies-container');
    const div = document.createElement('div');
    div.className = 'input-group mb-2';
    div.innerHTML = `
        <input type="text" class="form-control" name="allergies[]" placeholder="Nhập dị ứng">
        <button type="button" class="btn btn-outline-danger" onclick="removeAllergy(this)">
            <i class="fas fa-minus"></i>
        </button>
    `;
    container.appendChild(div);
}

function removeAllergy(button) {
    button.closest('.input-group').remove();
}

// Add diagnosis
let diagnosisCount = 1;
function addDiagnosis() {
    const container = document.getElementById('diagnosis-container');
    const div = document.createElement('div');
    div.className = 'row mb-2';
    div.innerHTML = `
        <div class="col-md-3">
            <input type="text" class="form-control" name="diagnosis[${diagnosisCount}][code]" placeholder="Mã ICD">
        </div>
        <div class="col-md-7">
            <input type="text" class="form-control" name="diagnosis[${diagnosisCount}][description]" placeholder="Mô tả chẩn đoán">
        </div>
        <div class="col-md-2">
            <button type="button" class="btn btn-outline-danger w-100" onclick="removeDiagnosis(this)">
                <i class="fas fa-minus"></i>
            </button>
        </div>
    `;
    container.appendChild(div);
    diagnosisCount++;
}

function removeDiagnosis(button) {
    button.closest('.row').remove();
}

// Add test
let testCount = 1;
function addTest() {
    const container = document.getElementById('tests-container');
    const div = document.createElement('div');
    div.className = 'row mb-2';
    div.innerHTML = `
        <div class="col-md-3">
            <input type="text" class="form-control" name="tests[${testCount}][name]" placeholder="Tên xét nghiệm">
        </div>
        <div class="col-md-3">
            <input type="text" class="form-control" name="tests[${testCount}][result]" placeholder="Kết quả">
        </div>
        <div class="col-md-3">
            <input type="date" class="form-control" name="tests[${testCount}][date]">
        </div>
        <div class="col-md-3">
            <div class="input-group">
                <input type="url" class="form-control" name="tests[${testCount}][file_url]" placeholder="Link file">
                <button type="button" class="btn btn-outline-danger" onclick="removeTest(this)">
                    <i class="fas fa-minus"></i>
                </button>
            </div>
        </div>
    `;
    container.appendChild(div);
    testCount++;
}

function removeTest(button) {
    button.closest('.row').remove();
}

// Form validation
function validateForm() {
    const requiredFields = ['patient', 'doctor', 'visitDate', 'department', 'reason_for_visit'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
            element.classList.add('is-invalid');
            isValid = false;
        } else {
            element.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Form submission
document.getElementById('createVisitForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        alert('Vui lòng điền đầy đủ các thông tin bắt buộc!');
        return;
    }
    
    const formData = new FormData(this);
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Đang tạo...';
    submitBtn.disabled = true;
    
    fetch('/patients/createPatientVisit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text()) // <--- THAY .json() bằng .text()
    .then(text => {
        console.log('Raw response:', text);
        try {
            const data = JSON.parse(text);
            console.log('Parsed:', data);
        } catch (e) {
            console.error('Không parse được JSON:', e);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi tạo phiếu khám');
    })
    .finally(() => {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
});
</script>

<?php require_once(__DIR__ . '/../template/footer.php'); ?>
<?php require_once(__DIR__ . '/../template/scripts.php'); ?>