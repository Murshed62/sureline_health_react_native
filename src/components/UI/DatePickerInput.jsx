import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DatePickerInput({date, setDate, label}) {
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios'); // Keep picker open on iOS, close on Android
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={{marginVertical: 10}}>
      <Text style={{marginBottom: 5}}>{label}</Text>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 5,
        }}>
        <Text>{date ? date.toDateString() : 'Select Date'}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
        />
      )}
    </View>
  );
}
