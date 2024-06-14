import CustomMultiselect from 'components/CustomMultiselect';
import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {clinicalNotesMaster} from 'screens/AppoinmentsDetailsScreen/services/getClinicalNotesMaster';
import _ from 'lodash';
import React from 'react';

export const HistoryLists = ({selectedData, type, handleSetSelected}) => {
  const [data, setDataList] = useState([]);

  useEffect(() => {
    getObservationMasteApi();
  }, []);

  const getObservationMasteApi = async (param = '') => {
    const {data} = await clinicalNotesMaster('history', param);
    if (_.isEqual(data, [[]])) {
      setDataList([]);
    } else setDataList(data);
  };

  const handleSearch = (text: string) => {
    getObservationMasteApi(text);
  };
  return (
    <View style={styles.container}>
      <CustomMultiselect
        options={data}
        label="Detailed Medical History"
        labelKey="notes"
        valueKey="notes"
        selected={selectedData}
        setSelected={handleSetSelected}
        handleSearch={handleSearch}
        type={type}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
