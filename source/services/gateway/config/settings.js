import dotenv from 'dotenv';
dotenv.config();

export const ContextPathMap = new Map([
  ['patient', process.env.PATIENT_SERVICES],
  ['b', process.env.B_SERVICES],
  ['c', process.env.C_SERVICES]
]);
