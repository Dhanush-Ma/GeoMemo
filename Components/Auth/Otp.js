import {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
  Keyboard,
  TextInput,
} from 'react-native';
import FontText from '../FontText';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import ErrorModal from '../ErrorModal';

const Otp = ({
  phoneNumber,
  handleOtp,
  loading,
  setOtpSent,
  error,
  setError,
}) => {
  const [otp, setOtp] = useState([]);

  const inputRefs = [];
  const totalInputs = 6;

  for (let i = 0; i < totalInputs; i++) {
    inputRefs[i] = useRef(null);
  }

  const handleInputChange = (text, index) => {
    if (text.length === 1 && index < totalInputs - 1) {
      inputRefs[index + 1].current.focus();
    }
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  return (
    <View className="flex h-full justify-center items-center">
      <View className="flex items-center justify-center mb-5" height={260}>
        <Image
          style={{flex: 1}}
          source={require('../../Assets/Otp.png')}
          resizeMode="contain"
        />
      </View>
      <FontText className="text-xl text-center mt-5" weight="Bold">
        Verification OTP is sent to
      </FontText>
      <View
        className="flex flex-row items-center justify-center mt-2 w-[90%] gap-x-5
      ">
        <FontText className="text-accentColor2 text-2xl" weight="Bold">
          {phoneNumber}
        </FontText>
        <View>
          <TouchableWithoutFeedback
            onPress={() => {
              setOtpSent(false);
            }}>
            <AntDesignIcon name="edit" color="#fff" size={30} />
          </TouchableWithoutFeedback>
        </View>
      </View>

      <View className="flex flex-row my-7 gap-x-[6px]">
        {[...Array(totalInputs).keys()].map(index => (
          <View
            key={index}
            style={{
              borderColor:
                otp.length > index ? 'rgb(135 102 235)' : 'rgb(116,118,121)',
            }}
            className="w-12 h-12 border-2 rounded-md flex justify-center items-center">
            <TextInput
              ref={inputRefs[index]}
              className="text-textColor text-center text-2xl"
              cursorColor={'white'}
              style={[{fontFamily: `Montserrat-Regular`}]}
              keyboardType="number-pad"
              onChangeText={text => handleInputChange(text, index)}
              maxLength={1}
            />
          </View>
        ))}
      </View>

      <TouchableOpacity
        disabled={loading}
        className="w-[90%]"
        onPress={() => {
          Keyboard.dismiss();
          handleOtp(otp.join(''));
        }}>
        <View className="bg-accentColor2 rounded-lg w-full py-4">
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <FontText
              weight="Bold"
              className="text-center text-xl"
              style={{color: 'white'}}>
              CONFIRM OTP
            </FontText>
          )}
        </View>
      </TouchableOpacity>
      {error && <ErrorModal text={error} setError={setError} />}
    </View>
  );
};

export default Otp;
