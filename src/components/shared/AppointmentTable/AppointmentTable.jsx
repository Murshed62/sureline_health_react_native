import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Modal,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {format, isAfter, isBefore, isToday, parseISO} from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppointmentDetails from '../AppointmentDetails/AppointDetails';
import {DataTable} from 'react-native-paper';
import videoOn from '../../../assets/video-camera.png';
import videoOff from '../../../assets/video-camera-off.png';
import {useNavigation} from '@react-navigation/native';

const TableRowAction = ({item}) => {
  const navigation = useNavigation();
  const {user} = useStoreState(state => state.user);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleClickOpen = item => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  // const handleClickOpen = item => {
  //   setSelectedItem(item);
  //   // setOpen(true);
  //   navigation.navigate('AppointmentDetails', { selectedItem: selectedItem });
  // };

  // const handleClose = () => {
  //   setOpen(false);
  //   setSelectedItem(null);
  // };

  if (!item) return null;

  const today = isToday(parseISO(item?.date), new Date());
  const upcomming = !today && isAfter(parseISO(item?.date), new Date());

  return (
    <View style={styles.actionRow}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('AppointmentDetails', {appointment: item})
        }
        disabled={
          (item?.status === 'panding') || item?.status === 'cancelled' || upcomming
        }
        style={[
          styles.button,
          {backgroundColor: item?.status === 'panding' ? '#d32f2f' : '#1976d2'},
        ]}>
        <Text style={styles.buttonText}>Prescription</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        onPress={() => handleClickOpen(item)}
        disabled={
          item?.status === 'panding' || item?.status === 'cancelled' || upcoming
        }
        style={[
          styles.button,
          {backgroundColor: item?.status === 'panding' ? '#d32f2f' : '#1976d2'},
        ]}>
        <Text style={styles.buttonText}>Prescription</Text>
      </TouchableOpacity> */}

      {(today && item?.status !== 'completed' && item?.status !== 'cancelled' && item?.status !== 'panding')
? (
        <TouchableOpacity onPress={() => Linking.openURL(item.googleMeetLink)}>
          <Image source={videoOn} style={{marginLeft: 4}} />
        </TouchableOpacity>
      ) : (
        <Image source={videoOff} style={{marginLeft: 4}} />
      )}
    </View>
  );
};

const AppointmentRow = ({item, index}) => {
  if (!item) return null;

  const today = isToday(parseISO(item?.date), new Date());
  const upcoming = !today && isAfter(parseISO(item?.date), new Date());
  const over = !today && isBefore(parseISO(item?.date), new Date());
  const getColor = () => {
    if (item?.status === 'completed') return '#4CAF50'; // green (success)
    if (item?.status === 'confirmed') {
      if (upcoming) return '#2196F3'; // blue (info)
      if (today) return '#1976D2'; // dark blue (primary)
      if (over) return '#FFA000'; // orange (warning)
    }
    if (item?.status === 'cancelled') return '#F44336'; // red (error)
    if (item?.status === 'panding') return '#9C27B0'; // purple (secondary)
    return '#000000'; // default: black
  };

  return (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>
        {item?.doctor?.firstName || 'N/A'} {item?.doctor?.lastName}
      </Text>
      <Text style={styles.cell}>
        {format(new Date(item?.createdAt), 'M/d/yyyy')}
      </Text>
      <Text style={styles.cell}>
        {format(new Date(item?.date), 'M/d/yyyy')} {item?.time}
      </Text>
      <Text style={[styles.cell, {color: getColor(), fontWeight: 'bold'}]}>
        {item?.status === 'confirmed' && upcoming && 'upcomming'}
        {item?.status === 'confirmed' && today && 'today'}
        {item?.status === 'confirmed' && over && 'time up!'}
        {item?.status === 'completed' && 'completed'}
        {item?.status === 'cancelled' && 'cancelled'}
        {item?.status === 'panding' && 'panding'}
      </Text>
      <TableRowAction item={item} />
    </View>
  );
};

const AppointmentTableBody = ({filterValue}) => {
  const {user, token} = useStoreState(state => state.user);
  const {getPatient} = useStoreActions(action => action.patient);
  const {patient} = useStoreState(state => state.patient);

  useEffect(() => {
    getPatient({id: user?._id, token});
  }, [getPatient, user?._id, token]);

  if (!patient) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  const appointments = patient?.appointments || [];
  const filteredAppointments = appointments.filter(
    item => item.status === filterValue,
  );

  if (filteredAppointments.length === 0) {
    return <Text style={styles.noData}>No Data</Text>;
  }

  return (
    <FlatList
      data={filteredAppointments}
      keyExtractor={item => item._id}
      renderItem={({item, index}) => (
        <AppointmentRow item={item} index={index} />
      )}
    />
  );
};

export default function AppointmentTable({filterValue}) {
  const columns = [
    'No',
    'Docto Name',
    'Created',
    'Schedule Start',
    'Status',
    'Action',
  ];
  return (
    <View style={{flex: 1, width: '100%'}}>
      <ScrollView horizontal>
        <DataTable>
          <DataTable.Header>
            {columns.map(column => (
              <DataTable.Title key={column} numeric={column.align === 'right'}>
                {column}
              </DataTable.Title>
            ))}
          </DataTable.Header>

          <AppointmentTableBody filterValue={filterValue} />
        </DataTable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10, backgroundColor: '#fff'},
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {flex: 1, textAlign: 'center', fontSize: 14, marginLeft: 2},
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {padding: 5, borderRadius: 5, marginLeft: 2},
  buttonText: {color: '#fff', fontWeight: 'bold'},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  noData: {textAlign: 'center', color: 'gray', fontSize: 16, marginTop: 20},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {backgroundColor: '#fff', padding: 20, borderRadius: 10},
});
