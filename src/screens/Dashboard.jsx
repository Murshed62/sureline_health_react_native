import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Text,
  StatusBar,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SearchDoctor from '../components/shared/SearchDoctor/SearchDoctor';
import userIcon from '../assets/user.png';
import ImageCarousel from '../components/shared/ImageCarousel/ImageCarousel';
import Services from '../components/shared/Services/Services';
import HealthConcerns from '../components/shared/HealthConcerns/HealthConcerns';
import HealthSpecialties from '../components/shared/HealthSpecialties/HealthSpecialties';
import HomeBlogs from '../components/shared/HomeBlogs/HomeBlogs';
import {useStoreActions, useStoreState} from 'easy-peasy';
import AddBanner from '../components/shared/AddBannner/AddBanner';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Dashboard = () => {
  const {user} = useStoreState(state => state.user); // Retrieve the user
  const {profileImage} = useStoreState(state => state.profileImage); // Access profile image from Easy Peasy store
  const navigation = useNavigation();
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const {getPatient} = useStoreActions(action => action.patient);
        const { patient, updatedData,patientImageData } = useStoreState((state) => state.patient);
  const userID = user?._id;
  useEffect(() => {
    getPatient(userID);
  }, [userID, getPatient,patientImageData]);
  console.log('patient',patient );
  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: ['transparent', 'lightblue'],
    extrapolate: 'clamp',
  });

  const headerPaddingBottom = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 10],
    extrapolate: 'clamp',
  });

  const renderContent = () => (
    <>
      <ImageCarousel />
      <Services />
      <HealthConcerns />
      <HealthSpecialties />
      <AddBanner />
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* 🔹 Sticky Header */}
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: headerBackgroundColor,
            paddingBottom: headerPaddingBottom,
            paddingTop: StatusBar.currentHeight,
          },
        ]}>
        {/* User Icon */}

        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center',gap: 30}}>
          <View style={styles.iconContainer}>
            <Image
              source={userIcon}
              style={styles.userIcon}
            />
          </View>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingHi}>Hi,</Text>
            <Text style={styles.greetingName}>Shahadat Hossen</Text>
        </View>
        </View>
        {/* Menu Icon */}

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.getParent()?.toggleDrawer()}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* 🔹 Optimized FlatList for Scrolling */}
      <Animated.FlatList
        data={[{key: 'content'}]} // FlatList requires data, using a dummy item
        renderItem={renderContent}
        keyExtractor={item => item.key}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        ListHeaderComponent={<View style={{height: 60}} />} // Maintain spacing from header
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 100,
  },
  iconContainer: {
    width: 50,
    alignItems: 'center',
  },
  userIcon: {
    width: 55,
    height: 55,
    marginLeft: 40,
    borderRadius: 50,
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: -20,
  },
  menuIcon: {
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  iconWrapper: {
  alignItems: 'center',
  marginLeft: 20,
},
greetingText: {
  color: '#000',
  fontSize: 14,
  fontWeight: '500',
  marginTop: 5,
},
greetingContainer: {
  marginLeft: 10,
  justifyContent: 'center',
},
greetingHi: {
  fontSize: 16,
  color: '#333',
  fontWeight: '400',
},
greetingName: {
  fontSize: 18,
  color: '#000',
  fontWeight: '700',
  marginTop: -2,
},
notificationIconWrapper: {
  padding: 10,
  marginRight: 15,
  // backgroundColor: 'red',
  borderRadius: 20,
},
});

export default Dashboard;
