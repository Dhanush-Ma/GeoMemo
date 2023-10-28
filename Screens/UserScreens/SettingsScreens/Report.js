import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Pressable,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import FontText from '../../../Components/FontText';
import EntypeIcon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useState, useEffect} from 'react';
import {MotiView} from 'moti';
import {firebase} from '@react-native-firebase/firestore';
import getFormattedTime from '../../../Utils/getFormattedTime';
import {useUserContext} from '../../../Contexts/UserContext';

const Report = ({navigation}) => {
  const {user} = useUserContext();
  const [loading, setLoading] = useState(false);
  const [issueStatus, setIssueStatus] = useState('');
  const [formData, setFormData] = useState({
    androidVersion: '',
    mobileModel: '',
    issue: '',
  });
  const [formErrors, setFormErrors] = useState({
    androidVersion: '',
    mobileModel: '',
    issue: '',
  });

  const handleChange = (key, text) => {
    setFormData({...formData, [key]: text});
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (formData.androidVersion === '') {
      setFormErrors({
        androidVersion: 'Android Version is required',
        mobileModel: '',
        issue: '',
      });
      return;
    }

    if (formData.mobileModel === '') {
      setFormErrors({
        androidVersion: '',
        mobileModel: 'Mobile Model is required',
        issue: '',
      });
      return;
    }

    if (formData.issue === '') {
      setFormErrors({
        androidVersion: '',
        mobileModel: '',
        issue: 'Issue is required',
      });
      return;
    }

    setFormErrors({
      androidVersion: '',
      mobileModel: '',
      issue: '',
    });
    setLoading(true);

    try {
      await firebase
        .firestore()
        .collection('Issues')
        .add({
          username: user.username,
          email: user.email,
          timestamp: getFormattedTime(Date.now()),
          androidVersion: formData.androidVersion,
          mobileModel: formData.mobileModel,
          issue: formData.issue,
        });

      setIssueStatus('success');
      setFormData({
        androidVersion: '',
        mobileModel: '',
        issue: '',
      });
    } catch (error) {
      setIssueStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View
        style={{marginTop: StatusBar.currentHeight}}
        className="bg-accentColor2 px-3 py-4 flex flex-row justify-center items-center relative">
        <StatusBar backgroundColor={'#8766eb'} />
        <Pressable
          className="absolute top- left-5 "
          onPress={() => navigation.goBack()}>
          <EntypeIcon name="chevron-left" size={30} />
        </Pressable>
        <FontText className="text-2xl text-center ">Report</FontText>
      </View>
      <ScrollView
        contentContainerStyle={{paddingBottom: 60}}
        style={{flex: 1}}
        className="bg-primaryColor px-6 pt-5">
        <KeyboardAvoidingView>
          <View className="flex space-y-5">
            <View>
              <TextInput
                style={{
                  borderColor: formErrors.androidVersion
                    ? '#E80003'
                    : 'rgb(135, 102, 235)',
                }}
                value={formData.androidVersion}
                onChangeText={text => handleChange('androidVersion', text)}
                placeholderTextColor={
                  formErrors.androidVersion ? '#E80003' : 'gray'
                }
                placeholder="Android Version Number"
                keyboardType="default"
                className="border-4 rounded-xl text-white px-5"
              />
              {formErrors.androidVersion && (
                <FontText className="text-base text-[#E80003] italic ml-2">
                  *{formErrors.androidVersion}
                </FontText>
              )}
            </View>
            <View>
              <TextInput
                style={{
                  borderColor: formErrors.mobileModel
                    ? '#E80003'
                    : 'rgb(135, 102, 235)',
                }}
                value={formData.mobileModel}
                onChangeText={text => handleChange('mobileModel', text)}
                placeholderTextColor={
                  formErrors.mobileModel ? '#E80003' : 'gray'
                }
                placeholder="Mobile Model Name"
                keyboardType="default"
                className="border-4 rounded-xl text-white px-5"
              />
              {formErrors.mobileModel && (
                <FontText className="text-base text-[#E80003] italic ml-2">
                  *{formErrors.mobileModel}
                </FontText>
              )}
            </View>
            <View>
              <TextInput
                style={{
                  borderColor: formErrors.issue
                    ? '#E80003'
                    : 'rgb(135, 102, 235)',
                  verticalAlign: 'top',
                }}
                value={formData.issue}
                onChangeText={text => handleChange('issue', text)}
                placeholderTextColor={formErrors.issue ? '#E80003' : 'gray'}
                placeholder="Describe briefly your issue with GemoMemo"
                keyboardType="default"
                className="border-4 rounded-xl text-white px-5 py-5"
                multiline={true}
                numberOfLines={20}
              />
              {formErrors.issue && (
                <FontText className="text-base text-[#E80003] italic ml-2">
                  *{formErrors.issue}
                </FontText>
              )}
            </View>
            <TouchableOpacity onPress={handleSubmit}>
              <View className="bg-accentColor2 py-2 rounded-md flex justify-center items-center h-12 align-bottom">
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <FontText weight={'Medium'} className="text-xl">
                    Submit Issue
                  </FontText>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      {issueStatus && (
        <IssueStatusModal
          status={issueStatus}
          setIssueStatus={setIssueStatus}
        />
      )}
    </>
  );
};

const IssueStatusModal = ({status, setIssueStatus}) => {
  const {width} = useWindowDimensions();
  const [isAnimating, setIsAnimating] = useState(true);

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  useEffect(() => {
    if (isAnimating) {
      const timeout = setTimeout(() => {
        toggleAnimation();
        clearTimeout(timeout);
      }, 5000);
    }
  }, [isAnimating]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIssueStatus('');
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const bg = status === 'success' ? 'bg-successColor' : 'bg-errorColor';
  const text = status === 'success' ? 'text-black' : 'text-white';

  return (
    <MotiView
      key={status}
      from={{translateY: -200, translateX: width / 2}}
      animate={{translateY: isAnimating ? 0 : -200, translateX: width / 2}}
      style={{
        width: width - 40,

        left: '-45%',
      }}
      className={`${bg} rounded-md absolute top-10 px-6 py-3 flex flex-row justify-center items-center z-[100]`}>
      <MaterialIcons
        name={status === 'success' ? 'check-circle' : 'error-outline'}
        size={25}
        color={status === 'success' ? 'black' : 'white'}
      />
      <FontText
        className={`ml-3 text-justify text-base ${text}`}
        weight={'Medium'}>
        {status === 'success'
          ? 'Issue Submitted Successfully!'
          : 'Issue Submission Failed!'}
      </FontText>
    </MotiView>
  );
};

export default Report;
