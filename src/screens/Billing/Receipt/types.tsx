import { Dispatch, SetStateAction } from "react";

export type ReceiptItemType = {
  date_time: string;
  receipt_no: string;
  amount: string;
  inv_nos: string;
  added_date: string;
  ptype: string;
  category: string;
};

export type ReceiptObjectType = {
  data: ReceiptItemType[];
  receiptNo: string;
};

export type ReceiptResultArrayType = {
  date: string;
  list: ReceiptObjectType[];
};

export type ReceiptContextType = {
  refreshing: boolean;
  setRefreshing: Dispatch<SetStateAction<boolean>>;
};
