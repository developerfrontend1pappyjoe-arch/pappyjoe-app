import React from 'react';
import {useEffect, useState} from 'react';
import {clinicalNotesMaster} from '../services/getClinicalNotesMaster';
import _ from 'lodash';
import {CustomDropdownWithSearch} from 'components/CustomDropdownWithSearch';
interface AddComplaintsProps {
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
}

export const AddComplaints = ({dataList, setDataList, type}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [complaintsItems, setComplaintsItems] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    getComplaintMasteApi();
  }, []);

  const handleSearch = (text: string) => {
    getComplaintMasteApi(text);
    setSearchValue(text);
  };

  const getComplaintMasteApi = async (param = '') => {
    setIsLoading(true);
    const typesList =
      type === 'complaints'
        ? 'complaint'
        : type === 'diagnosis'
          ? 'diagnose'
          : type;
    const res = await clinicalNotesMaster(typesList, param);

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
    const selectedTemp = [...dataList[type]];
    if (data && data?.id) {
      const isAlreadyAdded = selectedTemp.some(
        someItem => someItem.id === data.id,
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
      [type]: selectedTemp,
    }));
    handleSearch('');
  };

  const handleRemoveItem = (item: any) => {
    let temp = [...dataList[type]];

    if (item && item?.id) {
      temp = temp.filter(selectedItem => selectedItem.id !== item.id);
    } else {
      temp = temp.filter(selectedItem => {
        return (
          selectedItem.label !== item.label || selectedItem.value !== item.value
        );
      });
    }
    setDataList(prev => ({...prev, [type]: temp}));
  };

  return (
    <CustomDropdownWithSearch
      label="Complaints"
      placeholder="Search..."
      isLoading={isLoading}
      data={complaintsItems}
      textInput={searchValue}
      selectedItems={dataList}
      onChangeTextInput={handleSearch}
      onChangeSelect={AddNewToList}
      OnChangeRemove={handleRemoveItem}
      type={type}
    />
  );
};
