import {
  View,
  Text,
  StatusBar,
  useWindowDimensions,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {Image, MotiView} from 'moti';
import FontText from '../FontText';
import {useState, useEffect} from 'react';
import {useUserContext} from '../../Contexts/UserContext';
import storage from '@react-native-firebase/storage';
import {firebase} from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import {launchImageLibrary} from 'react-native-image-picker';

const ShowProfileImage = () => {
  const {uploadPhotoModal, user} = useUserContext();
  const {width, height} = useWindowDimensions();
  const [selectedImage, setSelectedImage] = useState(
    uploadPhotoModal.uploadPhotoModalRef.imageUri,
  );
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageUploadedToDB, setImageUploadedToDB] = useState(false);

  const handleImageChoose = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 5000,
      maxWidth: 5000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
      }
    });
  };

  const handleCancel = () => {
    uploadPhotoModal.handleUploadPhotoModal(
      uploadPhotoModal.uploadPhotoModalRef,
      'close',
    );
  };

  const handleImageUpload = async () => {
    if (imageUploadLoading) return;
    setImageUploadLoading(true);
    try {
      const reference = storage().ref(
        `profile-images/${user.username}-profile-image`,
      );

      const task = reference.putFile(selectedImage);

      task.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );
      });

      task.then(async () => {
        const url = await storage()
          .ref(`profile-images/${user.username}-profile-image`)
          .getDownloadURL();

        await firebase.firestore().collection('Users').doc(user.uid).update({
          profileImage: url,
        });

        setImageUploadedToDB(true);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <StatusBar backgroundColor={'#131417'} />
      {!imageUploadedToDB ? (
        <MotiView className="flex justify-center items-center h-full">
          <View
            style={{
              height: height * 0.6,
              width: width * 0.85,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.5,
              shadowRadius: 12.35,
              elevation: 19,
            }}
            className="bg-accentColor2 rounded-lg flex justify-between items-center py-8">
            <FontText weight={'Medium'} className="text-xl ">
              Profile Image
            </FontText>

            <>
              <View
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 9,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 12.35,
                  elevation: 19,
                }}
                className="w-64 h-64 rounded-full overflow-hidden ">
                <Pressable onPress={handleImageChoose}>
                  <Image
                    style={{width: '100%', height: '100%'}}
                    source={{
                      uri: selectedImage,
                    }}
                  />
                </Pressable>
              </View>
            </>
            <View className="flex-row justify-around  w-full">
              <Pressable onPress={handleCancel} className="w-[40%]">
                <FontText
                  weight={'Medium'}
                  className="text-center py-3 bg-white text-primaryColor px-6 rounded-md text-lg">
                  Cancel
                </FontText>
              </Pressable>
              <Pressable
                className="py-3 bg-primaryColor px-6 rounded-md flex justify-center items-center w-[40%]"
                onPress={handleImageUpload}>
                {imageUploadLoading ? (
                  <ActivityIndicator color={'white'} size={'small'} />
                ) : (
                  <FontText weight={'Medium'} className="text-center  text-lg">
                    Upload
                  </FontText>
                )}
              </Pressable>
            </View>
          </View>
        </MotiView>
      ) : (
        <ConfirmUpload />
      )}
    </>
  );
};

const ConfirmUpload = () => {
  const {uploadPhotoModal} = useUserContext();
  useEffect(() => {
    const interval = setInterval(() => {
      uploadPhotoModal.handleUploadPhotoModal(
        uploadPhotoModal.uploadPhotoModalRef,
        'close',
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <LottieView
        source={require('../../Assets/lottie/confirm.json')}
        style={{width: '100%', height: '100%'}}
        autoPlay
        loop={false}
      />
    </>
  );
};

export default ShowProfileImage;
