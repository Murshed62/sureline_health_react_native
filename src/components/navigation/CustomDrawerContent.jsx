import React, { useState } from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { View } from 'react-native';

const CustomDrawerContent = (props) => {
  const [showRegistrationSubmenu, setShowRegistrationSubmenu] = useState(false);

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      {/* Dropdown Toggle */}
      <DrawerItem
        label="Registration Now ▾"
        onPress={() => setShowRegistrationSubmenu(!showRegistrationSubmenu)}
        labelStyle={{ fontWeight: 'bold', color: 'blue' }}
      />

      {showRegistrationSubmenu && (
        <View style={{ paddingLeft: 20 }}>
          <DrawerItem
            label="👤 Patient Registration"
            onPress={() => props.navigation.navigate('PatientRegistration')}
          />
          <DrawerItem
            label="🩺 Doctor Registration"
            onPress={() => props.navigation.navigate('DoctorRegistration')}
          />
          <DrawerItem
            label="🏥 HealthHub Registration"
            onPress={() => props.navigation.navigate('HealthHubRegistration')}
          />
        </View>
      )}
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
