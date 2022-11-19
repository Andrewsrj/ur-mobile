import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import avatar from "../../../../components/avatar";
import userService from "../../../../services/UserManager";


export function Profile() {
    const user = userService.getUser();
    
    useEffect(() => {

    }, []);

    /**
     * Remove a autenticação de um usuário
     */
    const handleSignout = () => {
        userService.signout()
        .then()
        .catch(error => {
          console.log(error);
        })
      }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={avatar.getAvatar(user.photoURL)}
          style={{width: 32, height: 32}}
        />
        <Text>Olá, {user.displayName}</Text>
        <TouchableOpacity onPress={handleSignout}><Text>Sair!</Text></TouchableOpacity>
      </View>
    );
  }