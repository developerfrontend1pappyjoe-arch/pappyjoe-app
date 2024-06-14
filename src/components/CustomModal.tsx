import React, {useState} from 'react';
import {Modal, View, TouchableOpacity, StyleSheet} from 'react-native';
import {Surface, Text} from 'react-native-paper';
import {colorList} from '../styles/global.styles';
interface CustomModalType {
  show: boolean;
  close: () => void;
  title?: string;
  children: React.ReactNode;
}

export const CustomModal = ({
  show,
  close,
  title,
  children,
}: CustomModalType) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={show}
      onRequestClose={close}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {title && title !== '' && (
            <Surface
              style={{
                position: 'absolute',
                top: -20,
                left: 10,
                backgroundColor: colorList.primary,
                padding: 5,
                // borderWidth: 0.2,
                borderRadius: 8,
                paddingHorizontal: 30,
                // width: '95%',
              }}>
              <Text variant="titleMedium" style={{color: colorList.white}}>
                {title}
              </Text>
            </Surface>
          )}
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#f7f7f7',
    padding: 20,
    borderRadius: 10,
    elevation: 5, // Shadow on Android
  },
});
