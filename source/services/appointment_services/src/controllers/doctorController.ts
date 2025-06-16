import { Response } from 'express';
import Doctor from '../models/Doctor';
import { AuthRequest, ApiResponse } from '../types';
import { IDoctorInput } from '../types/doctor.types';

export class DoctorController {
    static async createDoctorProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!._id;
            const doctorData: IDoctorInput = req.body;

            // Check if doctor profile already exists
            const existingDoctor = await Doctor.findOne({ user: userId });
            if (existingDoctor) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Doctor profile already exists'
                }
                res.status(400).json(response);
                return;
            }

            const doctor = new Doctor({
                ...doctorData,
                user: userId
            });

            await doctor.save();
            await doctor.populate('user');

            const response: ApiResponse = {
                success: true,
                data: doctor,
                message: 'Doctor profile created successfully'
            }
            res.status(201).json(response);
        } catch (error) {
            const err = error as Error;
            const response: ApiResponse = {
                success: false,
                message: 'Failed to create doctor profile',
                error: err.message
            }
            res.status(500).json(response);
        }
    }


    static async getAllDoctors(req: AuthRequest, res: Response): Promise<void> {
        try {
            const {
                specialization,
                page = 1,
                limit = 10,
                sortBy = 'rating',
                sortOrder = 'desc'
            } = req.query;

            const query: any = {};
            if (specialization) {
                query.specialization = { $regex: specialization, $options: 'i' };
            }

            const skip = (Number(page) - 1) * Number(limit);
            const sort: any = {};
            sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

            const doctors = await Doctor.find(query)
                .populate('user', 'name email phone')
                .sort(sort)
                .skip(skip)
                .limit(Number(limit));

            const total = await Doctor.countDocuments(query);

            res.json({
                success: true,
                data: doctors,
                message: 'Doctors retrieved successfully',
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / Number(limit))
                }
            } as ApiResponse);
        } catch (error) {
            const err = error as Error;
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve doctors',
                error: err.message
            } as ApiResponse);
        }
    }

    static async getDoctorById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { doctorId } = req.params;


            const doctor = await Doctor.findById(doctorId)
                .populate('user', 'name email phone');

            if (!doctor) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Doctor not found'
                };
                res.status(404).json(response);
                return;
            }

            const response: ApiResponse = {
                success: true,
                data: doctor,
                message: 'Doctor retrieved successfully'
            };
            res.json(response);
        } catch (error) {
            const err = error as Error;
            const response: ApiResponse = {
                success: false,
                message: 'Failed to retrieve doctor',
                error: err.message
            };
            res.status(500).json(response);
        }
    }
    static async updateDoctorProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!._id;
            const updateData = req.body;

            const doctor = await Doctor.findOneAndUpdate(
                { user: userId },
                updateData,
                { new: true, runValidators: true }
            ).populate('user');

            if (!doctor) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Doctor profile not found'
                };
                res.status(404).json(response);
                return;
            }

            const response: ApiResponse = {
                success: true,
                data: doctor,
                message: 'Doctor profile updated successfully'
            };
            res.json(response);
        } catch (error) {
            const err = error as Error;
            const response: ApiResponse = {
                success: false,
                message: 'Failed to update doctor profile',
                error: err.message
            };
            res.status(500).json(response);
        }
    }
}
