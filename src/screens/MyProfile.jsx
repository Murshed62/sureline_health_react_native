import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useStoreActions, useStoreState} from 'easy-peasy';
import ProfileAvatorCard from '../components/shared/ProfileAvatorCard/ProfileAvatorCard';
import EditPatientProfile from '../components/shared/EditPatientProfile/EditPatientProfile';
import ChangePassword from '../components/shared/ChangePassword/ChangePassword';
import OpenModal from '../modal/OpenModal';
import {useNavigation} from '@react-navigation/native';

const ProfileDetails = ({patient}) => {
  console.log('patient variable', patient);
  const {user} = useStoreState(state => state.user);

  if (!patient) {
    return null;
  }
  return (
    <View style={{padding: 16, backgroundColor: '#fff', borderRadius: 8}}>
  <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#1976d2'}}>
    Profile Details:
  </Text>

  {/* First Name & Last Name */}
  <View style={{flexDirection: 'row', marginBottom: 12}}>
    <View style={{flex: 1, marginRight: 8}}>
      <Text style={{fontSize: 14, color: '#555'}}>First Name</Text>
      <Text style={{fontSize: 16, fontWeight: '500', color: '#222'}}>
        {patient?.profile?.firstName || user?.username}
      </Text>
    </View>
    <View style={{flex: 1}}>
      <Text style={{fontSize: 14, color: '#555'}}>Last Name</Text>
      <Text style={{fontSize: 16, fontWeight: '500', color: '#222'}}>
        {patient?.profile?.lastName || ''}
      </Text>
    </View>
  </View>

  {/* Phone & Address */}
  <View style={{flexDirection: 'row', marginBottom: 12}}>
    <View style={{flex: 1, marginRight: 8}}>
      <Text style={{fontSize: 14, color: '#555'}}>Phone</Text>
      <Text style={{fontSize: 16, fontWeight: '500', color: '#222'}}>
        {patient?.profile?.phone || ''}
      </Text>
    </View>
    <View style={{flex: 1}}>
      <Text style={{fontSize: 14, color: '#555'}}>Address</Text>
      <Text style={{fontSize: 16, fontWeight: '500', color: '#222'}}>
        {patient?.profile?.address || ''}
      </Text>
    </View>
  </View>

  {/* Gender & Blood */}
  <View style={{flexDirection: 'row', marginBottom: 12}}>
    <View style={{flex: 1, marginRight: 8}}>
      <Text style={{fontSize: 14, color: '#555'}}>Gender</Text>
      <Text style={{fontSize: 16, fontWeight: '500', color: '#222'}}>
        {patient?.profile?.gender || ''}
      </Text>
    </View>
    <View style={{flex: 1}}>
      <Text style={{fontSize: 14, color: '#555'}}>Blood</Text>
      <Text style={{fontSize: 16, fontWeight: '500', color: '#222'}}>
        {patient?.profile?.blood || ''}
      </Text>
    </View>
  </View>

  {/* Age & Height */}
  <View style={{flexDirection: 'row', marginBottom: 12}}>
    <View style={{flex: 1, marginRight: 8}}>
      <Text style={{fontSize: 14, color: '#555'}}>Age</Text>
      <Text style={{fontSize: 16, fontWeight: '500', color: '#222'}}>
        {patient?.profile?.age || ''}
      </Text>
    </View>
    <View style={{flex: 1}}>
      <Text style={{fontSize: 14, color: '#555'}}>Height</Text>
      <Text style={{fontSize: 16, fontWeight: '500', color: '#222'}}>
        {patient?.profile?.height || ''}
      </Text>
    </View>
  </View>

  {/* Weight (alone if odd number of items) */}
  <View style={{flexDirection: 'row'}}>
    <View style={{flex: 1}}>
      <Text style={{fontSize: 14, color: '#555'}}>Weight</Text>
      <Text style={{fontSize: 16, fontWeight: '500', color: '#222'}}>
        {patient?.profile?.weight || 'N/A'}
      </Text>
    </View>
  </View>
</View>

  );
};

const MyProfile = () => {
  const navigation = useNavigation();
  const {getPatient} = useStoreActions(action => action.patient);
  const {patient, updatedData, patientImageData} = useStoreState(
    state => state.patient,
  );
  const {user, token} = useStoreState(state => state.user);

  const [open, setOpen] = useState(false);
  const [openCP, setOpenCP] = useState(false);

  const userID = user?._id;
  const userEmail = user?.email;
  console.log(user, token);

  useEffect(() => {
    getPatient({id: userID, token});
  }, [user, getPatient, updatedData, patientImageData, userID, token]);

  console.log(patient);
  const handleAppointment = () => {
    navigation.navigate('Home', { screen: 'MyAppointments' });
  };

  if (!user && !patient) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
  <ScrollView
  contentContainerStyle={{
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  }}>
  <View style={{flex: 1}}>

    {/* Avatar Card */}
    <View style={{marginBottom: 24, alignItems: 'center'}}>
      <ProfileAvatorCard item={patient} />
    </View>

    {/* Profile Details Card with Edit Button Inside */}
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 30,
      }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: '#1F2937',
          marginBottom: 16,
          textAlign: 'center',
        }}>
        Profile Details
      </Text>

      <ProfileDetails patient={patient} />

      {/* Edit Button Inside Card */}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          marginTop: 20,
          backgroundColor: '#4F46E5',
          paddingVertical: 12,
          borderRadius: 25,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 5,
        }}>
        <Text style={{color: '#fff', fontSize: 16, fontWeight: '600'}}>
          Edit Profile
        </Text>
      </TouchableOpacity>
    </View>

    {/* Modal */}
    <OpenModal open={open} handleClose={() => setOpen(false)}>
      <EditPatientProfile handleClose={() => setOpen(false)} userID={userID} />
    </OpenModal>

    {/* Bottom Buttons: Appointment & Invoice */}
    <View style={{width: '100%', alignItems: 'center'}}>
      {[
        {
          text: 'Appointments',
          onPress: handleAppointment,
          color: '#059669',
        },
        {
          text: 'Invoice',
          onPress: () => setOpenCP(true),
          color: '#DC2626',
        },
      ].map((button, index) => (
        <TouchableOpacity
          key={index}
          onPress={button.onPress}
          style={{
            backgroundColor: button.color,
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 30,
            marginBottom: 12,
            width: '90%',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.15,
            shadowRadius: 3,
            elevation: 4,
          }}>
          <Text style={{color: '#fff', fontSize: 16, fontWeight: '600'}}>
            {button.text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
</ScrollView>


  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarContainer: {
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#64dd17',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#f50057',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileDetailsContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  AppointmentButton: {
    backgroundColor: '#008000',
    marginTop: 20,
  },
  InvoiceButton: {
    backgroundColor: '#FF8C00',
  },
});

export default MyProfile;
