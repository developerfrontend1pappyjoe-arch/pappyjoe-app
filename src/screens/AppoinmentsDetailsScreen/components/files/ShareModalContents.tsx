import {memo, useState} from 'react';
import {Alert} from 'react-native';
import {Button, Menu, Divider} from 'react-native-paper';
import {colorList} from '../../../../styles/global.styles';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import {CustomLoaderRound} from '../../../../components/CustomLoaderRound';
import Icons from 'react-native-vector-icons/MaterialIcons'

interface ShareModalContentsTypes {
  open: boolean;
  data: any;
  closeMenu: () => void;
  openMenu: () => void;
}

export const ShareModalContents = memo(
  ({open, data, closeMenu, openMenu}: ShareModalContentsTypes) => {
    const [isLoading, setLoading] = useState(false);
    const downloadFiles = async (url, fileName) => {
      try {
        const sanitizedFileName = fileName.replace(/\s/g, '');
        const downloadDest = `${RNFS.DocumentDirectoryPath}/${sanitizedFileName}`;
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
              setLoading(false);
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

    const handleFileShare = async (url: string, shareType: string) => {
      try {
        setLoading(true);
        const resultFilePath = await downloadFiles(url, url?.split('/').pop());
        const type = url?.split('/').pop()?.split('.').pop();
        const mimeType =
          type === 'pdf'
            ? `${'application'}/${'pdf'}`
            : type === 'jpeg'
            ? `${'application'}/${'pdf'}`
            : '';
        const whatsAppoptions = {
          type: mimeType,
          // message: 'Helloo',
          url: `file://${resultFilePath}`,
          social: Share.Social.WHATSAPP,
        };

        const emailOptions = {
          title: 'Files',
          message: 'Files ',
          email: data?.email,
          social: Share.Social.EMAIL,
          subject: 'Files',
          url: `file://${resultFilePath}`,
        };
        console.log('shareType --------> ', shareType, whatsAppoptions);

        if (shareType == 'mail') {
          Share.shareSingle(emailOptions)
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              err && console.log(err);
            });
        } else await Share.shareSingle(whatsAppoptions);
      } catch (err) {
        console.error('err ===== ', err.message);
        Alert.alert('Warning', err.message || 'No Whatsapp Found');
      }
    };

    return (
      <Menu
        visible={open}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode="elevated"
            onPress={openMenu}
            style={{
              backgroundColor: colorList?.socondary,
            }}
            labelStyle={{color: colorList.white}}>
                                                      <Icons name='share' color={colorList.white} size={20} />

          </Button>
        }>
        {isLoading ? (
          <CustomLoaderRound />
        ) : (
          <>
            <Menu.Item
              onPress={() => handleFileShare(data?.file, 'mail')}
              title="Email"
            />
            <Divider />
            <Menu.Item
              onPress={() => handleFileShare(data?.file, '')}
              title="WhatsApp"
            />
          </>
        )}
      </Menu>
    );
  },
);

ShareModalContents.displayName ="ShareModalContents"
