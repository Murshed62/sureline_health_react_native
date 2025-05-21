import React, {useEffect, useState} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableScreens} from 'react-native-screens';
import {StoreProvider, useStoreActions, useStoreState} from 'easy-peasy';
import {View, Text, ActivityIndicator, Image, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import store from './src/store';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import ForgotPassword from './src/screens/ForgotPassword';
import OtpVerification from './src/screens/OtpVerification';
import MyProfile from './src/screens/MyProfile';
import Dashboard from './src/screens/Dashboard';
import FindDoctors from './src/screens/FindDoctors';
import BookAppointment from './src/screens/BookAppointment';
import PaymentPage from './src/screens/PaymentPage';
import SuccessFreeAppointment from './src/components/shared/SuccessFreeAppointment/SuccessFreeAppointment';
import DoctorAppointmentTable from './src/components/shared/DoctorAppointmentTable/DoctorAppointmentTable';
import MyAppointments from './src/components/shared/MyAppointments/MyAppointments';

// Icons
import dashboardIcon from './src/assets/dashboard.png';
import searchIcon from './src/assets/bottomSearch.png';
import profileIcon from './src/assets/bottomUser.png';
import DoctorDashboard from './src/components/DoctorComponents/DoctorDashboard/DoctorDashboard';
import DoctorAppointments from './src/components/DoctorComponents/DoctorAppointments/DoctorAppointments';
import MySchedule from './src/components/DoctorComponents/MySchedule/MySchedule';
import RequestedAppointment from './src/components/DoctorComponents/RequestedAppointment/RequestedAppointment';
import DoctorProfile from './src/components/DoctorComponents/DoctorProfile/DoctorProfile';
import ChangePassword from './src/components/shared/ChangePassword/ChangePassword';
import {useNotification} from './src/notification/useNotifications';
import AppointmentDetails from './src/components/shared/AppointmentDetails/AppointDetails';
import {PaperProvider} from 'react-native-paper';
import InstantVideo from './src/components/shared/InstantVideo/InstantVideo';
import MedicineHub from './src/components/shared/MedicineHub/MedicineHub';
import LabTesting from './src/components/shared/LabTesting/LabTesting';
import TermsAndCondition from './src/components/shared/TermsAndCondition/TermsAndCondition';
import PrivacyPolicy from './src/components/shared/PrivacyPolicy/PrivacyPolicy';
import RefundPolicy from './src/components/shared/RefundPolicy/RefundPolicy';
import AboutUs from './src/screens/AboutUs';
import CustomDrawerContent from './src/components/navigation/CustomDrawerContent';
import PatientRegistration from './src/screens/PatientRegistration';
import DoctorRegistration from './src/screens/DoctorRegistration';
import HealthHubRegistration from './src/screens/HealthHubRegistration';
import RegistrationNowDropdown from './src/components/RegistrationNowDropdown/RegistrationNowDropdown';
import MoreDropdown from './src/components/MoreDropDown/MoreDropDown';
import HealthHub from './src/screens/HealthHub';
import {getToken} from './src/utils/index.js';

enableScreens();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// ✅ **Auth Stack**
// const AuthStack = () => (
//   <Stack.Navigator screenOptions={{headerShown: false}}>
//     {/* Add registration screens here */}
//     <Stack.Screen name="PatientRegistration" component={PatientRegistration} />
//     <Stack.Screen name="DoctorRegistration" component={DoctorRegistration} />
//     <Stack.Screen name="HealthHubRegistration" component={HealthHubRegistration} />

//     <Stack.Screen name="Login" component={Login} />
//     <Stack.Screen name="Register" component={Register} />
//     <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
//     <Stack.Screen name="OtpVerification" component={OtpVerification} />
//   </Stack.Navigator>
// );
const PatientRegisterStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    {/* Add registration screens here */}
    <Stack.Screen name="PatientRegistration" component={PatientRegistration} />
    <Stack.Screen name="OtpVerification" component={OtpVerification} />
  </Stack.Navigator>
);
const DoctorRegisterStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    {/* Add registration screens here */}
    <Stack.Screen name="DoctorRegistration" component={DoctorRegistration} />
    <Stack.Screen name="OtpVerification" component={OtpVerification} />
  </Stack.Navigator>
);
const HealthHubRegisterStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    {/* Add registration screens here */}
    <Stack.Screen
      name="HealthHubRegistration"
      component={HealthHubRegistration}
    />
    <Stack.Screen name="OtpVerification" component={OtpVerification} />
  </Stack.Navigator>
);
const LoginStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
  </Stack.Navigator>
);

// ✅ **Dashboard Stack for Patients**
const DashboardStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Home" component={Dashboard} />
    <Stack.Screen name="MyProfile" component={MyProfile} />
    <Stack.Screen name="MyAppointments" component={MyAppointments} />
    <Stack.Screen name="InstantVideo" component={InstantVideo} />
    <Stack.Screen name="AppointmentDetails" component={AppointmentDetails} />
    <Stack.Screen name="FindDoctors" component={FindDoctors} />
    <Stack.Screen name="BookAppointment" component={BookAppointment} />
    <Stack.Screen name="PaymentPage" component={PaymentPage} />
    <Stack.Screen
      name="SuccessFreeAppointment"
      component={SuccessFreeAppointment}
    />
  </Stack.Navigator>
);

// ✅ **Bottom Tab Navigator for Patients**
const TabNavigator = () => (
  <Tab.Navigator screenOptions={{headerShown: false}}>
    {/* Home  */}
    <Tab.Screen
      name="Home"
      component={DashboardStack}
      options={{tabBarIcon: () => <Image source={dashboardIcon} />}}
    />
    <Tab.Screen
      name="Find Doctors"
      component={FindDoctors}
      options={{tabBarIcon: () => <Image source={searchIcon} />}}
    />
    <Tab.Screen
      name="My Profile"
      component={MyProfile}
      options={{tabBarIcon: () => <Image source={profileIcon} />}}
    />
  </Tab.Navigator>
);

// ✅ **Doctor Stack for Doctor Role**

// ✅ **Logout Screen**
const LogoutScreen = () => {
  const navigation = useNavigation();
  const logoutUser = useStoreActions(actions => actions.user.logoutUser);

  useEffect(() => {
    const logout = async () => {
      await logoutUser(); // Clear user/token from state
      ToastAndroid.show('Logout Successfully', ToastAndroid.SHORT);

      // ✅ Force reset navigation state and go to TabNavigator
      navigation.reset({
        index: 0,
        routes: [{name: 'TabNavigator'}],
      });
    };
    logout();
  }, [logoutUser, navigation]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#1976d2" />
      <Text>Logging out...</Text>
    </View>
  );
};

// ✅ **Drawer Navigator with Role-Based Screens**
// Define this function outside of DrawerNavigator
// const renderCustomDrawerContent = props => <CustomDrawerContent {...props} />;

const DrawerNavigator = () => {
  const {user} = useStoreState(state => state.user);

  return (
    <Drawer.Navigator
      initialRouteName={'TabNavigator'}
      screenOptions={{headerShown: false}}
      drawerContent={props => <MoreDropdown {...props} />} // ✅ use your dropdown
    >
      <Drawer.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{title: 'Home'}}
      />
      {/* <Drawer.Screen
        name="PatientRegistration"
        component={PatientRegistration}
        options={{title: 'Patient Registration'}}
      />
      <Drawer.Screen
        name="DoctorRegistration"
        component={DoctorRegistration}
        options={{title: 'Doctor Registration'}}
      />
      <Drawer.Screen
        name="HealthHubRegistration"
        component={HealthHubRegistration}
        options={{title: 'HealthHub Registration'}}
      /> */}
      {/* <Drawer.Screen
          name="Auth"
          component={AuthStack}
          options={{title: 'Login'}}
        /> */}
      <Drawer.Screen
        name="PatientRegisterStack"
        component={PatientRegisterStack}
        options={{title: 'Patient Registration'}}
      />
      <Drawer.Screen
        name="DoctorRegisterStack"
        component={DoctorRegisterStack}
        options={{title: 'Doctor Registration'}}
      />
      <Drawer.Screen
        name="HealthHubRegisterStack"
        component={HealthHubRegisterStack}
        options={{title: 'HealthHub Registration'}}
      />

      <Drawer.Screen
        name="InstantVideo"
        component={InstantVideo}
        options={{title: 'Instant Video Call'}}
      />
      <Drawer.Screen
        name="HealthHub"
        component={HealthHub}
        options={{title: 'Health Hub'}}
      />
      <Drawer.Screen
        name="MedicineHub"
        component={MedicineHub}
        options={{title: 'Medicine Hub'}}
      />
      <Drawer.Screen
        name="LabTesting"
        component={LabTesting}
        options={{title: 'Lab Testing'}}
      />
      <Drawer.Screen
        name="TermsAndCondition"
        component={TermsAndCondition}
        options={{title: 'Terms And Condition'}}
      />
      <Drawer.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{title: 'Privacy Policy'}}
      />
      <Drawer.Screen
        name="RefundPolicy"
        component={RefundPolicy}
        options={{title: 'Refund Policy'}}
      />
      {user ? (
        <Drawer.Screen
          name="Logout"
          component={LogoutScreen}
          options={{title: 'Logout'}}
        />
      ) : (
        <Drawer.Screen
          name="LoginStack"
          component={LoginStack}
          options={{title: 'Login'}}
        />
      )}

      {/* Registration Screens - Required for navigation */}
    </Drawer.Navigator>
  );
};

// ✅ **Main App Component**
const App = () => {
  useNotification();
  return (
    <PaperProvider>
      <NavigationContainer>
        <StoreProvider store={store}>
          <DrawerNavigator />
        </StoreProvider>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
