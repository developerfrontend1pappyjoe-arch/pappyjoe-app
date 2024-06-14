import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Button, Chip, Text, TextInput} from 'react-native-paper';
import {clinicalNotesMaster} from 'screens/AppoinmentsDetailsScreen/services/getClinicalNotesMaster';
import _ from 'lodash';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {AddComplaints} from '../../AddComplains';
import {colorList} from 'styles/global.styles';
import Icons from 'react-native-vector-icons/AntDesign';

export const AddComplaintsDropdown = ({
  selectedData,
  setSelectedData,
  type,
}: any) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['75%', '100%'], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handlePresentModalClose = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <View style={styles.container}>
      <Button
        mode="outlined"
        onPress={handlePresentModalPress}
        style={{
          borderRadius: 8,
          marginVertical: 5,
        }}>
        {`Add ${type}`}
      </Button>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        containerStyle={{
          position: 'relative',
        }}>
        <Button
          onPress={() => handlePresentModalClose()}
          style={styles.closeButton}>
          <Icons name="close" size={20} />
        </Button>
        <View style={styles.wrapper}>
          <BottomSheetView style={styles.contentContainer}>
            <AddComplaints
              dataList={selectedData}
              setDataList={setSelectedData}
              type={type}
            />
          </BottomSheetView>
        </View>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  wrapper: {backgroundColor: colorList.white, flex: 1},
  closeButton: {},
});
