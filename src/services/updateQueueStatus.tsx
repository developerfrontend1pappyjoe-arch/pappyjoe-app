import { API_URL } from "../utils/constants";
import { axiosInstance as axios } from "../config/axios.config.custom";

interface updateQueueStatus {
  app_id: string;
  queuestatus: string;
}

export const updateQueueStatus = async ({
  method,
  payload,
}: {
  payload: FormData;
  method: "put" | "delete";
}) => {
  if (method == "delete") {
    const res = await axios.delete(API_URL.addAppoinments, {
      data: payload,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res?.data;
  }
  if (method == "put") {
    const res = await axios[method](API_URL.fixAppointment, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res?.data;
  }
};
