import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import { useStoreActions, useStoreState } from 'easy-peasy';

export default function ProfileAvatarCard({ item }) {
  const {
  control,
  handleSubmit,
  setValue,
  reset,
  formState: { errors },
} = useForm();
  const { updatePatientImage } = useStoreActions(action => action.patient);
  const { user ,token} = useStoreState(state => state.user);

  const [previewImage, setPreviewImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const userID = item._id;

  useEffect(() => {
    const imageFromDB = item?.image || '';
    setCurrentImage(imageFromDB);
  }, [item, user.role]);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const file = response.assets[0];
        setPreviewImage(file.uri);

        const fileObj = {
          uri: file.uri,
          type: file.type,
          name: file.fileName,
        };

        setValue('image', fileObj);
      }
    });
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('image', data.image);

    try {
      await updatePatientImage({ userID, formData ,token});

      setPreviewImage(null);
      setCurrentImage(data.image.uri);
      reset();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
  <View style={styles.card}>
  <Image
    source={{ uri: previewImage || currentImage || 'https://via.placeholder.com/120' }}
    style={styles.avatar}
  />
  <Text style={styles.label}>Profile Photo</Text>

  <TouchableOpacity style={styles.chooseButton} onPress={pickImage}>
    <Text style={styles.buttonText}>Choose New Photo</Text>
  </TouchableOpacity>

  {/* Show validation error if image is not selected */}
  {errors.image && (
    <Text style={styles.errorText}>{errors.image.message}</Text>
  )}

  <View style={{ marginTop: 15 }}>
    <Controller
      control={control}
      name="image"
      rules={{ required: 'Please choose an image before uploading.' }}
      render={({ field }) => null}
    />
    <TouchableOpacity style={styles.uploadButton} onPress={handleSubmit(onSubmit)}>
      <Text style={styles.buttonText}>Upload New Photo</Text>
    </TouchableOpacity>
  </View>
</View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#007bff',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 15,
    fontWeight: '600',
    color: '#333',
  },
  chooseButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  uploadButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
  color: 'red',
  marginTop: 5,
  fontSize: 14,
  fontWeight: '500',
},
});
