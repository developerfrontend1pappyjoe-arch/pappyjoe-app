import { useMutation, useQueryClient } from "@tanstack/react-query";
type axiosFunctionType = () => Promise<any>;
const useSavePostData = (AxiosFunction: any) => {
  return useMutation<axiosFunctionType, Error, void>(AxiosFunction);
};

 const useGetFetchQuery = (name:string[]) => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(name);
};


export {useSavePostData,useGetFetchQuery};
