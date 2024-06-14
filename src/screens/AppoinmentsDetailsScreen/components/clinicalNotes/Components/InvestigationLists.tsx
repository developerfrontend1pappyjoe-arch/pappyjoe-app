import CustomMultiselect from 'components/CustomMultiselect';
import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {clinicalNotesMaster} from 'screens/AppoinmentsDetailsScreen/services/getClinicalNotesMaster';
import _ from 'lodash';
import React from 'react';

export const InvestigationLists = ({selectedData, type, handleSetSelected}) => {
  const [data, setDataList] = useState([]);

  useEffect(() => {
    getInvestigationMasteApi();
  }, []);

  const getInvestigationMasteApi = async (param = '') => {
    const {data} = await clinicalNotesMaster('investigation', param);
    if (_.isEqual(data, [[]])) {
      setDataList([]);
    } else setDataList(data);
  };

  const handleSearch = (text: string) => {
    getInvestigationMasteApi(text);
  };

  return (
    <View style={styles.container}>
      <CustomMultiselect
        options={data}
        label="Investigations"
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
