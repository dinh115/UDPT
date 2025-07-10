/**
 * TO RUN THIS FILE: node seed-patient.js
 * Seeds patient visits for Python Patient Service (patient-mongo database)
 */

const mongoose = require('mongoose');
const { v5: uuidv5 } = require('uuid');

// Same UUID namespace to maintain consistency across services
const UUID_NAMESPACE = '3f96061a-3a25-4f89-9ae9-abc012345678';

// Patient Visit schema matching proto schema exactly
const patientVisitSchema = new mongoose.Schema({
    _id: String,
    patient: { type: String, required: true },
    doctor: { type: String, required: true },
    visitDate: { type: Date, required: true },
    department: { type: String, required: true },
    reason_for_visit: { type: String, required: true },
    diagnosis: [{
        code: { type: String },
        description: { type: String }
    }],
    vital_signs: {
        temperature: { type: Number },
        blood_pressure: { type: String },
        pulse: { type: Number },
        respiratory_rate: { type: Number },
        weight: { type: Number },
        height: { type: Number }
    },
    tests: [{
        name: { type: String },
        result: { type: String },
        date: { type: Date },
        file_url: { type: String }
    }],
    symptoms: [{ type: String }],
    allergies: [{ type: String }],
    prescription: { type: String },
    notes: { type: String }
}, {
    versionKey: false
});

const PatientVisit = mongoose.model('patient_visits', patientVisitSchema);

// Generate patient and doctor IDs using same logic as User service
function generatePatientIds() {
    const patientIds = [];
    // Generate IDs for patients (user_511 to user_1010)
    for (let i = 511; i <= 1010; i++) {
        const username = `user_${i}`;
        const patientId = uuidv5(username, UUID_NAMESPACE);
        patientIds.push(patientId);
    }
    return patientIds;
}

function generateDoctorIds() {
    const doctorIds = [];
    // Generate IDs for doctors (user_11 to user_310)
    for (let i = 11; i <= 310; i++) {
        const username = `user_${i}`;
        const doctorId = uuidv5(username, UUID_NAMESPACE);
        doctorIds.push(doctorId);
    }
    return doctorIds;
}

// Sample data
const visitReasons = [
    'Khám sức khỏe tổng quát',
    'Đau đầu thường xuyên',
    'Ho và sốt',
    'Đau bụng',
    'Khó thở',
    'Đau lưng',
    'Kiểm tra huyết áp',
    'Tư vấn dinh dưỡng',
    'Khám tim mạch',
    'Đau khớp',
    'Rối loạn giấc ngủ',
    'Stress và lo âu',
    'Khám da liễu',
    'Khám mắt',
    'Khám răng miệng',
    'Theo dõi bệnh tiểu đường',
    'Khám phụ khoa',
    'Khám nhi khoa',
    'Chấn thương thể thao',
    'Tiêm chủng'
];

const diagnosisData = [
    { code: 'J02', description: 'Viêm họng cấp' },
    { code: 'I10', description: 'Cao huyết áp' },
    { code: 'E11', description: 'Tiểu đường type 2' },
    { code: 'K29', description: 'Viêm dạ dày' },
    { code: 'M79', description: 'Đau cơ' },
    { code: 'F43', description: 'Stress' },
    { code: 'J11', description: 'Cảm cúm' },
    { code: 'T78', description: 'Dị ứng' },
    { code: 'D50', description: 'Thiếu máu' },
    { code: 'Z00', description: 'Khỏe mạnh bình thường' },
    { code: 'J18', description: 'Viêm phổi nhẹ' },
    { code: 'K59', description: 'Rối loạn tiêu hóa' },
    { code: 'G43', description: 'Đau nửa đầu' },
    { code: 'M13', description: 'Viêm khớp' },
    { code: 'I25', description: 'Bệnh tim mạch' },
    { code: 'F32', description: 'Trầm cảm nhẹ' },
    { code: 'L30', description: 'Viêm da' },
    { code: 'H52', description: 'Cận thị' },
    { code: 'K02', description: 'Sâu răng' },
    { code: 'E66', description: 'Béo phì' }
];

const departments = [
    'Nội khoa',
    'Ngoại khoa',
    'Nhi khoa',
    'Phụ sản',
    'Răng hàm mặt',
    'Mắt',
    'Tai mũi họng',
    'Da liễu',
    'Thần kinh',
    'Tim mạch',
    'Tiêu hóa',
    'Hô hấp',
    'Nội tiết',
    'Cơ xương khớp',
    'Tâm thần',
    'Cấp cứu',
    'Khám sức khỏe',
    'Dinh dưỡng',
    'Vật lý trị liệu',
    'Y học cổ truyền'
];

const symptoms = [
    'Đau đầu', 'Sốt', 'Ho', 'Khó thở', 'Đau bụng', 'Buồn nôn',
    'Chóng mặt', 'Mệt mỏi', 'Đau ngực', 'Đau lưng', 'Khó ngủ',
    'Stress', 'Lo âu', 'Đau khớp', 'Phát ban', 'Khó tiêu'
];

const allergies = [
    'Thuốc kháng sinh', 'Hải sản', 'Sữa', 'Trứng', 'Đậu phộng',
    'Bụi nhà', 'Phấn hoa', 'Lông thú', 'Aspirin', 'Ibuprofen'
];

const testTypes = [
    'Xét nghiệm máu', 'Xét nghiệm nước tiểu', 'X-quang', 'Siêu âm',
    'ECG', 'Xét nghiệm đường huyết', 'Xét nghiệm gan', 'CT scan',
    'MRI', 'Xét nghiệm cholesterol'
];

const testResults = [
    'Bình thường', 'Cao hơn bình thường', 'Thấp hơn bình thường',
    'Cần theo dõi', 'Cần điều trị', 'Cần làm thêm xét nghiệm'
];

const prescriptions = [
    'Paracetamol 500mg - 3 lần/ngày sau ăn',
    'Amoxicillin 250mg - 2 lần/ngày',
    'Omeprazole 20mg - 1 lần/ngày trước ăn',
    'Metformin 500mg - 2 lần/ngày',
    'Amlodipine 5mg - 1 lần/ngày',
    'Vitamin D3 1000IU - 1 lần/ngày',
    'Cetirizine 10mg - 1 lần/ngày',
    'Ibuprofen 400mg - 2 lần/ngày sau ăn',
    'Simvastatin 20mg - 1 lần/ngày tối',
    'Aspirin 100mg - 1 lần/ngày'
];

// Generate random element from array
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Generate random elements from array
function randomElements(array, maxCount = 3) {
    const count = Math.floor(Math.random() * maxCount) + 1;
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Generate random date within last 2 years
function generateVisitDate() {
    const now = new Date();
    const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
    const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime());
    return new Date(randomTime);
}

// Generate vital signs
function generateVitalSigns() {
    return {
        temperature: Math.round((Math.random() * 2 + 36) * 10) / 10,
        blood_pressure: `${Math.floor(Math.random() * 50) + 110}/${Math.floor(Math.random() * 30) + 70}`,
        pulse: Math.floor(Math.random() * 40) + 60,
        respiratory_rate: Math.floor(Math.random() * 10) + 12,
        weight: Math.round((Math.random() * 50 + 45) * 10) / 10,
        height: Math.round((Math.random() * 40 + 150) * 10) / 10
    };
}

// Generate test results
function generateTests() {
    const numTests = Math.floor(Math.random() * 3) + 1;
    const tests = [];
    
    for (let i = 0; i < numTests; i++) {
        const testDate = new Date();
        testDate.setDate(testDate.getDate() - Math.floor(Math.random() * 30));
        
        tests.push({
            name: randomElement(testTypes),
            result: randomElement(testResults),
            date: testDate,
            file_url: Math.random() > 0.7 ? `https://example.com/test-results/${Date.now()}-${i}.pdf` : ''
        });
    }
    
    return tests;
}

// Generate patient visit data
function generatePatientVisit(patientId, doctorId, visitNumber) {
    const visitDate = generateVisitDate();
    const reasonForVisit = randomElement(visitReasons);
    const department = randomElement(departments);
    
    // Generate visit ID based on patient ID and visit number
    const visitId = uuidv5(`${patientId}_visit_${visitNumber}`, UUID_NAMESPACE);
    
    // Generate diagnosis (1-3 diagnoses)
    const diagnosisCount = Math.floor(Math.random() * 3) + 1;
    const diagnosis = randomElements(diagnosisData, diagnosisCount);
    
    // Generate symptoms and allergies
    const visitSymptoms = randomElements(symptoms, Math.floor(Math.random() * 4) + 1);
    const visitAllergies = Math.random() > 0.6 ? randomElements(allergies, Math.floor(Math.random() * 2) + 1) : [];
    
    // Generate prescription
    const prescription = Math.random() > 0.3 ? randomElement(prescriptions) : '';
    
    // Generate notes
    const notes = `Bệnh nhân đến khám với lý do: ${reasonForVisit}. ` +
                 `Triệu chứng: ${visitSymptoms.join(', ')}. ` +
                 `Chẩn đoán: ${diagnosis.map(d => d.description).join(', ')}. ` +
                 (prescription ? `Đã kê đơn thuốc. ` : '') +
                 `Tái khám sau ${Math.floor(Math.random() * 4) + 1} tuần.`;
    
    const visit = {
        _id: visitId,
        patient: patientId,
        doctor: doctorId,
        visitDate: visitDate,
        department: department,
        reason_for_visit: reasonForVisit,
        diagnosis: diagnosis,
        vital_signs: generateVitalSigns(),
        tests: Math.random() > 0.5 ? generateTests() : [],
        symptoms: visitSymptoms,
        allergies: visitAllergies,
        prescription: prescription,
        notes: notes
    };
    
    return visit;
}

// Main seeding function
async function seedPatientVisits() {
    const startTime = Date.now();
    
    try {
        // Connect to Patient Service MongoDB
        const mongoUri = 'mongodb://localhost:27016/patient_db';
        
        console.log('Connecting to Patient Service MongoDB...');
        await mongoose.connect(mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('Connected to Patient Service MongoDB');
        
        // Clear existing patient visits
        await PatientVisit.deleteMany({});
        console.log('Cleared existing patient visits');
        
        // Generate patient and doctor IDs (same logic as User service)
        const patientIds = generatePatientIds();
        const doctorIds = generateDoctorIds();
        
        console.log(`Generated ${patientIds.length} patient IDs and ${doctorIds.length} doctor IDs`);
        
        // Generate visits for each patient
        const visits = [];
        const minVisitsPerPatient = 1;
        const maxVisitsPerPatient = 5;
        
        console.log('Generating patient visits...');
        
        for (let i = 0; i < patientIds.length; i++) {
            const patientId = patientIds[i];
            const numVisits = Math.floor(Math.random() * (maxVisitsPerPatient - minVisitsPerPatient + 1)) + minVisitsPerPatient;
            
            for (let j = 1; j <= numVisits; j++) {
                const randomDoctorId = randomElement(doctorIds);
                const visit = generatePatientVisit(patientId, randomDoctorId, j);
                visits.push(visit);
            }
            
            // Progress indicator
            if ((i + 1) % 100 === 0) {
                const progress = (((i + 1) / patientIds.length) * 100).toFixed(1);
                console.log(`Processed ${i + 1}/${patientIds.length} patients - ${progress}%`);
            }
        }
        
        console.log(`Generated ${visits.length} patient visits`);
        
        // Insert visits in batches
        const batchSize = 100;
        for (let i = 0; i < visits.length; i += batchSize) {
            const batch = visits.slice(i, i + batchSize);
            await PatientVisit.insertMany(batch, { ordered: false });
            
            const progress = (((i + batchSize) / visits.length) * 100).toFixed(1);
            console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(visits.length / batchSize)} - ${progress}%`);
        }
        
        // Display statistics
        const departmentStats = await PatientVisit.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        
        const reasonStats = await PatientVisit.aggregate([
            { $group: { _id: '$reason_for_visit', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        
        const totalVisits = await PatientVisit.countDocuments();
        
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        
        console.log('\n=== Patient Visit Seeding Complete ===');
        console.log(`Total time: ${duration} seconds`);
        console.log(`Total visits created: ${totalVisits}`);
        
        console.log('\nTop 10 departments by visit count:');
        departmentStats.forEach(stat => {
            console.log(`${stat._id}: ${stat.count} visits`);
        });
        
        console.log('\nTop 10 reasons for visit:');
        reasonStats.forEach(stat => {
            console.log(`${stat._id}: ${stat.count} visits`);
        });
        
        // Sample visits for verification
        console.log('\n=== Sample Patient Visits ===');
        const sampleVisits = await PatientVisit.find({}).limit(3).lean();
            
        sampleVisits.forEach((visit, index) => {
            console.log(`\nSample Visit ${index + 1}:`);
            console.log({
                id: visit._id,
                patient: visit.patient,
                doctor: visit.doctor,
                visitDate: visit.visitDate.toLocaleDateString('vi-VN'),
                department: visit.department,
                reason_for_visit: visit.reason_for_visit,
                diagnosis: visit.diagnosis,
                vital_signs: visit.vital_signs,
                tests: visit.tests,
                symptoms: visit.symptoms,
                allergies: visit.allergies,
                prescription: visit.prescription,
                notes: visit.notes.substring(0, 100) + '...'
            });
        });
        
        // Show ID consistency verification
        console.log('\n=== ID Consistency Verification ===');
        console.log('Patient ID examples (should match User service):');
        patientIds.slice(0, 3).forEach((id, index) => {
            console.log(`user_${511 + index} -> ${id}`);
        });
        
        console.log('Doctor ID examples (should match User service):');
        doctorIds.slice(0, 3).forEach((id, index) => {
            console.log(`user_${11 + index} -> ${id}`);
        });
        
    } catch (error) {
        console.error('Error seeding patient visits:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the seeder
if (require.main === module) {
    seedPatientVisits().catch(console.error);
}

module.exports = { seedPatientVisits };