import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';

const app = express();
const PORT = 3000;
app.use(morgan('dev'));
app.use(express.json());

// Proxy configuration for the Patient service
const PatientServiceUrl = 'http://patient-service:3001';
app.use('/products', createProxyMiddleware({
  target: productServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/products': '', // Remove /products prefix when forwarding to the product service
  },
}));

// Proxy configuration for the employee service
const EmployeeServiceUrl = 'http://employee-service:3002';
app.use('/users', createProxyMiddleware({
  target: userServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/users': '', // Remove /users prefix when forwarding to the user service
  },
}));

// Proxy configuration for the doctor service
const DoctorServiceUrl = 'http://doctor-service:3003';
app.use('/doctors', createProxyMiddleware({
  target: doctorServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/doctors': '', // Remove /doctors prefix when forwarding to the doctor service
  },
}));

app.listen(PORT, () => {
  console.log(`api-gateway running at http://localhost:${PORT}`);
});
