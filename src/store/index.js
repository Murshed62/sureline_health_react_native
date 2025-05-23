// store.js
import {createStore, action, thunk} from 'easy-peasy';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToastAndroid} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {removeTokenUser, storeTokenUser} from '../utils/index.js';
import {Linking} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
// import {Linking} from 'react-native';
// import Config from 'react-native-config';

// const api_base_url = 'https://api.surelinehealth.com';

const getUserFromStorage = async () => {
  try {
    const storedUser = await AsyncStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error retrieving user from AsyncStorage:', error);
    return null;
  }
};

const userModel = {
  allUsers: [],
  registerData: null,
  registerError: null,
  loginError: null,
  isLogoutUser: false,
  isLogIn: false,
  user: null,
  token: null, // Initially set to null
  // Fetch user data from AsyncStorag
  addUser: action((state, payload) => {
    state.user = payload;
  }),
  addIslogIn: action((state, payload) => {
    state.isLogIn = payload;
  }),
  addRegisterData: action((state, payload) => {
    state.registerData = payload;
  }),
  addRegisterError: action((state, payload) => {
    state.registerError = payload;
  }),
  registerUser: thunk(async (actions, {formData, credential, navigate}) => {
    try {
      const {data} = await axios.post(
        'https://api.surelinehealth.com/api/register',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}},
      );
      ToastAndroid.show(data.message, ToastAndroid.SHORT);

      if (data.success) {
        setTimeout(() => {
          navigate('OtpVerification', {credential});
        }, 100); // Small delay to allow stack to settle
      }
    } catch (e) {
      ToastAndroid.show(e?.response?.data.message, ToastAndroid.SHORT);
      actions.addRegisterError({
        field: e?.response?.data?.field || null,
        message: e?.response?.data?.message || 'Something went wrong',
      });
    }
  }),
  otpVerify: thunk(async (actions, {verifyingData, navigation}) => {
    try {
      const {data} = await axios.post(
        'https://api.surelinehealth.com/api/otp-verification',
        verifyingData,
      );
      if (data.success) {
        if (
          data?.user?.role === 'patient' ||
          data?.user?.role === 'healthHub'
        ) {
          ToastAndroid.show(data.message, ToastAndroid.SHORT);
          actions.addUser(data.user);
          actions.addIslogIn(true);
          storeTokenUser({
            token: data.token,
            user: JSON.stringify(data.user),
          });
          navigation.navigate('TabNavigator');
        }
        if (data?.user?.role === 'doctor') {
          ToastAndroid.show(
            'Successfully Created New Doctor Account.',
            ToastAndroid.SHORT,
          );
          navigation.navigate('TabNavigator');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }),
  addLoginError: action((state, payload) => {
    state.loginError = payload;
  }),
  loginUser: thunk(async (actions, {loginData, from, navigate}) => {
    try {
      const {data} = await axios.post(
        'https://api.surelinehealth.com/api/login',
        loginData,
        {headers: {'Content-Type': 'application/json'}},
      );
      console.log(data);
      if (data.success) {
        if (data?.user?.forcePasswordReset) {
          ToastAndroid.show('Reset Your Password!', ToastAndroid.SHORT);
          navigate('ForceReset', {credential: data.user.credential});
          return;
        }
        if (data.user.role === 'patient' || data.user.role === 'healthHub') {
          actions.addUser(data.user);
          actions.addIslogIn('true');

          storeTokenUser({
            token: data.token,
            user: JSON.stringify(data.user),
          });
          // await AsyncStorage.setItem('user', JSON.stringify(data.user));
          ToastAndroid.show('Login Successfully', ToastAndroid.SHORT);
          navigate(from, {replace: true});
          return;
        }
      }
    } catch (error) {
      console.error(error);
      actions.addLoginError(error?.response?.data?.message) || 'Login Failed';
    }
  }),
  loadUser: action((state, {user, token}) => {
    state.user = user || null;
    state.token = token || null;
  }),

  addLogoutData: action(state => {
    state.user = null;
    state.token = null;
    state.isLogoutUser = true;
  }),

  logoutUser: thunk(async actions => {
    try {
      await removeTokenUser(); // ✅ await this!
      actions.addLogoutData(); // ✅ reset store
    } catch (error) {
      console.error('Logout Error:', error);
    }
  }),

  addAllUsers: action((state, payload) => {
    state.allUsers = payload;
  }),

  getAllUsers: thunk(async actions => {
    const {data} = await axios.get('https://api.surelinehealth.com/api/users');
    actions.addAllUsers(data);
  }),

  sendResetLink: thunk(async (actions, {credential}) => {
    try {
      const {data} = await axios.post(
        'https://api.surelinehealth.com/api/forgotPassword',
        {credential},
      );
      if (data.success) {
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show(error?.response?.data?.message, ToastAndroid.SHORT);
    }
  }),

  resetPassword: thunk(
    async (
      actions,
      {password, confirmPassword, resetToken, navigate, from},
    ) => {
      try {
        const {data} = await axios.put(
          `https://api.surelinehealth.com/api/password/reset/${resetToken}`,
          {password, confirmPassword},
        );
        if (data.success) {
          ToastAndroid.show(data.message, ToastAndroid.SHORT);
          actions.addUser(data.user);
          actions.addIslogIn(true);
          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('user', JSON.stringify(data.user));
          if (data?.user?.role === 'patient') {
            navigate(from, {replace: true});
            return;
          }
          navigate('/');
        }
      } catch (error) {
        ToastAndroid.show(error?.response?.data?.message, ToastAndroid.SHORT);
      }
    },
  ),
};

const doctorModel = {
  data: [],
  doctor: null,
  singleDoctor: null,
  updatedAppointmentData: null,
  updatedProfileData: null,
  imageData: null,
  updatedScheduleData: null,
  statusData: null,
  deleteDoctorData: null,
  addData: action((state, payload) => {
    state.data = payload;
  }),
  getDoctors: thunk(async actions => {
    const {data} = await axios.get(
      'https://api.surelinehealth.com/api/doctors',
    );
    actions.addData(data);
  }),
  addDoctor: action((state, payload) => {
    state.doctor = payload;
  }),
  getDoctorById: thunk(async (actions, payload) => {
    const {data} = await axios.get(
      `https://api.surelinehealth.com/api/doctors/${payload}`,
    );
    actions.addDoctor(data);
  }),
  addUpdatedAppointmentData: action((state, payload) => {
    state.updatedAppointmentData = payload;
  }),
  updatedAppointment: thunk(async (actions, payload) => {
    const {userID, appointmentID, patientID} = payload;
    const {data} = await axios.patch(
      `https://api.surelinehealth.com/api/doctorAppointment/${userID}`,
      {
        appointmentID,
        patientID,
      },
    );
    actions.addUpdatedAppointmentData(data);
  }),
  addUpdatedProrileData: action((state, payload) => {
    state.updatedProfileData = payload;
  }),
  updateProfile: thunk(async (actions, payload) => {
    const {userID, updatedFormData} = payload;
    console.log(userID, updatedFormData);
    const {data} = await axios.patch(
      `https://api.surelinehealth.com/api/doctors/${userID}`,
      updatedFormData,
    );
    actions.addUpdatedProrileData(data);
  }),
  addImageData: action((state, payload) => {
    state.imageData = payload;
  }),
  updateDoctorImage: thunk(async (actions, payload) => {
    const {userID, formData} = payload;
    const {data} = await axios.patch(
      `https://api.surelinehealth.com/api/doctorImage/${userID}`,
      formData,
      {
        headers: {'Content-Type': 'multipart/form-data'},
      },
    );
    actions.addImageData(data);
  }),
  addSingleDoctor: action((state, payload) => {
    state.singleDoctor = payload;
  }),
  getSingleDoctor: thunk(async (actions, payload) => {
    const {data} = await axios.get(
      `https://api.surelinehealth.com/api/doctors/${payload}`,
    );
    actions.addSingleDoctor(data);
  }),
  addUpdatedScheduleData: action((state, payload) => {
    state.updatedScheduleData = payload;
  }),
  updateSchedule: thunk(async (actions, payload) => {
    const {doctorID, schedule} = payload;
    const {data} = await axios.patch(
      `https://api.surelinehealth.com/api/doctorSchedule/${doctorID}`,
      {
        schedule,
      },
    );
    actions.addUpdatedScheduleData(data);
  }),
  addStatusData: action((state, payload) => {
    state.statusData = payload;
  }),
  updateScheduleStatus: thunk(async (actions, payload) => {
    const {doctorID, scheduleID, status} = payload;
    const {data} = await axios.patch(
      'https://api.surelinehealth.com/api/doctorScheduleStatus',
      {
        doctorID,
        scheduleID,
        status,
      },
    );
    actions.addStatusData(data);
  }),
  updateScheduleSlotStatus: thunk(async (actions, payload) => {
    const {doctorID, scheduleID, slotID, formatedTime, status} = payload;
    const {data} = await axios.patch(
      'https://api.surelinehealth.com/api/doctorScheduleSlotStatus',
      {
        doctorID,
        scheduleID,
        slotID,
        time: formatedTime,
        status,
      },
    );
    actions.addStatusData(data);
  }),
  addNewSlot: thunk(async (actions, payload) => {
    const {doctorID, scheduleID} = payload;
    const {data} = await axios.patch(
      `https://api.surelinehealth.com/api/doctors/${doctorID}/schedule/${scheduleID}`,
    );
    actions.addStatusData(data);
  }),
  deleteSlot: thunk(async (actions, payload) => {
    const {doctorID, scheduleID, slotID} = payload;
    const {data} = await axios.delete(
      `https://api.surelinehealth.com/api/doctors/${doctorID}/schedule/${scheduleID}/slot/${slotID}`,
    );
    actions.addStatusData(data);
  }),
  addDeleteDoctorData: action((state, payload) => {
    state.deleteDoctorData = payload;
  }),
  deleteDoctor: thunk(async (actions, payload) => {
    const {id} = payload;
    const {data} = await axios.delete(
      `https://api.surelinehealth.com/api/users/${id}`,
    );
    actions.addDeleteDoctorData(data);
  }),
};

const patientModel = {
  patient: null,
  deleteState: null,
  updatedData: null,
  patientImageData: null,

  // Action to set patient data
  addPatient: action((state, payload) => {
    state.patient = payload;
  }),

  getPatient: thunk(async (actions, {id, token}) => {
    console.log(id,token)
    const {data} = await axios.get(
      `https://api.surelinehealth.com/api/patient/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(data)
    actions.addPatient(data);
  }),
  // Action to set delete state
  addDeleteState: action((state, payload) => {
    state.deleteState = payload;
  }),

  // Thunk to delete patient appointment
  deletePatientAppointment: thunk(async (actions, payload) => {
    try {
      const {patientID, appointmentID, doctorID} = payload;
      const {data} = await axios.patch(
        `https://api.surelinehealth.com/api/patientAppointment/${patientID}`,
        {
          appointmentID,
          doctorID,
        },
      );
      actions.addDeleteState(data);
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  }),

  // Action to update profile data
  addUpdatedData: action((state, payload) => {
    state.updatedData = payload;
  }),

  // Thunk to update patient profile
  updateProfile: thunk(async (actions, {userID, updatedFormData,token}) => {
    try {
      const {data} = await axios.patch(
        `https://api.surelinehealth.com/api/patient/${userID}`,
        updatedFormData,{
          headers:{
                Authorization: `Bearer ${token}`,
            },
        }
      );
      actions.addUpdatedData(data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }),

  // Action to set patient image data
  addPatientImageData: action((state, payload) => {
    state.patientImageData = payload;
  }),

  // Thunk to update patient image
  updatePatientImage: thunk(async (actions, {userID, formData,token}) => {
    try {
      const {data} = await axios.patch(
        `https://api.surelinehealth.com/api/patientImage/${userID}`,
        formData,
        {
          headers:{'Content-Type':'multipart/form-data',Authorization: `Bearer ${token}`},
        },
      );
      actions.addPatientImageData(data);
    } catch (error) {
      console.error('Error updating patient image:', error);
    }
  }),
};
const testRecommendationModel = {
  createTestData: null,
  updatedData: null,
  deletedData: null,
  addUpdatedData: action((state, payload) => {
    state.updatedData = payload;
  }),
  uploadTestResult: thunk(async (actions, {id, formData}) => {
    const {data} = await axios.patch(
      `https://api.surelinehealth.com/api/testRecommendations/${id}`,
      formData,
      {
        headers: {'Content-Type': 'multipart/form-data'},
      },
    );
    actions.addUpdatedData(data);
  }),
  addCreateTestData: action((state, payload) => {
    state.createTestData = payload;
  }),
  createTest: thunk(async (actions, payload) => {
    const {testName} = payload.data;
    const {apppintmentID} = payload;
    const {data} = await axios.post(
      'https://api.surelinehealth.com/api/testRecommendations',
      {
        testName,
        apppintmentID,
      },
    );
    actions.addCreateTestData(data);
  }),
  addDeletedData: action((state, payload) => {
    state.deletedData = payload;
  }),
  deleteTest: thunk(async (actions, payload) => {
    const {data} = await axios.delete(
      `https://api.surelinehealth.com/api/testRecommendations/${payload}`,
    );
    actions.addDeletedData(data);
  }),
};
const prescriptionModel = {
  data: null,
  deletedMedicin: null,
  createPresData: null,
  updatedData: null,
  medicineData: null,
  instructionData: null,
  getPrescriptionByIdData: null,
  addDeletedMedicin: action((state, payload) => {
    state.deletedMedicin = payload;
  }),
  medicinDelete: thunk(async (actions, payload) => {
    const {data} = await axios.delete(
      `https://api.surelinehealth.com/api/medicinInstructions/${payload}`,
    );
    actions.addDeletedMedicin(data);
  }),
  addCreatePress: action((state, payload) => {
    state.createPresData = payload;
  }),
  createPrescription: thunk(async (actions, payload) => {
    console.log(payload.data);
    const {problem} = payload.data;
    const {appointmentID} = payload;
    const {data} = await axios.post(
      'https://api.surelinehealth.com/api/prescriptions',
      {
        problem,
        appointmentID,
      },
    );
    actions.addCreatePress(data);
  }),
  addUpdatedPrescriptionData: action((state, payload) => {
    state.updatedData = payload;
  }),
  updatePrescription: thunk(async (actions, payload) => {
    const {id} = payload;
    const {data: updatedData} = payload;
    const {data} = await axios.patch(
      `https://api.surelinehealth.com/api/prescriptions/${id}`,
      {
        updatedData,
      },
    );
    actions.addUpdatedPrescriptionData(data);
  }),
  addMedicineData: action((state, payload) => {
    state.medicineData = payload;
  }),
  createMedicine: thunk(async (actions, payload) => {
    const {medicinName, dosage, frequency, duration} = payload.data;
    const {prescriptionID} = payload;
    const {data} = await axios.post(
      'https://api.surelinehealth.com/api/medicinInstructions',
      {
        medicinName,
        dosage,
        frequency,
        duration,
        prescriptionID,
      },
    );
    actions.addMedicineData(data);
  }),
  addAdditionalInstruction: action((state, payload) => {
    state.instructionData = payload;
  }),
  updateAdditionalInstruction: thunk(async (actions, payload) => {
    const {prescriptionID} = payload;
    const {advice} = payload.data;
    const {data} = await axios.patch(
      `https://api.surelinehealth.com/api/prescriptions/${prescriptionID}`,
      {
        advice,
      },
    );
    actions.addAdditionalInstruction(data);
  }),
  addGetPrescriptionByid: action((state, payload) => {
    state.getPrescriptionByIdData = payload;
  }),
  getPrescriptionById: thunk(async (actions, {id}) => {
    const {data} = await axios.get(
      `https://api.surelinehealth.com/api/prescriptions/${id}`,
    );

    actions.addGetPrescriptionByid(data);
  }),
};
const medicalRecordModel = {
  data: [],
  addData: action((state, payload) => {
    state.data = payload;
  }),
  getMedicalRecord: thunk(async actions => {
    const {data} = await axios.get(
      'https://api.surelinehealth.com/api/medicalRecord',
    );
    actions.addData(data);
  }),
};
const appointmentModel = {
  appointmentByIdData: [],
  appointments: [],
  addAppointments: action((state, payload) => {
    state.appointments = payload;
  }),
  updatedData: null,
  addUpdatedData: action((state, payload) => {
    state.updatedData = payload;
  }),
  updateAppointment: thunk(async (actions, payload) => {
    const {appointmentID, reqApplyedID, date, time} = payload;
    const {googleMeetLink} = payload.data;
    const {data} = await axios.patch(
      `https://api.surelinehealth.com/api/appointments/${appointmentID}`,
      {
        date,
        time,
        googleMeetLink,
        reqApplyedID,
        status: 'confirmed',
      },
    );
    actions.addUpdatedData(data);
  }),
  getAppointments: thunk(async actions => {
    const {data} = await axios.get(
      'https://api.surelinehealth.com/api/appointments',
    );
    actions.addAppointments(data);
  }),
  addGetAppointmentById: action((state, payload) => {
    state.appointmentByIdData = payload;
  }),
  getAppointmentByid: thunk(async (actions, {payload,token}) => {
    const {data} = await axios.get(
      `https://api.surelinehealth.com/api/appointments/${payload}`,{
        headers:{
                Authorization: `Bearer ${token}`,
            },
      }
    );
    actions.addGetAppointmentById(data);
  }),
};
const applyedAppointmentModel = {
  deleteData: null,
  addDeletedData: action((state, payload) => {
    state.deleteData = payload;
  }),
  deleteApplyedData: thunk(async (actions, payload) => {
    const {data} = await axios.delete(
      `https://api.surelinehealth.com/api/applyForAppointments/${payload}`,
    );
    actions.addDeletedData(data);
  }),
};
const sslCommerzModel = {
  url: null,
  addUrl: action((state, payload) => {
    state.url = payload;
  }),
  getUrl: thunk(async (actions, {payload, token}) => {
    try {
      const {data: paymentUrl} = await axios.post(
        'https://api.surelinehealth.com/api/initApplyForPayment',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(paymentUrl, {
          // Optional styling options
          dismissButtonStyle: 'close',
          preferredBarTintColor: '#453AA4',
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
        });

        // Listen for success/fail/cancel based on polling or status check
        // OR: add timeout and navigate manually
      } else {
        Linking.openURL(paymentUrl); // fallback
      }
    } catch (error) {
      console.log(error)
      console.error('Error in getUrl thunk:', error);
    }
  }),
};
const freeAppointmentModel = {
  data: null,
  addData: action((state, payload) => {
    state.data = payload;
  }),
  createFreeAppointment: thunk(async (actions, {payload, navigation}) => {
    console.log('Navigation Object:', navigation);
    try {
      const {data} = await axios.post(
        'https://api.surelinehealth.com/api/freeAppointments',
        payload,
      );
      console.log(data);

      if (data) {
        ToastAndroid.show('Free Appointment Created!', ToastAndroid.SHORT);
        navigation.navigate('SuccessFreeAppointment', {
          freeAppointmentId: data.freeAppointmentId,
        });
      }
    } catch (error) {
      console.error('Error creating free appointment:', error);
    }
  }),
};
const adminModel = {
  data: null,
  deletedData: null,
  allUserData: [],
  addUserData: action((state, payload) => {
    state.data = payload;
  }),
  addUser: thunk(async (actions, payload) => {
    const {username, email, password, role} = payload.data;
    try {
      const {data} = await axios.post(
        'https://api.surelinehealth.com/api/register',
        {
          username,
          email,
          password,
          role,
        },
      );
      actions.addUserData(data.user);
      ToastAndroid.success('Created New User.', {position: 'top-right'});
    } catch (e) {
      console.log(e);
    }
  }),
  addAllUserData: action((state, payload) => {
    state.allUserData = payload;
  }),
  getAllUser: thunk(async actions => {
    const {data} = await axios.get('https://api.surelinehealth.com/api/users');
    actions.addAllUserData(data);
  }),
  addDeletedData: action((state, payload) => {
    state.deletedData = payload;
  }),
  deleteUser: thunk(async (actions, payload) => {
    const {data} = await axios.delete(
      `https://api.surelinehealth.com/api/users/${payload}`,
    );
    actions.addDeletedData(data);
  }),
};
const promoCodeModel = {
  createdPromoData: null,
  singlePromoCode: null,
  allPromoData: [],
  promoCodeByCode: null,
  error: null,
  deletedData: null,
  updatedData: null,
  addError: action((state, payload) => {
    state.error = payload;
  }),
  addPromoCodeByCode: action((state, payload) => {
    state.promoCodeByCode = payload;
  }),
  addPromoData: action((state, payload) => {
    state.createdPromoData = payload;
  }),
  getPromoCodeByCode: thunk(async (actions, {code, userId, token}) => {
    try {
      const {data} = await axios.post(
        'https://api.surelinehealth.com/api/promoCodeValidate',
        {code, userId},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      actions.addPromoCodeByCode(data);
      actions.addError(null);
    } catch (error) {
      actions.addPromoCodeByCode(null);
      actions.addError(error.response?.data?.message || 'Something went wrong');
    }
  }),
  addDeletedData: action((state, payload) => {
    state.deletedData = payload;
  }),
  // addUpdatedData: action((state, payload) => {
  //   state.updatedData = payload;
  // }),
  // updatePromoCode: thunk(async (actions, {id, data: updateData}) => {
  //   try {
  //     const {data} = await axios.patch(
  //       `${api_base_url}/api/promoCodes/${id}`,
  //       updateData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );
  //     actions.addUpdatedData(data);
  //   } catch (e) {
  //     toast.error(e?.response?.data.message);
  //     console.log(e);
  //   }
  // }),
  resetPromoCode: action(state => {
    state.promoCodeByCode = 0;
    state.error = null;
  }),
  addSinglePromoCode: action((state, payload) => {
    state.singlePromoCode = payload;
  }),
  getSinglePromoCode: thunk(async (actions, {id, token}) => {
    const {data} = await axios.get(
      `https://api.surelinehealth.com/api/promoCodes/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    actions.addSinglePromoCode(data);
  }),
};
const superAdminModel = {
  createdData: null,
  addCreatedAdmin: action((state, payload) => {
    state.createdData = payload;
  }),
  createSuperAdmin: thunk(async actions => {
    const {data} = await axios.post(
      'https://api.surelinehealth.com/api/register',
      {
        username: 'Super Admin',
        email: 'super_admin@gmail.com',
        password: 'super_admin@1',
        role: 'super_admin',
      },
    );
    actions.addCreatedAdmin(data);
  }),
};
const profileImageModel = {
  profileImage: null, // Initial value is null
  setProfileImage: (state, imageUri) => {
    state.profileImage = imageUri;
  },
};
const healthHubModel = {
  isLoading: false,
  healthHub: null,
  updatedData: null,
  allHealthHub: [],
  refAppointments: [],
  allRefAppointments: [],
  addHealthHub: action((state, payload) => {
    state.healthHub = payload;
  }),
  addIsloading: action((state, payload) => {
    state.isLoading = payload;
  }),
  getHealthHub: thunk(async (actions, {id, token}) => {
    try {
      actions.addIsloading(true);
      const {data} = await axios.get(`/api/healthHub/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      actions.addHealthHub(data);
      actions.addIsloading(false);
    } catch (e) {
      console.log('Health Hub not found', e);
    } finally {
      actions.addIsloading(false);
    }
  }),
};

const store = createStore({
  user: userModel,
  profileImage: profileImageModel,
  doctor: doctorModel,
  patient: patientModel,
  testRecommendation: testRecommendationModel,
  prescription: prescriptionModel,
  medicalRecord: medicalRecordModel,
  sslCommerz: sslCommerzModel,
  appointment: appointmentModel,
  applyedAppointment: applyedAppointmentModel,
  admin: adminModel,
  promoCode: promoCodeModel,
  superAdmin: superAdminModel,
  freeAppointment: freeAppointmentModel,
  healthHub: healthHubModel,
});

// Initialize user on app start
const initializeStore = async () => {
  await store.dispatch.user.initialize();
};

initializeStore();

export default store;
