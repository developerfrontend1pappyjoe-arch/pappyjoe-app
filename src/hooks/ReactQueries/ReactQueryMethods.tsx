import {useMutation} from 'react-query';

type axiosFunctionType = () => Promise<any>;

const useSavePostData = (AxiosFunction: any) => {
  return useMutation<axiosFunctionType, Error, void>(AxiosFunction);
};

export {useSavePostData};
