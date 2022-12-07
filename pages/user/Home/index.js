import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../services/FirebaseService';
import { Atividade } from './Atividade';
import { Profile } from './Profile';
import { Feed } from './Feed';





function Ranking() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Carregando Rankings...</Text>
    </View>
  );
}

function Historic() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Carregando seu Histórico...</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();


function Home({ navigation, route }) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // User is signed out
      navigation.reset({
        index: 0,
        routes: [
          { name: "Signin" }
        ]
      })
    }
  });
  let rotaInicial = "Atividade"
  if (route) {
    if (route.params) {
      if (route.params.initialRoute) {
        rotaInicial = route.params.initialRoute
      }
    }
  }
  return (

    <Tab.Navigator
      initialRouteName={rotaInicial}
      screenOptions={{
        tabBarActiveTintColor: 'blue',
      }}
    >

      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Ranking"
        component={Ranking}
        options={{
          tabBarLabel: 'Ranking',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="trophy" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Atividade"
        component={Atividade}
        options={{
          tabBarLabel: 'Atividade',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart-flash" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Historic"
        component={Historic}
        options={{
          tabBarLabel: 'Histórico',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-box" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default Home;