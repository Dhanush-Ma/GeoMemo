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
import Otp from '../../Components/Auth/Otp';
import PhoneNumber from '../../Components/Auth/PhoneNumber';
import {useAuthContext} from '../../Contexts/AuthContext';
import updateAuthIdToStorage from '../../Utils/updateAuthIdToStorage';
import ErrorModal from '../../Components/ErrorModal';

const PhoneAuth = ({navigation, route}) => {
  const {uid, email, username} = route.params;
  const {setAuth} = useAuthContext();
  const {width, height} = Dimensions.get('window');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(987657);
  const [error, setError] = useState('');


  const handlePhoneNumber = async () => {
    if (phoneNumber.length === 0) {
      setError('Invalid Phone Number');
      return;
    }

    setLoading(true);

    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setLoading(false);
      setOtpSent(confirmation);
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error.code === 'auth/invalid-phone-number') {
        setError('Invalid Phone Number');
        return;
      }

      setError('Internal Server Error');
    }
  };

  const handleOtp = async otp => {
    setLoading(true);
    try {
      console.log(otp);
      await otpSent.confirm(otp);

      await firestore().collection('Users').doc(uid).set({
        uid,
        email,
        username,
        phoneNumber,
        previous_messages: [],
        favorites: [],
        timeline: [],
        account_created: Date.now(),
      });

      await updateAuthIdToStorage(uid, setAuth, 'signup');
    } catch (error) {
      setLoading(false);
      setError('Invalid OTP');
    }
  };

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="#131417" />
      <KeyboardAvoidingView
        behavior="padding"
        width={width}
        height={height}
        className="bg-primaryColor px-5">
        {otpSent ? (
          <Otp
            phoneNumber={phoneNumber}
            handleOtp={handleOtp}
            error={error}
            setError={setError}
            loading={loading}
            setOtpSent={setOtpSent}
          />
        ) : (
          <PhoneNumber
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            error={error}
            setError={setError}
            loading={loading}
            handlePhoneNumber={handlePhoneNumber}
          />
        )}
      </KeyboardAvoidingView>
      {error && <ErrorModal text={error} setError={setError} />}
    </SafeAreaView>
  );
};

export default PhoneAuth;
