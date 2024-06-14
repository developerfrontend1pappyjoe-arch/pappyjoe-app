import React, {memo} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {Button, Menu, Divider} from 'react-native-paper';
import ShareEmail from 'react-native-email';
import {ShareModalTypes} from '../../../types/AppoinmentDetails/AddEditLisVitalst';
import {colorList} from '../../../styles/global.styles';
import Icons from 'react-native-vector-icons/MaterialIcons';

export const ShareModal = memo(
  ({
    open,
    data,
    closeMenu,
    openMenu,
    prints = false,
    email = false,
    whatsapp = false,
    message = false,
    mailTitle,
    mailContent = '',
  }: ShareModalTypes) => {
    console.log('mailTitle ====>', mailTitle);

    const handlePrint = () => {
      if (data?.print_url) {
        Linking.openURL(data?.print_url).catch(err => {
          Alert.alert('Error', err.response.data.message);
          console.error('An error occurred', err);
        });
      } else
        Alert.alert('Warning', 'No Print Url Found please try again later');
    };

    const handleSms = () => {
      const body = `Please click on the following link\n${data?.print_url}`;

      Linking.openURL(
        `sms:${data?.mobile}${Platform.OS === 'ios' ? '&' : '?'}body=${body}`,
      )
        .then(res => console.log(res))
        .catch((err: any) => {
          Alert.alert('Warning', 'Sothing Went Wrong');
          console.error(err);
        });
    };

    const handleWhatsapp = () => {
      try {
        if (data?.mobile !== '') {
          Linking.openURL(
            `whatsapp://send?text=Dear ${
              data?.Name
            }\nPlease click on the Following link \n${data?.print_url} &phone=${
              data?.Patient_country_code || '+91'
            }${data?.mobile}`,
          );
        } else {
          Alert.alert('No Number Found');
        }
      } catch (err) {
        console.error('err ===== ', err);
        Alert.alert('No Whatsapp Found');
      }
    };

    const handleEmail = () => {
      const to = [`${data?.email}`];
      ShareEmail(to, {
        subject: mailTitle || 'Treatment Details',
        body: mailContent
          ? `Click the below link to get your ${mailContent}:\n\n${data?.print_url}`
          : `Click the below link to get your Treatment Details:\n\n${data?.print_url}`,
        checkCanOpen: false,
      }).catch(console.error);
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
            }}>
            <Icons name="share" size={20} color={colorList.white} />
          </Button>
        }>
        {prints && (
          <>
            <Menu.Item onPress={handlePrint} title="Print" />
            <Divider />
          </>
        )}
        {message && (
          <>
            <Menu.Item onPress={handleSms} title="Sms" />
            <Divider />
          </>
        )}
        {email && (
          <>
            <Menu.Item onPress={handleEmail} title="Email" />
            <Divider />
          </>
        )}
        {whatsapp && <Menu.Item onPress={handleWhatsapp} title="WhatsApp" />}
      </Menu>
    );
  },
);

ShareModal.displayName = 'ShareModal';
