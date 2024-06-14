import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colorList} from '../styles/global.styles';

interface CustomeHeaderType {
  headerText: string;
  rightIcon?: any | null | undefined;
  rightText?: any | null | undefined;
  rightIconAction?: () => void | null | undefined;
  leftIcon?: any | null;
  leftIconAction?: () => void | undefined;
  rightTextAction?: () => void | undefined;
}

export const CustomHeader = ({
  headerText,
  rightIcon,
  rightText,
  leftIcon,
  rightIconAction,
  rightTextAction,
  leftIconAction,
}: CustomeHeaderType) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.iconTextContainer}>
        {leftIcon && (
          <TouchableOpacity onPress={() => leftIconAction && leftIconAction()}>
            <Image
              source={leftIcon}
              style={[styles.imagesStyle, {marginRight: 12}]}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.headerText}>{headerText}</Text>
      </View>
      {rightIcon && (
        <TouchableOpacity onPress={() => rightIconAction && rightIconAction()}>
          <Image source={rightIcon} style={styles.imagesStyle} />
        </TouchableOpacity>
      )}
      {rightText && (
        <TouchableOpacity onPress={() => rightTextAction && rightTextAction()}>
          <Text style={styles.rightText}>{rightText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colorList.primary,
    paddingHorizontal: 16,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 20,
    color: colorList.white,
  },
  rightText: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 20,
    color: colorList.white,
  },
  imagesStyle: {
    width: 30,
    height: 30,
    padding: 15,
  },
});
