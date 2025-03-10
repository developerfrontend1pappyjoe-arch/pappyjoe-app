import { API_URL } from "utils/constants";
import { formatInvoiceData, formatReceiptData } from "./formatData";
import { axiosInstance } from "config/axios.config.custom";
import {
  InvoiceListResponseType,
  InvoiceOperationType,
  InvoicePayloadObject,
} from "./Invoice/types";
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
  console.log("------getInvoiceMasterList------");
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

export const getFinaceMaster = async () => {
  console.log("getFinaceMaster called------");
  try {
    let result = (await axios.get(`${API_URL.financeMaster}`)).data;
    if (result?.data?.taxes?.length) {
      result = {
        ...result,
        data: {
          ...result.data,
          taxObject: Object.fromEntries(
            result?.data.taxes.map((item: any) => [item.id, item])
          ),
        },
      };
    }
    return result;
  } catch (error: any) {
    return new Error(error.response.data.message);
  }
};

export const saveInvoice = async (params: {
  patient_id: string | undefined;
  date: string;
  items: InvoicePayloadObject[];
  inv_number?: string;
  total: {
    total_amount: string;
    total_cost: string;
    total_discount: string;
    total_tax: string;
  };
}) => {
  let items: InvoicePayloadObject[] = [];
  params.items.forEach((item) => {
    items.push({ ...item, ...params.total });
  });

  try {
    const body = { ...params, items };
    body.total && delete body.total;
    console.log(body);
    return (await axios.post(API_URL.saveInvoice, body)).data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
const data = {
  date: "2025-03-10",
  inv_number: "1484",
  items: [
    {
      item_cost: "17500",
      item_discount: "0",
      item_discount_type: "%",
      item_id: "395661",
      item_quantity: "1",
      item_tax_amount: "3150",
      item_tax_id: "208",
      item_total_amount: "17500.00",
      total_amount: "17500.00",
      total_cost: "17500.00",
      total_discount: "0.00",
      total_tax: "3150.00",
    },
  ],
  patient_id: "5596833",
};
