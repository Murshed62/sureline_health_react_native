// components/UI/ImagePickerField.js
import React from 'react';
import { View, Button, Image, Text, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';

const pickImage = async (onChange) => {
  try {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      console.log('ImagePicker Error: ', result.errorMessage);
      return;
    }

    if (result.assets && result.assets.length > 0) {
      onChange(result.assets[0]);
    }
  } catch (err) {
    console.error('pickImage error:', err);
  }
};

const ImagePickerField = ({ control, name, label, rules = {} }) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.wrapper}>
          <Text style={styles.label}>{label}</Text>
          <Button title={`Choose ${label}`} onPress={() => pickImage(onChange)} />

          {value?.uri && (
            <Image source={{ uri: value.uri }} style={styles.imagePreview} />
          )}

          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 15,
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
  },
  imagePreview: {
    width: 80,
    height: 80,
    marginTop: 10,
    borderRadius: 8,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});

export default ImagePickerField;
