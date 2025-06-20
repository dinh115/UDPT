import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';

const app = express();
const PORT = 3000;
app.use(morgan('dev'));
app.use(express.json());

// Proxy configuration for the Patient service
const PatientServiceUrl = 'http://patient-service:3001';
app.use('/patient', createProxyMiddleware({
  target: PatientServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/patient': '', 
  },
}));

// // Proxy configuration for the employee service
// const EmployeeServiceUrl = 'http://employee-service:3002';
// app.use('/employee', createProxyMiddleware({
//   target: userServiceUrl,
//   changeOrigin: true,
//   pathRewrite: {
//     '^/employee': '', 
//   },
// }));

// // Proxy configuration for the doctor service
// const DoctorServiceUrl = 'http://doctor-service:3003';
// app.use('/doctors', createProxyMiddleware({
//   target: doctorServiceUrl,
//   changeOrigin: true,
//   pathRewrite: {
//     '^/doctors': '',
//   },
// }));

app.listen(PORT, () => {
  console.log(`api-gateway running at http://localhost:${PORT}`);
});
