import { axiosInstance as axios } from "../../../config/axios.config.custom";
import { API_URL } from "../../../utils/constants";
import { QrPaymentItemType } from "../types";

export const getQrPaymentListService = async (): Promise<QrPaymentItemType[]> => {
  const result = (await axios.get(API_URL.qrList)).data;
  if (result?.status === 200 && Array.isArray(result.data)) {
    return result.data;
  }
  return [];
};
