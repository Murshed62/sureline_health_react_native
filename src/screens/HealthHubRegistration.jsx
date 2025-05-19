import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Button,
  Platform,
  ScrollView,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePickerField from '../components/UI/DatePickerField';
import {Picker} from '@react-native-picker/picker';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {
  createSchedule,
  getTotalDaysInMonth,
  isValidEmailOrPhone,
} from '../utils/index.js';
import ImagePickerField from '../components/UI/ImagePickerField.jsx';
import {useNavigation} from '@react-navigation/native';
import DatePickerInput from '../components/UI/DatePickerInput.jsx';

const specialitys = [
  {id: '1', name: 'Anesthesiology'},
  {id: '2', name: 'Cardiology'},
  {id: '3', name: 'Cardiothoracic Surgery'},
  {id: '4', name: 'Colorectal Surgery'},
  {id: '5', name: 'Dentistry'},
  {id: '6', name: 'Dermatology and Venereology'},
  {id: '32', name: 'Family Medicine'},
  {id: '7', name: 'Gastroenterology'},
  {id: '8', name: 'General Physician'},
  {id: '9', name: 'General Surgery'},
  {id: '10', name: 'Gynaecology and Obstetrics'},
  {id: '11', name: 'Haematology'},
  {id: '12', name: 'Hepatology'},
  {id: '13', name: 'Internal Medicine'},
  {id: '14', name: 'Nephrology'},
  {id: '15', name: 'Neuromedicine'},
  {id: '16', name: 'Neurosurgery'},
  {id: '17', name: 'Oncology'},
  {id: '31', name: 'Ophthalmology'},
  {id: '18', name: 'Oral and Maxillofacial Surgery'},
  {id: '19', name: 'Orthopedics'},
  {id: '20', name: 'Otolaryngology (ENT)'},
  {id: '21', name: 'Pediatric Surgery'},
  {id: '22', name: 'Pediatrics'},
  {id: '33', name: 'Physical Medicine & Rehabilitation'},
  {id: '23', name: 'Plastic Surgery'},
  {id: '24', name: 'Psychiatry'},
  {id: '25', name: 'Radiology'},
  {id: '26', name: 'Reproductive Endocrinology and Infertility'},
  {id: '27', name: 'Respiratory Medicine'},
  {id: '28', name: 'Rheumatology'},
  {id: '29', name: 'Urology'},
  {id: '30', name: 'Vascular Surgery'},
];

const HealthHubRegistration = () => {
  const [show, setShow] = useState(false);
  const {registerUser, addRegisterError} = useStoreActions(
    action => action.user,
  );
  const {registerError} = useStoreState(state => state.user);
  const navigation = useNavigation();
  const errorMessage = registerError?.message;
  const errorField = registerError?.field;

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({mode: 'onChange'});

  const onSubmit = data => {
    const formData = new FormData();
    formData.append('profile', {
      uri: data.profile.uri,
      name: data.profile.fileName || 'profile.jpg',
      type: data.profile.type || 'image/jpeg',
    });

    formData.append('signature', {
      uri: data.pharmacy.uri,
      name: data.pharmacy.fileName || 'signature.jpg',
      type: data.pharmacy.type || 'image/jpeg',
    });
    formData.append('pharmacyName', data.pharmacyName);
    formData.append('phanmacyReg', data.phanmacyReg);
    formData.append('nid', data.nid); // or dynamic value
    formData.append('phone', data.phone); // e.g., 'Consultant'
    formData.append('category', data.category); // optional but good to match
    formData.append('service', data.service); // if needed
    formData.append('number', data.number); // optional, can omit if unused
    formData.append('description', data.description);
    formData.append('division', data.division);
    formData.append('upazila', data.upazila);
    formData.append('district', data.district);
    formData.append('username', data.username);
    formData.append('credential', data.credential);
    formData.append('password', data.password);
    formData.append('role', 'healthHub');
    for (let pair of formData._parts) {
      console.log(`${pair[0]}:`, pair[1]);
    }
    registerUser({
      formData,
      navigate: navigation.navigate,
      credential: data.credential,
    });

    // reset();
    // setShow(false);

    // You can now call your registerUser function here with form data
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>Personal Information</Text>
        {/* Pharmacy name */}
        <Text>Pharmacy Name</Text>
        <Controller
          control={control}
          name="pharmacyName"
          rules={{
            required: 'Pharmacy name is required',
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[
                styles.input,
                errors.pharmacyName && {borderColor: 'red'},
              ]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter pharmacy name"
            />
          )}
        />
        {errors.pharmacyName && (
          <Text style={styles.errorText}>{errors.pharmacyName.message}</Text>
        )}
        {/* Pharmacy Reg */}
        <Text>Pharmacy Reg.</Text>
        <Controller
          control={control}
          name="phanmacyReg"
          rules={{
            required: 'Pharmacy Reg is required',
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[
                styles.input,
                (errors.phanmacyReg || errorField === 'pharmacyReg') && {
                  borderColor: 'red',
                },
              ]}
              value={value}
              onChangeText={text => {
                onChange(text);
                if (registerError) addRegisterError(null);
              }}
              onBlur={onBlur}
              placeholder="Enter last name"
            />
          )}
        />
        {(errors.phanmacyReg || errorField === 'pharmacyReg') && (
          <Text style={styles.errorText}>
            {errors.phanmacyReg?.message ||
              (errorField === 'pharmacyReg' ? errorMessage : '')}
          </Text>
        )}
        {/* NID  */}
        <Text>NID</Text>
        <Controller
          control={control}
          name="nid"
          rules={{
            required: 'NID is required',
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[
                styles.input,
                (errors.nid || errorField === 'nid') && {borderColor: 'red'},
              ]}
              value={value}
              onChangeText={text => {
                onChange(text);
                if (registerError) addRegisterError(null);
              }}
              onBlur={onBlur}
              placeholder="Enter your NID"
            />
          )}
        />
        {(errors.nid || errorField === 'nid') && (
          <Text style={styles.errorText}>
            {errors.nid?.message || (errorField === 'nid' ? errorMessage : '')}
          </Text>
        )}
        {/* Phone  */}
        <Text>Phone</Text>
        <Controller
          control={control}
          name="phone"
          rules={{
            required: 'phone number is required',
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[styles.input, errors.phone && {borderColor: 'red'}]}
              value={value}
              onChangeText={text => onChange(text.replace(/[^0-9]/g, ''))} // allows only numbers
              keyboardType="numeric" // shows numeric keyboard
              placeholder="Enter Your Mobile Number"
            />
          )}
        />
        {errors.phone && (
          <Text style={styles.errorText}>{errors.phone.message}</Text>
        )}
        {/* category */}
        <Text style={styles.label}>Category</Text>
        <Controller
          control={control}
          name="category"
          rules={{required: 'category is required'}}
          render={({field: {onChange, value}}) => (
            <View
              style={[
                styles.pickerContainer,
                errors.gender && {borderColor: 'red'},
              ]}>
              <Picker selectedValue={value} onValueChange={onChange}>
                <Picker.Item label="Model" value="Model" />
                <Picker.Item label="No Model" value="No Model" />
              </Picker>
            </View>
          )}
        />
        {/* Payment service */}
        <Text style={styles.label}>Payment Service</Text>
        <Controller
          control={control}
          name="service"
          rules={{required: 'service is required'}}
          render={({field: {onChange, value}}) => (
            <View
              style={[
                styles.pickerContainer,
                errors.gender && {borderColor: 'red'},
              ]}>
              <Picker selectedValue={value} onValueChange={onChange}>
                <Picker.Item label="Bkash" value="Bkash" />
                <Picker.Item label="Nagad" value="Nagad" />
                <Picker.Item label="Rocket" value="Rocket" />
                <Picker.Item label="Bank" value="Bank" />
              </Picker>
            </View>
          )}
        />

        {/* Payent number  */}
        <Text>Payment number</Text>
        <Controller
          control={control}
          name="number"
          rules={{
            required: 'Payment number is required',
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[styles.input, errors.number && {borderColor: 'red'}]}
              value={value}
              onChangeText={text => onChange(text.replace(/[^0-9]/g, ''))} // allows only numbers
              keyboardType="numeric" // shows numeric keyboard
              placeholder="Enter Your Payment Number"
            />
          )}
        />
        {errors.number && (
          <Text style={styles.errorText}>{errors.number.message}</Text>
        )}

        {/* Description */}
        <Text>Description</Text>
        <Controller
          control={control}
          name="description"
          rules={{
            required: 'Description is required',
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[
                styles.input,
                {textAlignVertical: 'top'}, // Ensures text starts at the top-left
                errors.description && {borderColor: 'red'},
              ]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter pharmacy name"
              multiline={true}
              numberOfLines={4} // Adjust number of lines as needed
            />
          )}
        />
        {errors.description && (
          <Text style={styles.errorText}>{errors.description.message}</Text>
        )}

        {/* Division */}
        <Text>Division</Text>
        <Controller
          control={control}
          name="division"
          rules={{
            required: 'Division is required',
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[styles.input, errors.division && {borderColor: 'red'}]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter pharmacy name"
            />
          )}
        />
        {errors.division && (
          <Text style={styles.errorText}>{errors.division.message}</Text>
        )}
        {/* District */}
        <Text>District</Text>
        <Controller
          control={control}
          name="district"
          rules={{
            required: 'District is required',
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[styles.input, errors.district && {borderColor: 'red'}]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter pharmacy name"
            />
          )}
        />
        {errors.district && (
          <Text style={styles.errorText}>{errors.district.message}</Text>
        )}
        {/* Upazila */}
        <Text>Upazila</Text>
        <Controller
          control={control}
          name="upazila"
          rules={{
            required: 'upazila is required',
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[styles.input, errors.upazila && {borderColor: 'red'}]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter pharmacy name"
            />
          )}
        />
        {errors.upazila && (
          <Text style={styles.errorText}>{errors.upazila.message}</Text>
        )}

        <Text>Username</Text>
        <Controller
          control={control}
          name="username"
          rules={{
            required: 'Username is required',
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[styles.input, errors.username && {borderColor: 'red'}]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter your username"
            />
          )}
        />
        {errors.username && (
          <Text style={styles.errorText}>{errors.username.message}</Text>
        )}

        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="credential"
          rules={{
            required: 'Email is required',
            validate: value =>
              isValidEmailOrPhone(value) || 'Enter a valid email address',
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[
                styles.input,
                (errors.credential || errorField === 'credential') && {
                  borderColor: 'red',
                },
              ]}
              value={value}
              onChangeText={text => {
                onChange(text);
                if (registerError) addRegisterError(null);
              }}
              onBlur={onBlur}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        {(errors.credential || errorField === 'credential') && (
          <Text style={styles.errorText}>
            {errors.credential?.message ||
              (errorField === 'credential' ? errorMessage : '')}
          </Text>
        )}

        <Text>Password</Text>
        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password must be is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[styles.input, errors.password && {borderColor: 'red'}]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter your strong password"
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}

        <ImagePickerField
          control={control}
          name="profile"
          label="Profile Image"
          rules={{required: 'Profile image is required'}}
        />
        <ImagePickerField
          control={control}
          name="pharmacy"
          label="Pharmacy Image"
          rules={{required: 'Signature image is required'}}
        />

        <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
    </ScrollView>
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

export default HealthHubRegistration;
