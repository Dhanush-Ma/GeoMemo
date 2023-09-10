import {View, Text, Button} from 'react-native';
import React, {useEffect} from 'react';
import {useUserContext} from '../Contexts/UserContext';
import {useAuthContext} from '../Contexts/AuthContext';
import firestore from '@react-native-firebase/firestore';
import signout from '../Utils/signout';

const UserStack = () => {
  const {user, setUser} = useUserContext();
  const {auth, setAuth} = useAuthContext();

  useEffect(() => {
    const database_subscriber = firestore()
      .collection('Users')
      .doc(auth)
      .onSnapshot(documentSnapshot => {
        console.log('User data: ', documentSnapshot.data());
        setUser(documentSnapshot.data());
      });

    // Stop listening for updates when no longer required
    return () => database_subscriber();
  }, [auth]);

  return (
    <>
      {user && (
        <View>
          <Text className="text-primaryColor">AuthId: {auth}</Text>
          <Text className="text-primaryColor">User: {JSON.stringify(user)}</Text>

          <Button onPress={() => signout(setAuth)} title="SIGNOUT" />
        </View>
      )}
    </>
  );
};

export default UserStack;
