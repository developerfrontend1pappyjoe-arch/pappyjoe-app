import { Dispatch, ReactNode, SetStateAction } from "react"

export type CustomModalType = {
    title:string | ReactNode;
    open:boolean;
    setOpen?:Dispatch<SetStateAction<boolean>> | null | undefined;
    handleCloseModal?:Function | null | undefined;
}