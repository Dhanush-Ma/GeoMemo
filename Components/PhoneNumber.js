import {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Keyboard,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import FontText from './FontText';
import ErrorModal from './ErrorModal';

const PhoneNumber = ({
  error,
  setError,
  handlePhoneNumber,
  loading,
  phoneNumber,
  setPhoneNumber,
}) => {
  return (
    <View className="flex h-full justify-center items-center">
      <View className="flex items-center justify-center mb-5" height={260}>
        <Image
          style={{flex: 1}}
          source={require('../Assets/Phone.png')}
          resizeMode="contain"
        />
      </View>
      <FontText className="text-2xl text-center mb-5" weight="Bold">
        One last step, enter your phone number to verify your account
      </FontText>
      <PhoneInput
        value={phoneNumber}
        containerStyle={{
          height: 70,
          backgroundColor: 'rgb(135 102 235)',
          borderRadius: 8,
        }}
        textContainerStyle={{
          backgroundColor: 'rgb(135 102 235)',
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        textInputStyle={{
          color: 'white',
          fontSize: 16,
          marginBottom: 0,
        }}
        codeTextStyle={{
          marginTop: -4,
          color: 'white',
        }}
        textInputProps={{
          cursorColor: 'white',
          placeholderTextColor: 'white',
        }}
        defaultCode="IN"
        onChangeFormattedText={text => {
          setPhoneNumber(text);
        }}
        withDarkTheme
        withShadow
      />
      <TouchableOpacity
        disabled={loading}
        className="w-[90%]"
        onPress={() => {
          Keyboard.dismiss();
          handlePhoneNumber();
        }}>
        <View className="bg-accentColor2 rounded-lg w-full py-4 mt-5">
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <FontText
              weight="Bold"
              className="text-center"
              style={{color: 'white'}}>
              SEND OTP
            </FontText>
          )}
        </View>
      </TouchableOpacity>
      {error && <ErrorModal text={error} setError={setError} />}
    </View>
  );
};

export default PhoneNumber;
