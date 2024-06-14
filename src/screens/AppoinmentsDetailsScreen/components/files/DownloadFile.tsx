import RNFS from 'react-native-fs';

export const DownloadFile = url => {
  const downloadFiles = async (url, fileName) => {
    try {
      const sanitizedFileName = fileName.replace(/\s/g, '');
      const downloadDest = `${RNFS.DownloadDirectoryPath}/${sanitizedFileName}`;
      const options = {
        fromUrl: url,
        toFile: downloadDest,
        background: true,
        discretionary: true,
        progress: res => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Progress: ${progress.toFixed(2)}%`);
        },
      };

      return new Promise((resolve, reject) => {
        RNFS.downloadFile(options)
          .promise.then(response => {
            console.log('File downloaded!', response);
            // setLoading(false);
            resolve(downloadDest);
          })
          .catch(err => {
            console.log('Download error:', err);
            reject(err);
          });
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      return Promise.reject(error);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const resultFilePath = await downloadFiles(url, url?.split('/').pop());
      const type = url?.split('/').pop()?.split('.').pop();
      const mimeType =
        type === 'pdf'
          ? `${'application'}/${'pdf'}`
          : type === 'jpeg'
            ? `${'application'}/${'pdf'}`
            : '';
    } catch (err) {
      console.error('Errrrr', err);
    }
  };
};
