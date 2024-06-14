import CustomMultiselect from 'components/CustomMultiselect';
import {useEffect, useState} from 'react';
import {KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {clinicalNotesMaster} from 'screens/AppoinmentsDetailsScreen/services/getClinicalNotesMaster';
import _ from 'lodash';
import React from 'react';

export const ComplaintLists = ({
  selectedData,
  type,
  handleSetSelected,
}: any) => {
  const [data, setDataList] = useState([]);

  useEffect(() => {
    getComplaintMasteApi();
  }, []);

  const getComplaintMasteApi = async (param = '') => {
    const {data} = await clinicalNotesMaster('complaint', param);
    if (_.isEqual(data, [[]])) {
      setDataList([]);
    } else setDataList(data);
  };

  const handleSearch = (text: string) => getComplaintMasteApi(text);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <CustomMultiselect
          type={type}
          options={data}
          label="Chief Complaints"
          labelKey="notes"
          valueKey="notes"
          selected={selectedData}
          setSelected={handleSetSelected}
          handleSearch={handleSearch}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
