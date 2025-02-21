import React, { useContext } from "react"
import { MoadalContext } from "providers/ModalProviders"

const useModal = ()=>{
     return useContext(MoadalContext)    
}

export default useModal