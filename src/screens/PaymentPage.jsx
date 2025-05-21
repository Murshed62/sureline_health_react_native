import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {format} from 'date-fns';

import { useForm, Controller } from 'react-hook-form';

const PromoSection = () => {
  const { user ,token} = useStoreState(state => state.user);
  const { getPromoCodeByCode } = useStoreActions(actions => actions.promoCode);
  const { error, promoCodeByCode } = useStoreState(state => state.promoCode);

  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const code = data.promoCode;
    getPromoCodeByCode({ code, userId: user?._id ,token});
    reset();
  };

  return (
    <View style={{
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      marginVertical: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Apply Promo Code
      </Text>

      <View>
        {/* Promo Code Input */}
        <Controller
          control={control}
          rules={{ required: 'This field is required' }}
          name="promoCode"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: errors.promoCode ? 'red' : '#ccc',
                borderRadius: 8,
                padding: 10,
                marginBottom: 8,
                fontSize: 16
              }}
              placeholder="Enter Promo Code"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.promoCode && (
          <Text style={{ color: 'red', marginBottom: 8 }}>
            {errors.promoCode.message}
          </Text>
        )}

        {/* Error Message */}
        {error && (
          <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>
        )}

        {/* Invalid Code Message */}
        {promoCodeByCode?.valid === 'notValid' && !error && (
          <Text style={{ color: 'red', marginBottom: 8 }}>
            This Promo Code is applicable only for Patient Accounts
          </Text>
        )}

        {/* Success Message */}
        {(promoCodeByCode?.percent > 0 || promoCodeByCode?.percent === 100) && !error && (
          <Text style={{ color: 'green', marginBottom: 8 }}>
            Discount Applied: {promoCodeByCode?.percent}%
          </Text>
        )}

        {/* Apply Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={{
            backgroundColor: '#4CAF50',
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 10
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Apply Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



const BillSection = ({ patientData }) => {
  const navigation = useNavigation();

  const { user ,token} = useStoreState(state => state.user);
  const { promoCodeByCode } = useStoreState(state => state.promoCode);
  const { getUrl } = useStoreActions(actions => actions.sslCommerz);
  const { createFreeAppointment } = useStoreActions(actions => actions.freeAppointment);
 console.log(promoCodeByCode)
  const discountAmount = (patientData.fee * (promoCodeByCode?.percent ?? 0)) / 100;
  const totalFee = patientData.fee - discountAmount;

  const generatePayload = () => {
    return {
      ...patientData,
      patientID: user?.role === 'patient' ? patientData.patientID : null,
      referenceHealhtHubID:
        user?.role === 'healthHub'
          ? user?._id
          : promoCodeByCode?.valid === 'patient' &&
            promoCodeByCode?.author?.role === 'healthHub'
          ? promoCodeByCode?.author?._id
          : null,
      totalFee,
    };
  };

  const handlePayment = () => {
    const payload = generatePayload();
    console.log(payload)
    getUrl({ payload,token });
  };

  const handleFreeAppointment = () => {
    const payload = generatePayload();
    createFreeAppointment({ payload, navigation });
  };

  return (
    <View style={styles.billContainer}>
      <Text style={styles.sectionTitle}>Bill Summary</Text>
      <View style={styles.row}>
        <Text>Fee:</Text>
        <Text>{patientData.fee}</Text>
      </View>
      <View style={styles.row}>
        <Text>Discount:</Text>
        <Text>{discountAmount}</Text>
      </View>
      <View style={styles.row}>
        <Text>Total Fee:</Text>
        <Text>{totalFee}</Text>
      </View>

      <PromoSection />

        <TouchableOpacity style={styles.button} onPress={handlePayment}>
          <Text style={styles.buttonText}>Continue to Payment</Text>
        </TouchableOpacity>
      {/* {promoCodeByCode?.percent === 100 ? (
        <TouchableOpacity style={styles.button} onPress={handleFreeAppointment}>
          <Text style={styles.buttonText}>Free Appointment</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handlePayment}>
          <Text style={styles.buttonText}>Continue to Payment</Text>
        </TouchableOpacity>
      )} */}
    </View>
  );
};

const PaymentPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const patientData = route.params || {};
  const {getDoctorById} = useStoreActions(actions => actions.doctor);
  const {doctor} = useStoreState(state => state.doctor);
  const doctorID = patientData.state.doctorID;

  useEffect(() => {
    getDoctorById(doctorID);
  }, [getDoctorById, doctorID]);

  if (!doctor) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{uri: doctor.profile}} style={styles.profileImage} />
        <Text style={styles.profileName}>
          {doctor.title} {doctor.firstName} {doctor.lastName}
        </Text>
        <Text>{doctor.speciality}</Text>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Appointment Details</Text>
        <Text>
          Date: {format(new Date(patientData?.state?.dateValue), 'MM/dd/yyyy')}
        </Text>
        <Text>Time: {patientData?.state?.timeValue}</Text>
        <Text>Appointment Created: {format(new Date(), 'MM/dd/yyyy')}</Text>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Patient Details</Text>
        <Text>Full Name: {patientData?.state?.fullName}</Text>
        <Text>Age: {patientData?.state?.age}</Text>
        <Text>Date of Birth: {patientData?.state?.dateOfBirth}</Text>
        <Text>Gender: {patientData?.state?.gender}</Text>
        <Text>Height: {patientData?.state?.height}</Text>
        <Text>Weight: {patientData?.state?.weight}</Text>
      </View>
      <BillSection patientData={patientData?.state} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 20},
  profileContainer: {alignItems: 'center', marginBottom: 20},
  profileImage: {width: 120, height: 120, borderRadius: 60},
  profileName: {fontSize: 18, fontWeight: 'bold'},
  sectionContainer: {marginBottom: 20},
  sectionTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 5},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  billContainer: {marginTop: 20, padding: 10, borderWidth: 1, borderRadius: 5},
  promoContainer: {padding: 20, alignItems: 'center'},
  title: {fontSize: 18, fontWeight: 'bold', textAlign: 'center'},
  centerText: {textAlign: 'center', marginBottom: 10},
  input: {borderWidth: 1, padding: 10, marginTop: 10, width: '100%'},
  errorText: {color: 'red'},
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  disabledButton: {backgroundColor: '#ccc'},
});

export default PaymentPage;
