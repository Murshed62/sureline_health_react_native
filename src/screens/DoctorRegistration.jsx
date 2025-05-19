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

const DoctorRegistration = () => {
  const [times, setTimes] = useState([]);
  const date = new Date();
  const totalMonthDays = getTotalDaysInMonth(date);
  const schedule = createSchedule(totalMonthDays, times);

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
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('nationality', 'Bangladesh'); // or dynamic value
    formData.append('designation', 'Your Designation'); // e.g., 'Consultant'
    formData.append('organization', 'Your Org'); // optional but good to match
    formData.append('address', 'Some Address'); // if needed
    formData.append('document', ''); // optional, can omit if unused
    formData.append(
      'dateOfBirth',
      data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0]  : '',
    );
    formData.append(
      'bmdcExpiryDate',
      data.bmdc_bvc_expiry ? new Date(data.bmdc_bvc_expiry).toISOString().split('T')[0]  : '',
    );
    formData.append('mobile', data.mobile);
    formData.append('nidOrPassport', data.nid_passport);
    formData.append('gender', data.gender);
    formData.append('fee', data.fee);
    formData.append('biography', data.biography);
    formData.append('title', data.title);
    formData.append('bmdcNumber', data.bmdc_bvc);
    formData.append('degrees', data.degrees);
    formData.append('speciality', data.speciality);
    formData.append('yearOfExperience', data.yearOfExperience);
    formData.append('username', data.username);
    formData.append('credential', data.credential);
    formData.append('password', data.password);
    formData.append('schedule', JSON.stringify(schedule));
    formData.append('profile', {
      uri: data.profileImage.uri,
      name: data.profileImage.fileName || 'profile.jpg',
      type: data.profileImage.type || 'image/jpeg',
    });

    formData.append('signature', {
      uri: data.signatureImage.uri,
      name: data.signatureImage.fileName || 'signature.jpg',
      type: data.signatureImage.type || 'image/jpeg',
    });
    formData.append('role', 'doctor');
    for (let pair of formData._parts) {
      console.log(`${pair[0]}:`, pair[1]);
    }
    registerUser({
      formData,
      navigate: navigation.navigate,
      credential: data.credential,
    });

    reset();
    setShow(false);

    // You can now call your registerUser function here with form data
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>Personal Information</Text>
        {/* Fast name */}
        <Text>First Name</Text>
        <Controller
          control={control}
          name="firstName"
          rules={{
            required: 'First name is required',
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[styles.input, errors.firstName && {borderColor: 'red'}]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter first name"
            />
          )}
        />
        {errors.firstName && (
          <Text style={styles.errorText}>{errors.firstName.message}</Text>
        )}
        {/* Last name */}
        <Text>Last Name</Text>
        <Controller
          control={control}
          name="lastName"
          rules={{
            required: 'Last name is required',
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[styles.input, errors.lastName && {borderColor: 'red'}]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter last name"
            />
          )}
        />
        {errors.lastName && (
          <Text style={styles.errorText}>{errors.lastName.message}</Text>
        )}
        <Controller
          control={control}
          name="dateOfBirth"
          defaultValue={null}
          rules={{required: 'Date of Birth is required'}}
          render={({field: {value, onChange}}) => (
            <DatePickerInput
              label="Date of Birth"
              date={value}
              setDate={onChange}
            />
          )}
        />
        {errors.dateOfBirth && (
          <Text style={styles.errorText}>{errors.dateOfBirth.message}</Text>
        )}

        <Text>Mobile</Text>
        <Controller
          control={control}
          name="mobile"
          rules={{
            required: 'Nobile number is required',
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[styles.input, errors.mobile && {borderColor: 'red'}]}
              value={value}
              onChangeText={text => onChange(text.replace(/[^0-9]/g, ''))} // allows only numbers
              keyboardType="numeric" // shows numeric keyboard
              placeholder="Enter Your Mobile Number"
            />
          )}
        />
        {errors.mobile && (
          <Text style={styles.errorText}>{errors.mobile.message}</Text>
        )}

        <Text>NID / Passport Number</Text>
        <Controller
          control={control}
          name="nid_passport"
          rules={{
            required: 'NID / Passport is required',
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[
                styles.input,
                errors.nid_passport && {borderColor: 'red'},
              ]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter last name"
            />
          )}
        />
        {errors.nid_passport && (
          <Text style={styles.errorText}>{errors.nid_passport.message}</Text>
        )}

        <Text style={styles.label}>Gender</Text>
        <Controller
          control={control}
          name="gender"
          rules={{required: 'Gender is required'}}
          render={({field: {onChange, value}}) => (
            <View
              style={[
                styles.pickerContainer,
                errors.gender && {borderColor: 'red'},
              ]}>
              <Picker selectedValue={value} onValueChange={onChange}>
                <Picker.Item label="Select Gender" value="" />
                {/* Placeholder item */}
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          )}
        />

        {errors.gender && (
          <Text style={styles.errorText}>{errors.gender.message}</Text>
        )}

        <Text>Fee</Text>
        <Controller
          control={control}
          name="fee"
          rules={{
            required: 'Free is required',
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[styles.input, errors.fee && {borderColor: 'red'}]}
              value={value}
              onChangeText={text => onChange(text.replace(/[^0-9]/g, ''))} // allows only numbers
              keyboardType="numeric" // shows numeric keyboard
              placeholder="Enter your fee"
            />
          )}
        />
        {errors.fee && (
          <Text style={styles.errorText}>{errors.fee.message}</Text>
        )}

        <Text>Biography</Text>
        <Controller
          control={control}
          name="biography"
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[styles.input]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter your biography"
            />
          )}
        />

        <Text style={styles.label}>Title</Text>
        <Controller
          control={control}
          name="title"
          rules={{required: 'Title is required'}}
          render={({field: {onChange, value}}) => (
            <View
              style={[
                styles.pickerContainer,
                errors.title && {borderColor: 'red'},
              ]}>
              <Picker selectedValue={value} onValueChange={onChange}>
                <Picker.Item label="Select Title" value="" />
                <Picker.Item label="Dr." value="Dr." />
                <Picker.Item label="Professor" value="Professor" />
              </Picker>
            </View>
          )}
        />
        {errors.title && (
          <Text style={styles.errorText}>{errors.title.message}</Text>
        )}

        <Text>BMDC/BVC Number</Text>
        <Controller
          control={control}
          name="bmdc_bvc"
          rules={{
            required: 'BMDC/BVC Number is required',
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[styles.input, errors.bmdc_bvc && {borderColor: 'red'}]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter your BMDC/BVC Number"
            />
          )}
        />
        {errors.bmdc_bvc && (
          <Text style={styles.errorText}>{errors.bmdc_bvc.message}</Text>
        )}

        <Controller
          control={control}
          name="bmdc_bvc_expiry"
          defaultValue={null}
          render={({field: {value, onChange}}) => (
            <DatePickerInput
              label="BMDC/BVC Expiry Date"
              date={value}
              setDate={onChange}
            />
          )}
        />

        <Text>Degrees</Text>
        <Controller
          control={control}
          name="degrees"
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[styles.input]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter last name"
            />
          )}
        />
        <Text style={styles.label}>Speciality</Text>
        <Controller
          control={control}
          name="speciality"
          rules={{required: 'Speciality is required'}}
          render={({field: {onChange, value}}) => (
            <View
              style={[
                styles.pickerContainer,
                errors.speciality && {borderColor: 'red'},
              ]}>
              <Picker selectedValue={value} onValueChange={onChange}>
                <Picker.Item label="Select speciality" value="" />
                {specialitys.map(item => (
                  <Picker.Item
                    key={item.id}
                    label={item.name}
                    value={item.name}
                  />
                ))}
              </Picker>
            </View>
          )}
        />
        {errors.speciality && (
          <Text style={styles.errorText}>{errors.speciality.message}</Text>
        )}

        <Text>Year of Experience</Text>
        <Controller
          control={control}
          name="yearOfExperience"
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={[styles.input]}
              value={value}
              onChangeText={text => onChange(text.replace(/[^0-9]/g, ''))} // allows only numbers
              keyboardType="numeric" // shows numeric keyboard
              placeholder="Years of Experience"
            />
          )}
        />

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
          name="profileImage"
          label="Profile Image"
          rules={{required: 'Profile image is required'}}
        />
        <ImagePickerField
          control={control}
          name="signatureImage"
          label="Signature Image"
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

export default DoctorRegistration;
