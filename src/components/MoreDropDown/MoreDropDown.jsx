import React, {useState} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {View, Linking} from 'react-native';
import {CommonActions} from '@react-navigation/native';

const MoreDropdown = props => {
  const [showRegistrationSubmenu, setShowRegistrationSubmenu] = useState(false);

  const hiddenScreens = [
    'InstantVideo',
    'HealthHub',
    'MedicineHub',
    'LabTesting',
    'TermsAndCondition',
    'PrivacyPolicy',
    'RefundPolicy',
  ];

  // Filter routes
  const filteredRoutes = props.state.routes.filter(
    route => !hiddenScreens.includes(route.name),
  );

  // Find new index for active route
  let filteredIndex = props.state.index;
  const activeRoute = props.state.routes[props.state.index];

  // If active route is filtered out, default index to 0 or closest valid
  if (!filteredRoutes.find(route => route.key === activeRoute.key)) {
    filteredIndex = 0;
  } else {
    // Otherwise, set filteredIndex to new index of active route
    filteredIndex = filteredRoutes.findIndex(
      route => route.key === activeRoute.key,
    );
  }

  // Prepare new filteredProps with adjusted index and routes
  const filteredProps = {
    ...props,
    state: {
      ...props.state,
      routes: filteredRoutes,
      index: filteredIndex,
    },
  };

  // const openLink = async url => {
  //   const supported = await Linking.canOpenURL(url);
  //   if (supported) await Linking.openURL(url);
  //   else console.warn(`Don't know how to open URI: ${url}`);
  // };

  const openLink = async (url) => {
  try {
    await Linking.openURL(url);
  } catch (err) {
    console.warn('Failed to open URL:', err);
  }
};

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...filteredProps} />

      <DrawerItem
        label={`More.. ${showRegistrationSubmenu ? '▴' : '▾'}`}
        onPress={() => setShowRegistrationSubmenu(!showRegistrationSubmenu)}
        labelStyle={{fontWeight: 'bold', color: 'blue'}}
      />

      {showRegistrationSubmenu && (
        <View style={{paddingLeft: 20}}>
          <DrawerItem
            label="Instant Video Call"
            onPress={() => {
              props.navigation.dispatch(
                CommonActions.navigate({name: 'InstantVideo'}),
              );
              props.navigation.closeDrawer();
            }}
          />
          <DrawerItem
            label="Health Hub"
            onPress={() => {
              props.navigation.dispatch(
                CommonActions.navigate({name: 'HealthHub'}),
              );
              props.navigation.closeDrawer();
            }}
          />
          <DrawerItem
            label="Medicine Hub"
            onPress={() => {
              props.navigation.dispatch(
                CommonActions.navigate({name: 'MedicineHub'}),
              );
              props.navigation.closeDrawer();
            }}
          />
          <DrawerItem
            label="Lab Testing"
            onPress={() => {
              props.navigation.dispatch(
                CommonActions.navigate({name: 'LabTesting'}),
              );
              props.navigation.closeDrawer();
            }}
          />

          {/* External links */}
          <DrawerItem
            label="Terms And Condition"
            onPress={() => openLink('https://surelinehealth.com/termsOrconditions')}
          />
          <DrawerItem
            label="Privacy Policy"
            onPress={() => openLink('https://surelinehealth.com/privacy_policy')}
          />
          {/* <DrawerItem
            label="Refund Policy"
            onPress={() => openLink('https://yourgfgwebsite.com/refund')}
          /> */}
          <DrawerItem
            label="FAQ"
            onPress={() => openLink('https://surelinehealth.com/faq')}
          />
          <DrawerItem
            label="Company Leadership"
            onPress={() => openLink('https://surelinehealth.com/leadershipProfile')}
          />
        </View>
      )}
    </DrawerContentScrollView>
  );
};

export default MoreDropdown;
