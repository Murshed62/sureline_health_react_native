import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Controller } from 'react-hook-form';

const DatePickerField = ({ control, errors }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View>
      <Text>Date of Birth</Text>
      <Controller
        control={control}
        name="dob"
        rules={{
          required: 'Date of birth is required',
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <Pressable
              style={[
                styles.input,
                errors.dob && { borderColor: 'red' },
              ]}
              onPress={() => setShowPicker(true)}
            >
              <Text style={{ color: value ? 'black' : '#aaa' }}>
                {value ? new Date(value).toLocaleDateString() : 'Select Date'}
              </Text>
            </Pressable>

            {showPicker && (
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) {
                    onChange(selectedDate.toISOString().split('T')[0]);
                }
                }}
              />
            )}
          </>
        )}
      />
      {errors.dob && (
        <Text style={styles.errorText}>{errors.dob.message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 20},
  heading: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 5,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  errorText: {color: 'red', marginBottom: 10},
});

export default DatePickerField;
