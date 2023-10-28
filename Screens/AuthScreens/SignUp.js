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
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
  Keyboard,
} from 'react-native';
import {SvgUri} from 'react-native-svg';
import {useState, useEffect} from 'react';
import FontText from '../../Components/FontText';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {checkInitialFormErrors} from '../../Utils/checkInitialFormErrors';
import ErrorModal from '../../Components/ErrorModal';

const SignUp = ({navigation}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const {width, height} = Dimensions.get('window');
  const [showPass, setShowPass] = useState(false);
  useEffect(() => {}, []);

  const handleChange = (text, attr) => {
    setFormData({...formData, [attr]: text});
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setLoading(true);
    const error = checkInitialFormErrors(formData);
    if (error) {
      setLoading(false);
      setFormError(error);
      return;
    }

    const {username, email, password} = formData;

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      setLoading(false);
      navigation.navigate('PhoneAuth', {
        uid: user.uid,
        email: email,
        username: username,
      });
    } catch (error) {
      setLoading(false);
      if (error.code === 'auth/email-already-in-use') {
        setFormError('Email already in use');
      }
    }
  };

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="#131417" />
      <KeyboardAvoidingView behavior="position">
        <View
          width={width}
          height={height}
          className="bg-primaryColor flex items-center px-5 justify-center">
          <View
            className="flex items-center justify-center mb-5"
            width={width}
            height={height * 0.28}>
            <Image
              style={{width: '100%', height: '100%'}}
              source={require('../../Assets/signup.gif')}
              resizeMode="contain"
            />
          </View>
          <View className="flex justify-center gap-y-6  w-[95%]">
            <FontText className="text-white text-center text-xl">
              Let's get started to explore GeoMemo
            </FontText>
            <View className="flex flex-row w-full border-2 border-accentColor2 rounded-[14px] justify-between items-center px-2">
              <TextInput
                onChangeText={text => handleChange(text, 'username')}
                className="text-textColor w-[85%]"
                cursorColor={'white'}
                style={[{fontFamily: `Montserrat-Regular`}]}
                placeholder="Username"
                placeholderTextColor="white"
                keyboardType="default"
              />
              <FeatherIcon name="user" size={20} color="#fff" />
            </View>
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
                    SIGN UP
                  </FontText>
                )}
              </View>
            </TouchableOpacity>
            <TouchableWithoutFeedback
              onPress={() => {
                console.log('here');
                navigation.navigate('Login');
              }}>
              <View className="mt-3">
                <FontText className="text-white text-center italic text-[18px]">
                  Already have an account?{' '}
                  <FontText className="italic text-accentColor2 font-bold">
                    Login here
                  </FontText>
                </FontText>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </KeyboardAvoidingView>
      {formError && <ErrorModal text={formError} setError={setFormError} />}
    </SafeAreaView>
  );
};

export default SignUp;
