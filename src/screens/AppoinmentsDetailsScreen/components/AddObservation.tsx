import {useEffect, useState} from 'react';
import {clinicalNotesMaster} from '../services/getClinicalNotesMaster';
import _ from 'lodash';
import {CustomDropdownWithSearch} from 'components/CustomDropdownWithSearch';
import React from 'react';

export const AddObservation = ({dataList, setDataList}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [complaintsItems, setComplaintsItems] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedItem, setSelectedItem] = useState([]);
  useEffect(() => {
    getObservationMasteApi();
  }, []);

  const handleSearch = (text: string) => {
    getObservationMasteApi(text);
    setSearchValue(text);
  };

  const getObservationMasteApi = async (param = '') => {
    setIsLoading(true);
    const res = await clinicalNotesMaster('observation', param);
    if (res) {
      setIsLoading(false);
      const tempStatus = _.isEqual(res?.data, [[]]);
      let tempData = [];
      let temp = [];
      if (!tempStatus) {
        temp = res?.data?.map(li => ({
          ...li,
          label: li?.notes,
          value: li?.notes,
        }));
        tempData = temp;
      }
      setComplaintsItems(tempData);
    }
  };
  const AddNewToList = (data: unknown) => {
    console.log('Add Item', searchValue, data);
    const selectedTemp = [...selectedItem];
    if (data && data?.id) {
      const isAlreadyAdded = selectedTemp.some(
        selectedItem => selectedItem.id === data.id,
      );
      if (!isAlreadyAdded) {
        selectedTemp.push(data);
      }
    } else {
      if (searchValue?.id) {
        const isAlreadyAdded = selectedTemp.some(
          item => item.id === searchValue.id,
        );
        if (!isAlreadyAdded) {
          selectedTemp.push(searchValue);
        }
      } else {
        const isAlreadyAdded = selectedTemp.some(
          item =>
            item.label === searchValue.label &&
            item.value === searchValue.value,
        );
        if (!isAlreadyAdded) {
          selectedTemp.push({label: searchValue, value: searchValue});
        }
      }
    }
    setDataList(prev => ({
      ...prev,
      complaints: [...prev.complaints, ...selectedTemp],
    }));

    setSelectedItem(selectedTemp);
    handleSearch('');
  };

  const handleRemoveItem = (item: any) => {
    let temp = [...selectedItem];

    if (item && item?.id) {
      temp = temp.filter(selectedItem => selectedItem.id !== item.id);
    } else {
      temp = temp.filter(selectedItem => {
        return (
          selectedItem.label !== item.label || selectedItem.value !== item.value
        );
      });
    }
    setSelectedItem(temp);
  };

  return (
    <CustomDropdownWithSearch
      label="Observation"
      placeholder="Search..."
      isLoading={isLoading}
      data={complaintsItems}
      textInput={searchValue}
      selectedItems={selectedItem}
      onChangeTextInput={handleSearch}
      onChangeSelect={AddNewToList}
      OnChangeRemove={handleRemoveItem}
    />
  );
};
