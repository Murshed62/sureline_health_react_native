// utils.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addDays,
  getDaysInMonth,
  getMonth,
  isAfter,
  isToday,
  parseISO,
} from 'date-fns';

// Remove empty fields from form data
const checkUpdatedData = data => {
  console.log('checkUpdateData',data)
  return Object.keys(data).reduce((acc, key) => {
    if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
      acc[key] = data[key];
    }
    return acc;
  }, {});
};
// Get unique specialty names from an array of doctors
const specialityName = data => {
  if (!data) return [];
  return data.reduce((acc, cur) => {
    const speciality = cur.speciality.trim();
    if (!acc.includes(speciality)) {
      acc.push(speciality);
    }
    return acc;
  }, []);
};

// Filter doctors by specialty
const filterDoctorBySpecialty = (data, filterValue) => {
  if (!data) return [];
  if (filterValue === 'all') return data;
  return data.filter(doctor => doctor.speciality.trim() === filterValue);
};

// Create time slots array
const createSlots = times => {
  return times.map(time => ({
    time,
    status: 'available',
  }));
};

// Generate schedule for multiple days
const createSchedule = (totalDays, times) => {
  const today = new Date();
  const currentMonth = getMonth(today) + 1;

  const schedule = Array.from({ length: totalDays }, (_, i) => {
    const date = addDays(today, i);
    const isoDate = date.toISOString();
    const updatedMonth = getMonth(date) + 1;

    if (currentMonth === updatedMonth) {
      return {
        date: isoDate,
        status: 'available',
        slots: createSlots(times), // assuming this returns an array of time slots
      };
    }

    return null; // skip days from next month
  }).filter(Boolean); // remove null entries

  return schedule;
};

// Filter users by role
const filterUser = (users, roleState) => {
  if (roleState === 'all') return users;
  return users.filter(user => user.role === roleState);
};

// Get total days in a month
const getTotalDaysInMonth = date => getDaysInMonth(date);

// Filter appointments by status
const filterAppointments = (appointments, filterValue) => {
  return appointments.filter(appt => appt.status === filterValue);
};

// Get upcoming appointments
const getUpcomingAppointments = appointments => {
  const currentDate = new Date();
  return appointments.filter(appt => isAfter(parseISO(appt.date), currentDate));
};

// Filter doctor appointments by status
const filterDoctorAppointments = (appointments, filterValue) => {
  const currentDate = new Date();
  return appointments.filter(appt => {
    if (filterValue === 'today') {
      return (
        isToday(parseISO(appt.date)) &&
        ['confirmed', 'completed'].includes(appt.status)
      );
    }
    if (filterValue === 'all') {
      return true;
    }
    return appt.status === filterValue;
  });
};

// Validate email/phone format
const isValidEmailOrPhone = value => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\d{11}$/;
  return emailRegex.test(value) || phoneRegex.test(value);
};

const storeTokenUser = async ({token,user}) => {
  try {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', user);
    console.log('Token stored successfully');
  }
  catch (error) {
    console.error('Error storing token:', error);
  }
};
const getTokenUser = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const storedUser = await AsyncStorage.getItem('user');
    console.log(storedUser);
    return {
      token: token || null,
      user: storedUser ? JSON.parse(storedUser) : null,
    };
  }
  catch (error) {
    console.error('Error retrieving token:', error);
  }
};
const removeTokenUser = async () => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    console.log('Token removed successfully');
  }
  catch (error) {
    console.error('Error removing token:', error);
  }
};

export {
  checkUpdatedData,
  specialityName,
  filterDoctorBySpecialty,
  createSchedule,
  getTotalDaysInMonth,
  filterUser,
  filterAppointments,
  getUpcomingAppointments,
  filterDoctorAppointments,
  isValidEmailOrPhone,
  storeTokenUser,
  getTokenUser,
  removeTokenUser,
};
