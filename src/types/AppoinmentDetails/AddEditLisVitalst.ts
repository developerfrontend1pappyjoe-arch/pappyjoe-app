import { PatientDetails } from "../PatientDetailsTypes";

export interface AddEditVitalsFormProps {
    close: ()=>void;
    patientDetails: PatientDetails;
    refetch: ()=>void;
    editData: any;
  }


export interface dataTypes {
  Name: string;
  print_url: string;
  Patient_country_code: string;
  mobile: string;
  email: string;
}

export interface ShareModalTypes {
  open: boolean;
  data: dataTypes;
  closeMenu: () => void;
  openMenu: () => void;
  prints:boolean 
  email:boolean 
  whatsapp:boolean 
  message:boolean 
  mailTitle?: string
  mailContent?: string
}