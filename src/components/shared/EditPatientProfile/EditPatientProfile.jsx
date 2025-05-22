import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {checkUpdatedData} from '../../../utils/index.js';
import DatePickerInput from '../../UI/DatePickerInput.jsx';
import {formatDate} from 'date-fns';

const EditPatientProfile = ({userID, handleClose}) => {
  const {user, token} = useStoreState(state => state.user);
  const {updateProfile} = useStoreActions(action => action.patient);
  const {control, handleSubmit, reset} = useForm();

  // For Date Picker
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onSubmit = data => {
    const preparedData = {
      ...data,
      age: data.age ? Number(data.age) : undefined,
      height: data.height ? Number(data.height) : undefined,
      weight: data.weight ? Number(data.weight) : undefined,
      phone: data.phone ? Number(data.phone) : undefined,
    };

    const updatedFormData = checkUpdatedData(preparedData);
    console.log(updatedFormData);
    updateProfile({updatedFormData, userID, token});
    reset();
    handleClose();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Your Profile</Text>
      <View style={styles.form}>
        {/* First Name */}
        <Text>First Name:</Text>
        <Controller
          control={control}
          name="firstName"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="words"
            />
          )}
        />

        {/* Last Name */}
        <Text>Last Name:</Text>
        <Controller
          control={control}
          name="lastName"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="words"
            />
          )}
        />

        {/* Phone */}
        <Text>Phone:</Text>
        <Controller
          control={control}
          name="phone"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              placeholder="Phone"
              keyboardType="numeric"
              onBlur={onBlur}
              onChangeText={text => {
                const cleaned = text.replace(/[^0-9]/g, ''); // Remove non-digits
                onChange(cleaned);
              }}
              value={value}
            />
          )}
        />

        {/* Address */}
        <Text>Address:</Text>
        <Controller
          control={control}
          name="address"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              placeholder="Address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {/* Gender Picker */}
        <Text>Gender:</Text>
        <Controller
          control={control}
          name="gender"
          render={({field: {onChange, value}}) => (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={styles.picker}>
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          )}
        />

        {/* Blood Type */}
        <Text>Blood Type:</Text>
        <Controller
          control={control}
          name="blood"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              placeholder="Blood Type (e.g., A+)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        {/* Age */}
        <Text>Age:</Text>
        <Controller
          control={control}
          name="age"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              placeholder="Age"
              keyboardType="number-pad"
              onBlur={onBlur}
              onChangeText={text => {
                const cleaned = text.replace(/[^0-9]/g, '');
                onChange(cleaned);
              }}
              value={value}
            />
          )}
        />

        {/* Height */}
        <Text>Height:</Text>
        <Controller
          control={control}
          name="height"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              placeholder="Height (ft)"
              keyboardType="number-pad"
              onBlur={onBlur}
              onChangeText={text => {
                const cleaned = text.replace(/[^0-9]/g, ''); // Only digits
                onChange(cleaned);
              }}
              value={value}
            />
          )}
        />

        {/* Weight */}
        <Text>Weight:</Text>
        <Controller
          control={control}
          name="weight"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              placeholder="Weight (kg)"
              keyboardType="decimal-pad" // supports dot input on iOS
              onBlur={onBlur}
              onChangeText={text => {
                const cleaned = text
                  .replace(/[^0-9.]/g, '') // remove all except digits and dot
                  .replace(/(\..*)\./g, '$1'); // allow only one dot
                onChange(cleaned);
              }}
              value={value}
            />
          )}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    textAlign: 'center',
    paddingBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#444',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#1976d2',
    borderRadius: 5,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditPatientProfile;
