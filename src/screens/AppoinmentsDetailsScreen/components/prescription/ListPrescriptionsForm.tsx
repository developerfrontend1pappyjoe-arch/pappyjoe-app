import {ScrollView, View} from 'react-native';
import {Divider, List, Text} from 'react-native-paper';
import {NoDataAvailable} from '../../../../components/NoDataAvailable';
import {AddPrescriptionForm} from './AddPrescriptionForms';
import {useState} from 'react';
import {colorList} from '../../../../styles/global.styles';

export const ListPrescriptionForms = ({
  dataList,
  mediList,
  errorMessagesList,
  setErrorMessagesList,
  handleInputChangeList,
}: any) => {
  const [expanded, setExpanded] = useState(0);

  const handlePress = index => {
    console.log('index', index === expanded);
    setExpanded(index);
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        {dataList?.length ? (
          dataList?.map((li: any, index: number) => {
            return (
              <>
                <Text
                  variant="titleMedium"
                  style={{
                    marginVertical: 10,
                    color: colorList.primary,
                  }}>{`Prescription ${index + 1}`}</Text>
                <Divider />
                <AddPrescriptionForm
                  data={li}
                  mediList={mediList}
                  errorMessagesList={errorMessagesList[index]}
                  setErrorMessagesList={setErrorMessagesList}
                  indexMessage={index}
                  handleInputChangeList={handleInputChangeList}
                />
              </>
            );
          })
        ) : (
          <View style={{flex: 1}}>
            <NoDataAvailable />
          </View>
        )}
      </ScrollView>
    </View>
  );
};
