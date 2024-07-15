import React, { useState, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Chip, Divider, List, Text, TextInput } from "react-native-paper";
import { colorList } from "styles/global.styles";

type SelectorType = {
  readonly options: any[];
  readonly labelKey: string;
  readonly valueKey: string;
  readonly label: string;
  readonly defaultValue?: string;
  readonly handleSearch?: (value: string) => void;
  readonly loading?: boolean;
  readonly selected: any[];
  readonly setSelected: (value: string) => void;
  type: string;
};
function CustomMultiselect({
  options,
  labelKey,
  valueKey,
  label,
  defaultValue,
  handleSearch,
  selected,
  setSelected,
  loading,
  type,
}: SelectorType) {
  const [isFocus, setIsFocus] = useState(false);
  const displayText = defaultValue != "" ? defaultValue : label;
  const [text, setText] = useState("");

  // console.log('selected ====> @@@@ ', selected);

  const onSearch = (value: string) => {
    setText(value);
    if (handleSearch) {
      handleSearch(value);
    }
  };

  const onChange = (item: any) => {
    setSelected(type, [...selected, item]);
    setIsFocus(false);
  };

  const onClose = (index: number) => {
    const updated = selected.filter((fl, i) => i != index);
    setSelected(type, updated);
  };

  const allOptions = useMemo(() => {
    if (options.length == 0) {
      return text == "" ? [] : [{ [labelKey]: text, [valueKey]: text }];
    } else {
      return options;
    }
  }, [options, text]);

  const renderDropdownList = (item: any, selected?: boolean) => {
    return (
      <>
        <List.Item
          title={item[labelKey]}
          style={(selected && text != "") ? {backgroundColor:colorList.Green} : null}
          // description="Item description"
          right={(props) => (
            <List.Icon {...props} color={colorList.socondary} icon="plus" />
          )}
        />
        <Divider />
      </>
    );
  };

const handleClear = ()=>{
  setText("")
  if (handleSearch) {
    handleSearch("");
  }
}

  return (
    <View style={styles.wrapper}>
      <Text variant="titleMedium" style={styles.labelHead}>
        {label}
      </Text>
      <Divider style={{ marginVertical: 5 }} />
      {selected?.length > 0 && (
        <View style={styles.chipContainer}>
          {selected.map((item: any, index: number) => (
            <Chip onClose={() => onClose(index)} key={index}>
              {item[labelKey]}
            </Chip>
          ))}
        </View>
      )}

      <Dropdown
        containerStyle={styles.containerStyle}
        activeColor={"white"}
        style={[styles.dropdown, isFocus && { borderColor: "#1680C0" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={allOptions || []}
        search={true}
        // onChangeText={onSearch}
        maxHeight={300}
        labelField={labelKey}
        valueField={valueKey}
        placeholder={!isFocus ? displayText : loading ? "searching...." : "..."}
        searchPlaceholder="Search..."
        value={displayText || text}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={onChange}
        renderItem={renderDropdownList}
        renderInputSearch={() => (
          <TextInput
            style={{ height: 45,marginBottom:5}}
            label="Search"
            mode="outlined"
            value={text}
            onChangeText={onSearch}
            left={<TextInput.Icon style={{marginTop:10}} size={25} icon={"magnify"}/>}
            right={<TextInput.Icon style={{marginTop:13}} onPress={handleClear} icon="close" />}
          />
        )}
      />
    </View>
  );
}

export default CustomMultiselect;
const styles = StyleSheet.create({
  wrapper: {
    // borderWidth: 0.8,
    // borderColor: 'grey',
    borderRadius: 5,
    minHeight: 50,
    marginVertical: 5,
  },
  chipContainer: {
    marginVertical: 10,
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    flexDirection: "row",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
  },
  containerStyle: {
    backgroundColor: colorList.white,
    marginTop:6,
    borderRadius:8,
    padding:5
  },
  dropdown: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    // paddingVertical: 1,
    width: "100%",
    flex: 1,
    height:45
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 8,
  },

  labelHead: {
    marginBottom: 0,
  },
});
