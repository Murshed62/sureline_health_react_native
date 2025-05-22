import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {format, isAfter, isBefore, isToday, parseISO} from 'date-fns';
import VideoChatIcon from 'react-native-vector-icons/MaterialIcons'; // or any icon lib you prefer
import VideocamOffIcon from 'react-native-vector-icons/MaterialIcons';
import {useStoreActions, useStoreState} from 'easy-peasy';

// Dummy icons (replace with your own icons or vector icons)
const VideoIcon = ({enabled}) =>
  enabled ? (
    <VideoChatIcon name="video-call" size={24} color="blue" />
  ) : (
    <VideocamOffIcon name="videocam-off" size={24} color="gray" />
  );

// Table headers
const columns = [
  'No',
  'Doctor Name',
  'Created',
  'Schedule Start',
  'Status',
  'Action',
];

const getColor = item => {
  const today = isToday(parseISO(item?.date));
  const upcomming = !today && isAfter(parseISO(item?.date), new Date());
  const over = !today && isBefore(parseISO(item?.date), new Date());

  if (item?.status === 'completed') return 'green';
  if (item?.status === 'confirmed') {
    if (upcomming) return 'blue';
    if (today) return 'darkblue';
    if (over) return 'orange';
  }
  if (item?.status === 'cancelled') return 'red';
  if (item?.status === 'panding') return 'purple';
  return 'black';
};

const TableRowAction = ({item}) => {
  const today = isToday(parseISO(item?.date));
  const upcomming = !today && isAfter(parseISO(item?.date), new Date());

  const handleVideoPress = () => {
    if (item.googleMeetLink) {
      Linking.openURL(item.googleMeetLink);
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        disabled={
          item?.status === 'panding' ||
          item?.status === 'cancelled' ||
          upcomming
        }
        style={{
          backgroundColor: item?.status === 'panding' ? '#d32f2f' : '#1976d2',
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 4,
        }}
        // onPress={() => alert('Open Prescription details (implement modal)')}
      >
        <Text style={{color: 'white', fontWeight: 'bold'}}>Prescription</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleVideoPress}
        disabled={
          !today ||
          item?.status === 'completed' ||
          item?.status === 'cancelled' ||
          item?.status === 'panding'
        }
        style={{marginLeft: 10}}>
        <VideoIcon
          enabled={
            today &&
            item?.status !== 'completed' &&
            item?.status !== 'cancelled' &&
            item?.status !== 'panding'
          }
        />
      </TouchableOpacity>
    </View>
  );
};

const AppointmentTableRow = ({item, index}) => {
  if (!item) return null;

  const today = isToday(parseISO(item?.date));
  const upcomming = !today && isAfter(parseISO(item?.date), new Date());
  const over = !today && isBefore(parseISO(item?.date), new Date());

  const statusColor = getColor(item);

  const statusText = (() => {
    if (item?.status === 'confirmed' && upcomming) return 'upcomming';
    if (item?.status === 'confirmed' && today) return 'today';
    if (item?.status === 'confirmed' && over) return 'time up!';
    if (item?.status === 'completed') return 'completed';
    if (item?.status === 'cancelled') return 'cancelled';
    if (item?.status === 'panding') return 'panding';
    return '';
  })();

  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 8,
        paddingHorizontal: 5,
        alignItems: 'center',
      }}>
      <Text style={{flex: 0.5}}>{index + 1}</Text>
      <Text style={{flex: 2}}>
        {item?.doctor?.firstName || 'N/A'} {item?.doctor?.lastName || ''}
      </Text>
      <Text style={{flex: 2}}>
        {format(new Date(item?.createdAt), 'M/d/yyyy')}
      </Text>
      <Text style={{flex: 2}}>
        {format(new Date(item?.date), 'M/d/yyyy')} {item?.time}
      </Text>
      <Text style={{flex: 1.5, color: statusColor, fontWeight: 'bold'}}>
        {statusText}
      </Text>
      <View style={{flex: 2}}>
        <TableRowAction item={item} />
      </View>
    </View>
  );
};

const AppointmentTableBody = ({filterValue}) => {
  const {user, token} = useStoreState(state => state.user);
  const userID = user?._id;
  const {getPatient} = useStoreActions(actions => actions.patient);
  const {patient, updatedData} = useStoreState(state => state.patient);

  useEffect(()=>{
      getPatient({id:userID,token});
    },[getPatient,userID,token]);

  if (!patient?.appointments || patient.appointments.length === 0) {
    return (
      <View style={{padding: 20, alignItems: 'center'}}>
        <Text>No Data!</Text>
      </View>
    );
  }

  const appointments = patient?.appointments || [];
  const filterAppointment = [...appointments].filter((item) => item.status === filterValue);

  if (filterAppointment.length === 0) {
    return (
      <View style={{padding: 20, alignItems: 'center'}}>
        <Text style={{color: 'gray'}}>No Data</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filterAppointment}
      keyExtractor={item => item._id}
      renderItem={({item, index}) => (
        <AppointmentTableRow item={item} index={index} />
      )}
    />
  );
};

export default function AppointmentTablePatient({filterValue}) {
  return (
    <View style={{flex: 1, paddingHorizontal: 10, backgroundColor: 'white'}}>
      {/* Header */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{marginBottom: 10}}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#f0f0f0',
          }}>
          {columns.map(col => (
            <Text
              key={col}
              style={{
                flex: col === 'No' ? 0.5 : col === 'Status' ? 1.5 : 2,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginRight: 10,
              }}>
              {col}
            </Text>
          ))}
        </View>
      </ScrollView>

      {/* Table Body */}
      <AppointmentTableBody filterValue={filterValue} />
    </View>
  );
}
