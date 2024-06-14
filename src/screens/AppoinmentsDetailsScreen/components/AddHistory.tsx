import {useEffect, useState} from 'react';
import {clinicalNotesMaster} from '../services/getClinicalNotesMaster';
import _ from 'lodash';
import {CustomDropdownWithSearch} from 'components/CustomDropdownWithSearch';
import React from 'react';

interface AddHistoryProps {
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
}

export const AddHistory = ({dataList, setDataList}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [complaintsItems, setComplaintsItems] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  useEffect(() => {
    getHistoryMasteApi();
  }, []);

  const handleSearch = (text: string) => {
    getHistoryMasteApi(text);
    setSearchValue(text);
  };

  const getHistoryMasteApi = async (param = '') => {
    setIsLoading(true);
    const res = await clinicalNotesMaster('history', param);
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
    const selectedTemp = [...dataList[type]];
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
      complaints: selectedTemp,
    }));
    handleSearch('');
  };

  const handleRemoveItem = (item: any) => {
    let temp = [...selectedItem[type]];

    if (item && item?.id) {
      temp = temp.filter(selectedItem => selectedItem.id !== item.id);
    } else {
      temp = temp.filter(selectedItem => {
        return (
          selectedItem.label !== item.label || selectedItem.value !== item.value
        );
      });
    }
    setDataList(temp);
  };

  return (
    <CustomDropdownWithSearch
      label="History"
      placeholder="Search..."
      isLoading={isLoading}
      data={complaintsItems}
      textInput={searchValue}
      selectedItems={dataList}
      onChangeTextInput={handleSearch}
      onChangeSelect={AddNewToList}
      OnChangeRemove={handleRemoveItem}
    />
  );
};
