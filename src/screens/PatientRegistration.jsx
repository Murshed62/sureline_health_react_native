import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { isValidEmailOrPhone } from '../utils/index.js';

const Register = () => {
  const { control, handleSubmit, watch, formState: { errors },reset } = useForm({ mode: 'onChange' });
  const { registerUser, addRegisterError } = useStoreActions(actions => actions.user);
  const { registerError } = useStoreState(state => state.user);
  const navigation = useNavigation();
  const route = useRoute();
  const from = route?.params?.from || 'Home';

  const password = watch('password');
  const errorMessage = registerError?.message;
  const errorField = registerError?.field;

  const onSubmit = data => {
    addRegisterError(null);
    const { username, credential, confirmPassword } = data;
    const formData = new FormData();
    formData.append('username', username);
    formData.append('credential', credential);
    formData.append('password', confirmPassword);

    registerUser({ formData, navigate: navigation.navigate, credential, from });
    reset({
      username: '',
      credential: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create an Account</Text>

        {/* Username */}
        <Controller
          control={control}
          name="username"
          rules={{ required: 'This field is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Username"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || ''}
              error={!!errors.username}
            />
          )}
        />
        {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

        {/* Email or Phone */}
        <Controller
          control={control}
          name="credential"
          rules={{
            required: 'This field is required',
            validate: value => isValidEmailOrPhone(value) || 'Enter a valid email',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Email or Phone"
              mode="outlined"
              keyboardType="default"
              onBlur={onBlur}
              onChangeText={(text) => {
                onChange(text);
                if (registerError) addRegisterError(null);
              }}
              value={value || ''}
              error={!!errors.credential || errorField === 'credential'}
            />
          )}
        />
        {(errors.credential || errorField === 'credential') && (
          <Text style={styles.errorText}>
            {errors.credential?.message || (errorField === 'credential' ? errorMessage : '')}
          </Text>
        )}

        {/* Password */}
        <Controller
          control={control}
          name="password"
          rules={{ required: 'This field is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Password"
              mode="outlined"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || ''}
              error={!!errors.password}
            />
          )}
        />
        {(errors.password) && (
          <Text style={styles.errorText}>
            {errors.password?.message || (errorField === 'credential' ? errorMessage : '')}
          </Text>
        )}

        {/* Confirm Password */}
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: 'This field is required',
            validate: value => value === password || 'Password not match!',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Confirm Password"
              mode="outlined"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || ''}
              error={!!errors.confirmPassword}
            />
          )}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
        )}

        {/* Submit */}
        <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
          Register
        </Button>

        {/* Navigation to Login */}
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 16,
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
