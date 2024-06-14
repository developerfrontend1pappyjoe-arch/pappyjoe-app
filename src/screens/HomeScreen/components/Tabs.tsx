import {Text} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {TodaysAppoinments} from '../../AppoinmentsScreen/TodaysAppoinments';

import {View, useWindowDimensions} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import {UpcommingAppoinments} from '../../AppoinmentsScreen/UpcommingAppoinments';

const renderScene = SceneMap({
  Today: TodaysAppoinments,
  Upcomming: UpcommingAppoinments,
});

export const Tabs = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'Today', title: 'Todays'},
    {key: 'Upcomming', title: 'Upcomming'},
  ]);

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
    />
  );
};
