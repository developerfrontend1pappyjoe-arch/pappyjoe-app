import { method } from "lodash";
import { InvoiceOperationType } from "../Invoice/types";
import { axiosInstance } from "config/axios.config.custom";

import { invoiceOperation } from "../services";
import { useToast } from "react-native-toast-notifications";
import { colorList } from "styles/global.styles";
import { useWindowDimensions } from "react-native";
import { useContext } from "react";
import { InvoiceContext } from "../Invoice";
import { useMutation } from "@tanstack/react-query";
export const useDeleteInvoice = ()=>{
    const dimention = useWindowDimensions()
    const toast = useToast()
    const {setRefreshing} = useContext(InvoiceContext)
       return useMutation(invoiceOperation,{
        onSuccess:(result)=>{
               if(result.status){
                setRefreshing(true)
                toast.show(result.message,{
                    type: "success", 
                    placement: "top",
                    style:{width:dimention.width-10},
                })
               }else{
                toast.show(result.message,{
                    type: "warning", 
                    placement: "top",
                    style:{width:dimention.width-10},
                })
               }
        },
        onError:(e:any)=>{
            toast.show(e.response.data.message,{
                type: "warning", 
                placement: "top",
                style:{width:dimention.width-10},
            })
        }
       })
}