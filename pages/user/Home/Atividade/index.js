import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, Dimensions, Image, Platform } from "react-native";
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import avatar from "../../../../components/avatar";
import userService from "../../../../services/UserManager";
import * as Location from "expo-location";
import { Container, SubmitSignButton, SubmitTextSign } from "../../../../components/mainStyle";


const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.004;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// Tempo em milisegundos para pegar localização
const TIME_TO_TRACKING = 1000;
const ANIMATION_TIME_RATIO_ANDROID = 1.13;
const ANIMATION_TIME_RATIO_IOS = 0.83;

export function Atividade({ navigation }) {
  const user = userService.getUser();
  // Posição do Mapa (posição inicial: UERJ/ZO)
  const [currentRegion, setCurrentRegion] = useState({
    latitude: -22.900716623318992,
    longitude: -43.57767133491654,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });
  const userMap = useRef();
  const markerRef = useRef();
  // Estado da corrida (Se foi iniciada ou não)
  const [statusRace, setStatusRace] = useState(false);
  const [state, setState] = useState({
    coordinate: new AnimatedRegion(),
    coordUpdated: false,
  })
  const AnimatedImage = Animated.createAnimatedComponent(Image)

  const { coordinate, coordUpdated } = state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  /**
   * Troca a posição do mapa de acordo com a localização do usuário
   * @param {{latitude: Number, longitude: Number, latitudeDelta: Number, longitudeDelta: Number}} position
   */

  function changeRegion(position) {
    if (position != null) {
      setCurrentRegion(() => {
        userMap.current.animateToRegion({
          longitude: position.longitude,
          latitude: position.latitude,
          latitudeDelta: position.latitudeDelta,
          longitudeDelta: position.longitudeDelta
        }, 1000);
        return {
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: position.latitudeDelta,
          longitudeDelta: position.longitudeDelta
        }
      });
    }
  }
  const verifyPermission = async () => {
    return Location.requestForegroundPermissionsAsync()
      .then(res => {
        if (!res.granted) {
          Alert.alert("Permita a localização!", "Para que o app funcione, você precisa permitir a localização e ativar o GPS");
          return false
        }
        else {
          return true
        }
      })
  }
  const getCurrentPosition = async () => {
    if (verifyPermission) {
      return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 20 })
        .then(res => {
          return {
            latitude: res.coords.latitude,
            longitude: res.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA

          }
        })
        .catch(e => {
          console.log(e)
        });

    }
    else {
      return false
    }

  }
  const getLiveLocation = async () => {
    const { latitude, longitude } = await getCurrentPosition();
    if (latitude && longitude) {
      animateMarker(latitude, longitude);
      updateState({
        coordinate: new AnimatedRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }),
        coordUpdated: true,
      })

    }
  }

  const animateMarker = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude }

    if (Platform.OS == "android") {
      let animationTime = TIME_TO_TRACKING * ANIMATION_TIME_RATIO_ANDROID
      markerRef.current.animateMarkerToCoordinate(newCoordinate, animationTime);
    }
    else {
      let animationTime = TIME_TO_TRACKING * ANIMATION_TIME_RATIO_IOS
      coordinate.timing(newCoordinate, {
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
        duration: 7000
      }).start();
    }

  }

  function goToRun() {
    navigation.reset({
      index: 0,
      routes: [
        { name: "Running", params: { currentRegion: currentRegion } }
      ]
    })
  }

  useEffect(() => {
    // Verifica a permissão de localização do usuário
    if (verifyPermission()) {
      // Captura a localização atual do usuário
      Location.getCurrentPositionAsync({})
        .then(res => {
          changeRegion({
            latitude: res.coords.latitude,
            longitude: res.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          });
        })
        .catch(e => {
          console.log(e)
        });
    }
    const intervalTemp = setInterval(() => {
      getLiveLocation()
    }, TIME_TO_TRACKING);
    return () => clearInterval(intervalTemp)
  }, []);


  return (
    <>
      <Container bottom='0%' width='100%' height='85%'>
        <MapView style={{
          width: "100%",
          height: "100%"
        }}
          initialRegion={currentRegion}
          loadingEnabled
          ref={userMap}
        >
          {coordUpdated &&
            <Marker.Animated
              ref={markerRef}
              coordinate={coordinate}
            >
              <AnimatedImage
                source={avatar.getAvatar(user.photoURL)}
                style={{ height: 20, width: 20, borderWidth: 1, borderColor: "#000000", borderRadius: 30 }}
                resizeMode="contain"
              />
            </Marker.Animated>

          }
        </MapView>
      </Container>
      <Container justify='space-between' bottom='-3%' background width='100%' height='15%'>

        {coordUpdated &&
          <SubmitSignButton onPress={goToRun} width='50%' bottom='0%'>
            <SubmitTextSign>Iniciar</SubmitTextSign>
          </SubmitSignButton>
        }
        {!coordUpdated &&
          <SubmitSignButton width='50%' bottom='1%'>
            <ActivityIndicator size="small" color="#ffffff" />
          </SubmitSignButton>
        }

      </Container>

    </>
  );
}