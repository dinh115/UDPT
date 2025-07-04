<?php require_once(__DIR__ . '/../template/header.php'); ?>

<body>
    <!-- <div class="header">
        <h1><?php echo htmlspecialchars($data['title']); ?></h1>
    </div> -->

    <?php require_once(__DIR__ . '/../template/navbar.php'); ?>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title">Healthcare Dashboard</h1>
                <p class="hero-subtitle">Comprehensive patient management and medical data analytics</p>

                <div class="stats-container">
                    <div class="stat-card pulse">
                        <div class="stat-number">247</div>
                        <div class="stat-label">Active Patients</div>
                    </div>
                    <div class="stat-card pulse">
                        <div class="stat-number">38</div>
                        <div class="stat-label">Today's Appointments</div>
                    </div>
                    <div class="stat-card pulse">
                        <div class="stat-number">12</div>
                        <div class="stat-label">Emergency Cases</div>
                    </div>
                    <div class="stat-card pulse">
                        <div class="stat-number">95%</div>
                        <div class="stat-label">Patient Satisfaction</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Main Content -->
    <div class="container">
        <!-- Dashboard Grid -->
        <div class="dashboard-grid">
            <!-- Recent Patients -->
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-user-injured"></i>
                    </div>
                    <div>
                        <h3 class="card-title">Recent Patients</h3>
                        <p class="card-subtitle">Latest patient registrations</p>
                    </div>
                </div>

                <div id="patients-loading" class="text-center" style="display: none;">
                    <div class="loading"></div>
                    <p class="mt-2">Loading patients...</p>
                </div>

                <div id="patients-error" class="error-message" style="display: none;"></div>

                <div id="patients-container">
                    <!-- Sample patients - replace with PHP data -->
                    <div class="user-card">
                        <div class="user-name">
                            <i class="fas fa-user-circle me-2 text-primary"></i>John Smith
                        </div>
                        <div class="user-email">john.smith@email.com</div>
                        <small class="text-muted">Last visit: 2 days ago</small>
                    </div>
                    <div class="user-card">
                        <div class="user-name">
                            <i class="fas fa-user-circle me-2 text-primary"></i>Sarah Johnson
                        </div>
                        <div class="user-email">sarah.johnson@email.com</div>
                        <small class="text-muted">Last visit: 1 week ago</small>
                    </div>
                    <div class="user-card">
                        <div class="user-name">
                            <i class="fas fa-user-circle me-2 text-primary"></i>Michael Brown
                        </div>
                        <div class="user-email">michael.brown@email.com</div>
                        <small class="text-muted">Last visit: 3 days ago</small>
                    </div>
                </div>

                <a href="/users" class="view-all-btn">
                    <i class="fas fa-users"></i>
                    View All Patients
                </a>
            </div>

            <!-- Medical Records -->
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-file-medical"></i>
                    </div>
                    <div>
                        <h3 class="card-title">Recent Medical Records</h3>
                        <p class="card-subtitle">Latest patient consultations</p>
                    </div>
                </div>

                <div id="records-loading" class="text-center" style="display: none;">
                    <div class="loading"></div>
                    <p class="mt-2">Loading records...</p>
                </div>

                <div id="records-error" class="error-message" style="display: none;"></div>

                <div id="records-container">
                    <!-- Sample records - replace with PHP data -->
                    <div class="post-card">
                        <div class="post-title">
                            <i class="fas fa-stethoscope me-2 text-success"></i>Regular Checkup - John Smith
                        </div>
                        <div class="post-excerpt">
                            Routine physical examination completed. All vitals normal. Recommended annual follow-up.
                        </div>
                        <small class="text-muted">
                            <i class="fas fa-clock me-1"></i>2 hours ago
                        </small>
                    </div>
                    <div class="post-card">
                        <div class="post-title">
                            <i class="fas fa-notes-medical me-2 text-warning"></i>Follow-up Visit - Sarah Johnson
                        </div>
                        <div class="post-excerpt">
                            Blood pressure monitoring. Medication adjustment recommended. Next visit in 2 weeks.
                        </div>
                        <small class="text-muted">
                            <i class="fas fa-clock me-1"></i>1 day ago
                        </small>
                    </div>
                    <div class="post-card">
                        <div class="post-title">
                            <i class="fas fa-prescription-bottle me-2 text-info"></i>Prescription Update - Michael Brown
                        </div>
                        <div class="post-excerpt">
                            Updated prescription for chronic condition management. Patient education provided.
                        </div>
                        <small class="text-muted">
                            <i class="fas fa-clock me-1"></i>3 days ago
                        </small>
                    </div>
                </div>

                <a href="/records" class="view-all-btn">
                    <i class="fas fa-file-medical-alt"></i>
                    View All Records
                </a>
            </div>

            <!-- Appointments Today -->
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <div>
                        <h3 class="card-title">Today's Appointments</h3>
                        <p class="card-subtitle">Scheduled for today</p>
                    </div>
                </div>

                <div class="appointment-list">
                    <div class="appointment-item d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                        <div>
                            <strong>09:00 AM</strong>
                            <div class="text-muted">Emma Wilson - Consultation</div>
                        </div>
                        <span class="badge bg-success">Confirmed</span>
                    </div>
                    <div class="appointment-item d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                        <div>
                            <strong>10:30 AM</strong>
                            <div class="text-muted">David Lee - Follow-up</div>
                        </div>
                        <span class="badge bg-warning">Pending</span>
                    </div>
                    <div class="appointment-item d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                        <div>
                            <strong>02:00 PM</strong>
                            <div class="text-muted">Lisa Chen - Checkup</div>
                        </div>
                        <span class="badge bg-success">Confirmed</span>
                    </div>
                </div>

                <a href="/appointments" class="view-all-btn">
                    <i class="fas fa-calendar-alt"></i>
                    View All Appointments
                </a>
            </div>

            <!-- Quick Stats -->
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-chart-pie"></i>
                    </div>
                    <div>
                        <h3 class="card-title">Quick Statistics</h3>
                        <p class="card-subtitle">Overview of key metrics</p>
                    </div>
                </div>

                <div class="stats-list">
                    <div class="stat-item d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <i class="fas fa-user-plus text-success me-2"></i>
                            <span>New Patients (This Month)</span>
                        </div>
                        <strong class="text-success">23</strong>
                    </div>
                    <div class="stat-item d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <i class="fas fa-procedures text-primary me-2"></i>
                            <span>Procedures Completed</span>
                        </div>
                        <strong class="text-primary">156</strong>
                    </div>
                    <div class="stat-item d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <i class="fas fa-prescription text-info me-2"></i>
                            <span>Prescriptions Issued</span>
                        </div>
                        <strong class="text-info">89</strong>
                    </div>
                    <div class="stat-item d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <i class="fas fa-exclamation-triangle text-warning me-2"></i>
                            <span>Pending Reviews</span>
                        </div>
                        <strong class="text-warning">7</strong>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
            <a href="/patients/new" class="action-btn">
                <i class="fas fa-user-plus"></i>
                <span>Add New Patient</span>
            </a>
            <a href="/appointments/schedule" class="action-btn">
                <i class="fas fa-calendar-plus"></i>
                <span>Schedule Appointment</span>
            </a>
            <a href="/prescriptions/new" class="action-btn">
                <i class="fas fa-prescription"></i>
                <span>Create Prescription</span>
            </a>
            <a href="/reports/generate" class="action-btn">
                <i class="fas fa-file-alt"></i>
                <span>Generate Report</span>
            </a>
        </div>
    </div>

    <?php require_once(__DIR__ . '/../template/footer.php'); ?>
    <?php require_once(__DIR__ . '/../template/scripts.php'); ?>
    <script src='/js/home.js'></script>

</body>

</html>