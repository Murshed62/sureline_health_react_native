import {View, Text, Dimensions, StyleSheet, Image} from 'react-native';
import React from 'react';
import Carousel from 'react-native-reanimated-carousel';
import bannerOne from '../../../assets/pOne.jpg';
import bannerTwo from '../../../assets/pTwo.png';

const AddBanner = () => {
  const width = Dimensions.get('window').width;

  // Array of banners
  const banners = [
    {
      id: 1,
      source:
        'https://res.cloudinary.com/dcinvxm2u/image/upload/v1747399526/1_h27mva.jpg',
    },
    {
      id: 2,
      source:
        'https://res.cloudinary.com/dcinvxm2u/image/upload/v1747399526/1_h27mva.jpg',
    },
  ];
  return (
    <View>
      <View style={styles.container}>
        {/* Carousel */}
        <View style={{flex: 1}}>
          <Carousel
            loop
            width={width * 0.9} // Adjust width for centered look
            height={150} // Adjust the height of the carousel
            autoPlay={true}
            autoPlayInterval={3000} // Delay between slides
            data={banners} // Pass the banner array as data
            scrollAnimationDuration={1000}
            renderItem={({item}) => (
              <View style={styles.bannerContainer}>
                <Image source={{ uri: item.source }} style={styles.bannerImage} />
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default AddBanner;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    alignItems: 'center', // Center the entire carousel
  },
  title: {
    marginLeft: 10,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 5,
    marginBottom: 2,
  },
  secText: {
    fontSize: 16,
    color: '#ffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  bannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: 'white',
    width: '100%',
    height: '100%',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageButtonContainer: {
    flexDirection: 'row',
    marginTop: 150,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  imageButton: {
    width: 90,
    height: 70,
    resizeMode: 'contain',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#15BBE3',
  },
});
