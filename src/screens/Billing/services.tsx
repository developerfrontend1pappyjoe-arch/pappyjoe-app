import { API_URL } from "utils/constants"
import { formatData } from "./formatData"
import { axiosInstance } from "config/axios.config.custom"
import { InvoiceOperationType } from "./Invoice/types"
import { AxiosRequestConfig } from "axios"
const axios = axiosInstance
export const getInvoiceList = async (id:string)=>{
   console.log("getInvoiceList called");
   
  try {
     const result = await (await axios.get(`${API_URL.getInvoice}?patient_id=${id}`)).data  
     if(result.status == 200){
        const formatedData = formatData(result.data) 
        return formatedData 
     }else{
        return []
     }
  } catch (error) {
       return []
  } 
}

export const invoiceOperation = async (body:{params:InvoiceOperationType | FormData,method:"put" | "post" | "delete"})=>{
   const config: AxiosRequestConfig = {
      headers: body.method == "delete"
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
    };
   return (await axios[body.method](API_URL.invoiceOperation,body.params,config)).data
}