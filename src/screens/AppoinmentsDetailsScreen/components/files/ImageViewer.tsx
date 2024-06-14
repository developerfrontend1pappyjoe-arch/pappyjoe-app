import React from 'react';
import ImageViewer from 'react-native-image-viewing';

export const CustomImageViewer = ({visible, img, close}: any) => {
  return (
    <ImageViewer
      images={img}
      imageIndex={0}
      visible={visible}
      onRequestClose={close}
    />
  );
};
