const BASE_URL = 'https://cloud.pappyjoe.com/mobapi';

const API_URL = {
  login: `${BASE_URL}/login`,
  register: `${BASE_URL}/register`,
  patientList: `${BASE_URL}/patients`,
  appointments: `${BASE_URL}/appointments`,
  verifyOtp: `${BASE_URL}/verify_otp`,
  clinicNoteList: `${BASE_URL}/clinicnotelist`,
  treatmentList: `${BASE_URL}/treatmentlist`,
  fileslist: `${BASE_URL}/fileslist`,
  doctorlist: `${BASE_URL}/doctorlist`,
  clinicList: `${BASE_URL}/cliniclist`,
  clinicNotes: `${BASE_URL}/clinicnotes`,
  addPatient: `${BASE_URL}/addpatient`,
  addAppoinments: `${BASE_URL}/fixappointment`,
  addTreatments: `${BASE_URL}/treatments`,
  addFiles: `${BASE_URL}/fileupload`,
  getProcedureMaster: `${BASE_URL}/proceduremaster`,
  vitalsList: `${BASE_URL}/vitalslist`,
  countryList: `${BASE_URL}/generalmaster`,
  resetPassword: `${BASE_URL}/reset_password`,
  fixAppointment: `${BASE_URL}/fixappointment`,
  vitals: `${BASE_URL}/vitals`,
  prescriptionlist: `${BASE_URL}/prescriptionlist`,
  medicineMaster: `${BASE_URL}/medicinemaster`,
  addPrescription: `${BASE_URL}/prescription`,
  getZoomLink: `${BASE_URL}/zoom`,
  getClinicalNotesMaster: `${BASE_URL}/clinicnotemaster`,
  getPrescriptionTemplatelist: `${BASE_URL}/templatelist`,
  patientProfileUpload: `${BASE_URL}/profilephoto`,
};

export {BASE_URL, API_URL};

export const storeKeys = {
  loginData: 'loginData',
};
