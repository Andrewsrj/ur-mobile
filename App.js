import { StatusBar } from 'expo-status-bar';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Home from './pages/user/Home';
import Recovery from './pages/Recovery';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileEditor } from './pages/user/Home/Profile/Edit';
import { Running } from './pages/user/Home/Atividade/Running';
import { Profile } from './pages/user/Home/Profile'
import { Record } from './pages/user/Home/Record';


const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Signin" component={Signin} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={Signup} options={{ title: 'Registrar' }} /> 
          <Stack.Screen name="Recovery" component={Recovery} options={{ title: 'Recuperar Senha'}} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Running" component={Running} options={{ headerShown: false}} />
          <Stack.Screen name="Record" component={Record} options={{ title: 'Relatório de Corrida'}} />
          <Stack.Screen name="ProfileEditor" component={ProfileEditor} options={{ title: 'Editar Perfil'}} />
          <Stack.Screen name="ViewProfile" component={Profile} options={{ title: 'Visualizar Perfil'}} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
}

