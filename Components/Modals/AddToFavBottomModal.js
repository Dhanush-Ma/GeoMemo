import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import FontText from '../FontText';
import {useUserContext} from '../../Contexts/UserContext';
import {useState} from 'react';
import {firebase} from '@react-native-firebase/firestore';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';

const AddToFavBottomModal = () => {
  const {coords, user, addToFavModal} = useUserContext();
  const {addToFavModalRef, handleAddToFavModal} = addToFavModal;
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    Keyboard.dismiss();
    if (name) {
      setLoading(true);
      await firebase
        .firestore()
        .collection('Users')
        .doc(user.uid)
        .update({
          favorites: firebase.firestore.FieldValue.arrayUnion({
            name: name,
            coords: coords,
            timestamp: Date.now(),
          }),
        });

      setTimeout(() => {
        setLoading(false);
        setName('');
        handleAddToFavModal(addToFavModalRef, 'close');
      }, 2000);
    }
  };

  return (
    <KeyboardAvoidingView className="bg-primaryColor  p-7 rounded-xl justify-center items-center pb-24">
      <FontText weight="Medium" className="text-center text-2xl mb-4">
        Give it a name
      </FontText>

      <TextInput
        onChangeText={text => setName(text)}
        className="text-textColor border-2 border-accentColor2 rounded-md px-3 w-full h-18"
        cursorColor={'white'}
        style={[{fontFamily: `Montserrat-Medium`}]}
        placeholder="eg: Home"
        placeholderTextColor="gray"
        maxLength={200}
        keyboardType="default"
        autoFocus
      />
      <Pressable
        onPress={handlePress}
        className="bg-accentColor2 rounded-md mt-5 p-3 w-full h-[55px] flex justify-center items-center">
        {loading ? (
          <ActivityIndicator color="white" size={25} />
        ) : (
          <FontText
            weight="Medium"
            className="text-center text-2xl tracking-widest">
            ADD TO FAVOURITES
          </FontText>
        )}
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default AddToFavBottomModal;
