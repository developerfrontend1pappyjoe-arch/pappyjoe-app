import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: unknown) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log('Data stored successfully!');
    return true;
  } catch (error) {
    console.error('Error storing data:', error);
    return false;
  }
};
export const getStoreData = async (key: string) => {
  try {
    const result = await AsyncStorage.getItem(key);
    if (result) {
      const JsonResult = await JSON.parse(result);
      console.log('Data stored Retrived');
      return JsonResult;
    }
    return null;
  } catch (error) {
    console.error('Error storing data:', error);
    return false;
  }
};
