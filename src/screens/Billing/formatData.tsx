import { InvoiceItemType, ResultArrayType } from "./Invoice/types";
import { ReceiptObjectType, ReceiptResultArrayType } from "./Receipt/types";

export const formatInvoiceData = (
  data: any
): { invoiceList: ResultArrayType[]; print: any } => {
  let result: ResultArrayType[] = [];
  const arraIndex: any = {};
  let date = "";
  let status = "";
  let invoicetotal = "0";
  let invoicebalance = "0";
  for (let key in data) {
    if (key != "print") {
      date = data[key][0]?.date_time as string;
      status = data[key][0]?.status;
      invoicetotal = data[key][0]?.invoicetotal;
      invoicebalance = data[key][0]?.invoicebalance;
      if (date) {
        if (arraIndex[date as keyof typeof arraIndex] >= 0) {
          result[arraIndex[date]] = {
            ...result[arraIndex[date]],
            list: [
              ...result[arraIndex[date]].list,
              {
                inviceNo: key,
                data: data[key],
                status,
                invoicetotal,
                invoicebalance,
              },
            ]?.reverse(),
          };
        } else {
          arraIndex[date] = result.length;
          result.push({
            date,
            list: [
              {
                inviceNo: key,
                data: data[key],
                status,
                invoicetotal,
                invoicebalance,
              },
            ]?.reverse(),
          });
        }
      }
    }
  }
  return { invoiceList: result.reverse(), print: data?.print || null };
};

export const formatReceiptData = (
  data: any
): { print: any; list: ReceiptResultArrayType[] } => {
  let result: ReceiptResultArrayType[] = [];
  const arraIndex: any = {};
  let date = "";
  for (let key in data) {
    if (key != "print") {
      date = data[key][0]?.date_time as string;
      if (date) {
        if (arraIndex[date as keyof typeof arraIndex] >= 0) {
          result[arraIndex[date]] = {
            ...result[arraIndex[date]],
            list: [
              ...result[arraIndex[date]].list,
              { receiptNo: key, data: data[key] },
            ],
          };
        } else {
          arraIndex[date] = result.length;
          result.push({
            date,
            list: [{ receiptNo: key, data: data[key] }],
          });
        }
      }
    }
  }
  return { list: result.reverse(), print: data?.print || null };
};


