import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import {ScrollView, FlatList} from 'react-native-gesture-handler';
import FontText from '../FontText';
import {useState, useMemo} from 'react';

const Contacts = ({data, onChange, setShowContacts, value}) => {
  const [searchText, setSearchText] = useState('');
  const {height} = useWindowDimensions();
  const filteredContacts = useMemo(
    () =>
      data.filter(
        item =>
          item.displayName.toLowerCase().includes(searchText.toLowerCase()),
        [searchText],
      ),
    [searchText],
  );

  return (
    <KeyboardAvoidingView
     
      style={{height: height * 0.7}}
      className="absolute top-20 w-full z-30 bg-secondaryColor">
      <TextInput
        onChangeText={text => setSearchText(text)}
        value={searchText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        placeholder="Search..."
        caretHidden
        placeholderTextColor={'#FFF'}
        className="bg-secondaryColor1 rounded-md px-5 text-white mb-2 text-lg"
      />
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={filteredContacts}
        renderItem={({item}) => (
          <Item
            item={item}
            onChange={onChange}
            setShowContacts={setShowContacts}
            value={value}
          />
        )}
      />
    </KeyboardAvoidingView>
  );
};

const Item = ({item, onChange, setShowContacts, value}) => {
  const {displayName, phoneNumber} = item;
  return (
    <Pressable
      onPress={() => {
        setShowContacts(false);
        onChange(item);
      }}
      className="p-3 py-4"
      style={{
        backgroundColor:
          value.displayName === item.displayName &&
          value.phoneNumber === item.phoneNumber
            ? '#202020'
            : '#8766eb',
      }}>
      <FontText weight={'Medium'}>{`${displayName} (${phoneNumber})`}</FontText>
    </Pressable>
  );
};

export default Contacts;
