import React from 'react';
import ContentLoader from 'react-native-easy-content-loader';

interface CustomContentLoaderProps {
  listSize?: number;
  tWidth? : number | string
  pHeight ? : number | string
}
export const CustomContentLoader = ({listSize,tWidth,pHeight}: CustomContentLoaderProps) => {
  return (
    <ContentLoader
      avatar
      tWidth={tWidth}
      listSize={listSize}
      pRows={2}
      pHeight={pHeight || [10, 10]}
      pWidth={['100%', '100%']}
    />
  );
};
