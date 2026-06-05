type LoginDataLike = {
  roles?: { admin?: string; doctor?: string };
  userdetails?: { user_id?: string | number };
};

type AppointmentLike = {
  Doctor_id?: string | number;
};

export const isLoggedInUserAppointmentDoctor = (
  appointment: AppointmentLike | null | undefined,
  loginData: LoginDataLike | null | undefined,
): boolean => {
  const doctorId = appointment?.Doctor_id;
  const userId = loginData?.userdetails?.user_id;

  if (doctorId == null || userId == null) {
    return false;
  }

  return String(doctorId) === String(userId);
};

export const isAdminUser = (
  loginData: LoginDataLike | null | undefined,
): boolean => loginData?.roles?.admin === "1";

export const canManageAppointment = (
  appointment: AppointmentLike | null | undefined,
  loginData: LoginDataLike | null | undefined,
): boolean =>
  isAdminUser(loginData) ||
  isLoggedInUserAppointmentDoctor(appointment, loginData);

export const APPOINTMENT_ACCESS_DENIED_MESSAGE =
  "You can only open and manage appointments assigned to you.";

export const filterAppointmentsForUser = (
  appointments: AppointmentLike[],
  loginData: LoginDataLike | null | undefined,
): AppointmentLike[] => {
  if (isAdminUser(loginData)) {
    return appointments;
  }

  const userId = loginData?.userdetails?.user_id;
  if (loginData?.roles?.doctor === "1" && userId != null) {
    return appointments.filter(
      (item) => String(item.Doctor_id) === String(userId),
    );
  }

  return appointments;
};
