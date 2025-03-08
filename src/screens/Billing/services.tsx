import { API_URL } from "utils/constants";
import { formatInvoiceData, formatReceiptData } from "./formatData";
import { axiosInstance } from "config/axios.config.custom";
import { InvoiceListResponseType, InvoiceOperationType } from "./Invoice/types";
import { AxiosRequestConfig } from "axios";
import { billingData } from "../../mockData";
import { ReceiptResultArrayType } from "./Receipt/types";
const axios = axiosInstance;

export const getInvoiceList = async (
  id: string
): Promise<InvoiceListResponseType> => {
  console.log("getInvoiceList called");

  try {
    const result = await (
      await axios.get(`${API_URL.getInvoice}?patient_id=${id}`)
    ).data;
    // const result = billingData.inVoiceList;
    if (result.status == 200) {
      const formatedData = formatInvoiceData(result.data);
      return formatedData;
    } else {
      return { invoiceList: [], print: null };
    }
  } catch (error) {
    return { invoiceList: [], print: null };
  }
};

export const getReceiptList = async (
  id: string
): Promise<{ list: ReceiptResultArrayType[]; print: any }> => {
  console.log("getReceiptList called");

  try {
    const result = await (
      await axios.get(`${API_URL.getReceipt}?patient_id=${id}`)
    ).data;
    // const result = billingData.receiptList;
    if (result.status == 200) {
      const formatedData = formatReceiptData(result.data);
      return formatedData;
    } else {
      return { list: [], print: null };
    }
  } catch (error) {
    return { list: [], print: null };
  }
};

export const invoiceOperation = async (body: {
  params: InvoiceOperationType | FormData;
  method: "put" | "post" | "delete";
}) => {
  try {
    if (body.method == "delete") {
      return (
        await axios.delete(API_URL.invoiceOperation, {
          data: body.params,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      ).data;
    } else {
      return (await axios[body.method](API_URL.invoiceOperation, body.params))
        .data;
    }
  } catch (error: any) {
    return new Error(error.response.data.message);
  }
};

export const getInvoiceMasterList = async ({
  searchTerm,
  patientId,
}: {
  searchTerm: string;
  patientId: string;
}) => {
  console.log("------getInvoiceMasterList------")
  try {
    return (
      await axios.get(
        `${API_URL.invoiceMasterList}?searchterm=${searchTerm}&patient_id=${patientId}`
      )
    ).data;
  } catch (error: any) {
    return new Error(error.response.data.message);
  }
};

export const getFinaceMaster =async ()=>{
  console.log("getFinaceMaster called------")
  try {
    return (
      await axios.get(
        `${API_URL.financeMaster}`
      )
    ).data;
  } catch (error: any) {
    return new Error(error.response.data.message);
  }
}
