import { Dispatch, SetStateAction } from "react";

export type InvoiceItemType = {
  date_time: string;
  Item_name: string;
  item_id: string;
  cost: string;
  quantity: string;
  discount: string;
  discount_type: string;
  tax: string;
  batch: string;
  itemtotal: string;
  invoicetotal: string;
  invoicebalance: string;
  status: string;
  stockqty: string;
};

export type InvoiceObjectType = {
  data: InvoiceItemType[];
  inviceNo: string;
  invoicetotal: string;
  status: string;
  invoicebalance: string;
};

export type ResultArrayType = {
  date: string;
  list: InvoiceObjectType[];
};

export type InvoiceContextType = {
  refreshing: boolean;
  setRefreshing: Dispatch<SetStateAction<boolean>>;
};

export type InvoiceSaveObjectType = {
  item_id: string;
  item_quantity: string;
  item_cost: string;
  item_tax_amount: string;
  item_tax_id: string;
  item_discount: string;
  item_discount_type: string;
  item_total_amount: string;
  total_cost: string;
  total_discount: string;
  total_tax: string;
  total_amount: string;
}

export type InvoiceOperationType = {
  patient_id: string;
  date: string;
  inv_number?: string;
  items:InvoiceSaveObjectType[];
};
