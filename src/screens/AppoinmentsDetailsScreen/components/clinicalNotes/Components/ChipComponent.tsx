import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Chip, Divider, Text} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialIcons';

interface ChipComponentProps {
  dataList: [];
  type: string;
  handleRemoveItem: (data: unknown) => void;
}

export const ChipComponent = ({
  dataList,
  type,
  handleRemoveItem,
}: ChipComponentProps) => {
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
        {dataList[type]?.length
          ? dataList[type]?.map((it, index) => {
              return (
                <Chip
                  key={index}
                  mode="outlined"
                  onClose={() => handleRemoveItem(it)}
                  closeIcon={() => <Icons name="close" size={15} />}
                  style={{margin: 2, padding: 0, maxWidth: '100%'}}
                  textStyle={{fontSize: 10, marginLeft: 10}}>
                  {it?.label}
                </Chip>
              );
            })
          : null}
      </View>
      {dataList[type]?.length ? <Divider style={styles.divider} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    marginVertical: 10,
  },
});
