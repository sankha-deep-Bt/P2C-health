import AppointmentModel from "../models/appointment.model";

export const createAppointment = async (
  doctorId: string,
  doctorName: string,
  patientId: string,
  patientName: string,
  date: Date,
  reason: string
) => {
  const appointment = await AppointmentModel.create({
    doctorId,
    doctorName,
    patientId,
    patientName,
    date: new Date(),
    reason,
  });
  return appointment;
};

export const getAppointmentsByUser = async (userId: string, role: string) => {
  let filter: any = {};
  if (role === "doctor") filter.doctorId = userId;
  else filter.patientId = userId;

  const appointments = await AppointmentModel.find(filter)
    .populate("doctorId", "name email")
    .populate("patientId", "name email");

  return appointments;
};

export const updateAppointmentStatus = async (
  appointmentId: string,
  status: "pending" | "confirmed" | "cancelled" | "completed"
) => {
  const appointment = await AppointmentModel.findByIdAndUpdate(
    appointmentId,
    { status },
    { new: true }
  );
  return appointment;
};

export const removeAppointment = async (appointmentId: string) => {
  await AppointmentModel.findByIdAndDelete(appointmentId);
};

export const findAppointmentUsingFilter = async (filter: any) => {
  return AppointmentModel.find(filter)
    .populate("doctorId", "name email")
    .populate("patientId", "name email");
};
