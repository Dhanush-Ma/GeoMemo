import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  TextInput,
  Button,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useState, useEffect} from 'react';
import FontText from '../../Components/FontText';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {checkInitialFormErrors} from '../../Utils/checkInitialFormErrors';
import ErrorModal from '../../Components/ErrorModal';
import {MotiImage} from 'moti';
import {useAuthContext} from '../../Contexts/AuthContext';
import {useUserContext} from '../../Contexts/UserContext';
import updateAuthIdToStorage from '../../Utils/updateAuthIdToStorage';

const Login = ({navigation}) => {
  const {setAuth} = useAuthContext();
  const {setUserId} = useUserContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const {width, height} = Dimensions.get('window');
  const [showPass, setShowPass] = useState(false);

  const handleChange = (text, attr) => {
    setFormData({...formData, [attr]: text});
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    const error = checkInitialFormErrors(formData, 'login');
    if (error) {
      setFormError(error);
      return;
    }
    setLoading(true);
    const {email, password} = formData;
    try {
      const res = await auth().signInWithEmailAndPassword(email, password);
      const {uid} = res.user;
      console.log(uid);
      await updateAuthIdToStorage(uid, setAuth);
    } catch (err) {
      console.log(err);
      if (err.code === 'auth/user-not-found') {
        setFormError('User not found');
      }

      if (err.code === 'auth/wrong-password') {
        setFormError('Wrong Password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="#131417" />
      <KeyboardAvoidingView
        behavior="padding"
        width={width}
        height={height}
        className="bg-primaryColor flex items-center px-5 justify-center">
        <View width={250} height={250} className="mb-4">
          <MotiImage
            style={{width: '100%', height: '100%'}}
            source={require('../../Assets/Login.png')}
            resizeMode="contain"
          />
        </View>
        <View className="flex justify-center gap-y-6  w-[95%]">
          <FontText className="text-white text-center text-xl">
            Welcome back! Log in to access GeoMemo
          </FontText>
          <View className="flex flex-row w-full border-2 border-accentColor2 rounded-[14px] justify-between items-center px-2">
            <TextInput
              onChangeText={text => handleChange(text, 'email')}
              className="text-textColor w-[85%]"
              cursorColor={'white'}
              style={[{fontFamily: `Montserrat-Regular`}]}
              placeholder="Email"
              placeholderTextColor="white"
              keyboardType="email-address"
            />
            <FeatherIcon name="mail" size={20} color="#fff" />
          </View>
          <View className="flex flex-row w-full border-2 border-accentColor2 rounded-[14px] justify-between items-center px-2">
            <TextInput
              onChangeText={text => handleChange(text, 'password')}
              className="text-textColor w-[85%]"
              cursorColor={'white'}
              style={[{fontFamily: `Montserrat-Regular`}]}
              placeholder="Password"
              placeholderTextColor="white"
              keyboardType="default"
              secureTextEntry={!showPass}
            />
            {showPass ? (
              <FontAwesome5Icon
                onPress={() => setShowPass(false)}
                name="eye"
                size={20}
                color="#fff"
              />
            ) : (
              <FontAwesome5Icon
                onPress={() => setShowPass(true)}
                name="eye-slash"
                size={20}
                color="#fff"
              />
            )}
          </View>
          <TouchableOpacity className="w-full" onPress={handleSubmit}>
            <View className="bg-accentColor2 rounded-lg w-full py-4">
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <FontText
                  weight="Bold"
                  className="text-center"
                  style={{color: 'white'}}>
                  LOGIN
                </FontText>
              )}
            </View>
          </TouchableOpacity>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate('SignUp');
            }}>
            <View className="mt-3">
              <FontText className="text-center italic text-[18px] text-white">
                Don't have an account?{' '}
                <FontText className="italic text-accentColor2 font-bold">
                  Sign Up
                </FontText>
              </FontText>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {formError && <ErrorModal text={formError} setError={setFormError} />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
