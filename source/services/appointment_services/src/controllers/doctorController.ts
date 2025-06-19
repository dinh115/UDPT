import { Response } from 'express';
import Doctor from '../models/Doctor';
import { AuthRequest, ApiResponse } from '../types';
import { IDoctorInput, IAvailability, ITimeSlot } from '../types/doctor.types';
import { UtilHelper } from '../utils';
import { UserRole } from '../types/user.types';

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

            // Auto-generate 30-minute slots from provided availability
            const processedAvailability = doctorData.availability.map(avail => ({
                day: avail.day,
                slots: UtilHelper.convertToAutoSlots(avail.slots)
            }));

            const doctor = new Doctor({
                ...doctorData,
                user: userId,
                availability: processedAvailability
            });

            await doctor.save();
            await doctor.populate('user');

            const response: ApiResponse = {
                success: true,
                data: doctor,
                message: 'Doctor profile created successfully with auto-generated time slots'
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

            // If availability is being updated, auto-generate slots
            if (updateData.availability) {
                updateData.availability = updateData.availability.map((avail: IAvailability) => ({
                    day: avail.day,
                    slots: UtilHelper.convertToAutoSlots(avail.slots)
                }));
            }

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

            const isAdmin = req.user!.role === UserRole.ADMIN;
            const isEmployee = req.user!.role === UserRole.EMPLOYEE;
            if (!doctor.user._id.equals(req.user?._id) && !isAdmin && !isEmployee) {
                const response: ApiResponse = {
                    success: false,
                    message: 'You can only update your profile slots.'
                };
                res.status(400).json(response);
                return;
            }

            const response: ApiResponse = {
                success: true,
                data: doctor,
                message: 'Doctor profile updated successfully with auto-generated time slots'
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

    static async getAvailableTimeSlots(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { doctorId, date } = req.params;
            const doctor = await UtilHelper.getDoctorOrRespond(doctorId, res);
            if (!doctor) return;
            const validDate = UtilHelper.getDateOrResponse(date, res);
            if (!validDate) return;
            const availableSlots = await UtilHelper.getDoctorAvailableSlots(doctorId, date);

            const response: ApiResponse = {
                success: true,
                data: availableSlots,
                message: availableSlots.length ? 'Available slots retrieved successfully' : 'Doctor is not available on this day'
            };
            res.json(response);
        } catch (error) {
            const err = error as Error;
            const response: ApiResponse = {
                success: false,
                message: err.message || 'Failed to retrieve available slots'
            };
            res.status(err.message === 'Doctor not found' ? 404 : 500).json(response);
        }
    }

    /**
   * Generate time slots from a time range
   * POST /api/doctors/generate-slots
   * Body: { startTime: "08:00", endTime: "17:00", gap?: 30 }
   */
    static async generateTimeSlots(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { startTime, endTime, gap = Number(process.env.TIMESLOT_GAP) || 30 } = req.body;

            if (!startTime || !endTime) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Start time and end time are required'
                };
                res.status(400).json(response);
                return;
            }

            // Validate time format
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Invalid time format. Use HH:MM format'
                };
                res.status(400).json(response);
                return;
            }

            // Set gap in environment variable temporarily if provided
            const originalGap = process.env.TIMESLOT_GAP;
            process.env.TIMESLOT_GAP = gap.toString();

            const slots = UtilHelper.generateTimeSlots(startTime, endTime);

            // Restore original gap
            if (originalGap) {
                process.env.TIMESLOT_GAP = originalGap;
            } else {
                delete process.env.TIMESLOT_GAP;
            }

            const response: ApiResponse = {
                success: true,
                data: {
                    timeRange: { startTime, endTime },
                    gap: gap,
                    totalSlots: slots.length,
                    slots: slots
                },
                message: `Generated ${slots.length} time slots with ${gap} minutes gap`
            };
            res.json(response);
        } catch (error) {
            const err = error as Error;
            const response: ApiResponse = {
                success: false,
                message: 'Failed to generate time slots',
                error: err.message
            };
            res.status(500).json(response);
        }
    }

    /**
    * Update doctor availability with auto-generated slots
    * PUT /api/doctors/:doctorId/availability
    * Body: { availability: [{ day: "Monday", slots: [{ startTime: "08:00", endTime: "12:00" }] }] }
    */
    static async updateDoctorAvailability(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { doctorId } = req.params;
            const { availability } = req.body;

            if (!availability || !Array.isArray(availability)) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Availability array is required.'
                };
                res.status(400).json(response);
                return;
            }

            const doctor = await UtilHelper.processAndSaveDoctorAvailability(doctorId, availability);

            const isAdmin = req.user!.role === UserRole.ADMIN;
            const isEmployee = req.user!.role === UserRole.EMPLOYEE;
            if (!doctor.user._id.equals(req.user?._id) && !isAdmin && !isEmployee) {
                const response: ApiResponse = {
                    success: false,
                    message: 'You can only regenerate your profile slots.'
                };
                res.status(400).json(response);
                return;
            }

            const response: ApiResponse = {
                success: true,
                data: doctor,
                message: 'Doctor availability updated with auto-generated time slots'
            };
            res.json(response);
        } catch (error) {
            const err = error as Error;
            const response: ApiResponse = {
                success: false,
                message: err.message || 'Failed to update doctor availability',
                error: err.message
            };
            res.status(err.message === 'Doctor not found' ? 404 : 500).json(response);
        }
    }

    /**
  * Get doctor slot statistics
  * GET /api/doctors/:doctorId/slot-statistics?date=2024-01-15
  */
    static async getDoctorSlotStatistics(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { doctorId } = req.params;
            const { date } = req.query;

            const statistics = await UtilHelper.getDoctorSlotStatistics(
                doctorId,
                date as string
            );

            const response: ApiResponse = {
                success: true,
                data: statistics,
                message: 'Slot statistics retrieved successfully'
            };
            res.json(response);
        } catch (error) {
            const err = error as Error;
            const response: ApiResponse = {
                success: false,
                message: err.message || 'Failed to retrieve slot statistics',
                error: err.message
            };
            res.status(err.message === 'Doctor not found' ? 404 : 500).json(response);
        }
    }

    /**
   * Regenerate all slots for a doctor (useful for changing slot duration)
   * POST /api/doctors/:doctorId/regenerate-slots
   * Body: { gap?: 30 }
   */
    static async regenerateDoctorSlots(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { doctorId } = req.params;
            const { gap = 30 } = req.body;

            const doctor = await Doctor.findById(doctorId);
            if (!doctor) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Doctor not found'
                };
                res.status(404).json(response);
                return;
            }

            const isAdmin = req.user!.role === UserRole.ADMIN;
            const isEmployee = req.user!.role === UserRole.EMPLOYEE;
            if (!doctor.user._id.equals(req.user?._id) && !isAdmin && !isEmployee) {
                const response: ApiResponse = {
                    success: false,
                    message: 'You can only regenerate your profile slots.'
                };
                res.status(400).json(response);
                return;
            }

            // Set gap temporarily
            const originalGap = process.env.TIMESLOT_GAP;
            process.env.TIMESLOT_GAP = gap.toString();

            // Recreate slots with new gap, preserving booking status by time matching
            const updatedAvailability = doctor.availability.map(avail => {
                // Group existing slots by their original time ranges
                const timeRanges: { startTime: string; endTime: string; bookedSlots: string[] }[] = [];

                // Find consecutive slots to rebuild original ranges
                const sortedSlots = avail.slots.sort((a, b) => a.startTime.localeCompare(b.startTime));

                if (sortedSlots.length > 0) {
                    let currentRange = {
                        startTime: sortedSlots[0].startTime,
                        endTime: sortedSlots[0].endTime,
                        bookedSlots: sortedSlots[0].isBooked ? [sortedSlots[0].startTime] : []
                    };

                    for (let i = 1; i < sortedSlots.length; i++) {
                        const slot = sortedSlots[i];

                        // If current slot starts where previous ended, extend the range
                        if (slot.startTime === currentRange.endTime) {
                            currentRange.endTime = slot.endTime;
                            if (slot.isBooked) {
                                currentRange.bookedSlots.push(slot.startTime);
                            }
                        } else {
                            // Save current range and start new one
                            timeRanges.push(currentRange);
                            currentRange = {
                                startTime: slot.startTime,
                                endTime: slot.endTime,
                                bookedSlots: slot.isBooked ? [slot.startTime] : []
                            };
                        }
                    }
                    timeRanges.push(currentRange);
                }

                // Generate new slots from time ranges
                const newSlots: ITimeSlot[] = [];
                for (const range of timeRanges) {
                    const generatedSlots = UtilHelper.generateTimeSlots(range.startTime, range.endTime);

                    // Restore booking status for slots that were previously booked
                    generatedSlots.forEach(slot => {
                        if (range.bookedSlots.includes(slot.startTime)) {
                            slot.isBooked = true;
                        }
                    });

                    newSlots.push(...generatedSlots);
                }

                return {
                    day: avail.day,
                    slots: newSlots
                };
            });

            doctor.availability = updatedAvailability;
            await doctor.save();

            // Restore original gap
            if (originalGap) {
                process.env.TIMESLOT_GAP = originalGap;
            } else {
                delete process.env.TIMESLOT_GAP;
            }

            const response: ApiResponse = {
                success: true,
                data: doctor,
                message: `Doctor slots regenerated with ${gap} minutes gap`
            };
            res.json(response);
        } catch (error) {
            const err = error as Error;
            const response: ApiResponse = {
                success: false,
                message: 'Failed to regenerate doctor slots',
                error: err.message
            };
            res.status(500).json(response);
        }
    }
}
