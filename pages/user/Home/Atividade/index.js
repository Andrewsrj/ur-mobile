import { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Image, Platform } from "react-native";
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import avatar from "../../../../components/avatar";
import userService from "../../../../services/UserManager";
import * as Location from "expo-location";
import { Container, MiniContainer, MiniMessage, SubmitSignButton, SubmitTextSign, Title } from "../../../../components/mainStyle";


const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.004;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export function Atividade() {
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
  // Array com as posições percorridas pelo usuário
  const [currentPosition, setCurrentPosition] = useState({});
  const [currentPositionAnimated, setCurrentPositionAnimated] = useState({
    coordinates: new AnimatedRegion({
      latitude: -22.900716623318992,
      longitude: -43.57767133491654,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    })
  });
  // Estado da corrida (Se foi iniciada ou não)
  const [statusRace, setStatusRace] = useState(false);
  // Formato String da duração da corrida
  const [timeDurationString, setTimeDurationString] = useState("00:00:00");
  // Formato Number da duração da corrida em segundos
  const [timeDuration, setTimeDuration] = useState(0);
  // Referência para o Timer
  const [intervalTimer, setIntervalTimer] = useState(null);

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
        getLiveLocation()
        return {
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: position.latitudeDelta,
          longitudeDelta: position.longitudeDelta
        }
      });
    }
  }
  const getCurrentPosition = async () => {
    return Location.getCurrentPositionAsync({})
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
  const getLiveLocation = async () => {
    const position = await getCurrentPosition();
    setCurrentPositionAnimated(() => {
      setCurrentPosition(() => {
        return {
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: position.latitudeDelta,
          longitudeDelta: position.longitudeDelta
        }
      })
      return {
        coordinates: new AnimatedRegion({
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: position.latitudeDelta,
          longitudeDelta: position.longitudeDelta
        })
      }
    })
    animateMarker(position.latitude, position.longitude)
  }
  const animateMarker = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude }

    if (Platform.OS == "android") {
      markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
    }
    else {
      currentPositionAnimated.coordinates.timing(newCoordinate, {duration: 100}).start();
    }

  }
  /**
   * 
   * @param {{{latitude, longitude},{latitude, longitude}}} arrayPosition - Array com a coordenada inicial e coordenada final
   * @returns {Number} - Retorna a distância em KM
   */
  function calcDistance(arrayPosition) {
    // Inicio dos calculos 1° parte
    var p1 = Math.cos((90 - arrayPosition.latitude[0]) * (Math.PI / 180));
    // Inicio dos calculos 2° parte
    var p2 = Math.cos((90 - arrayPosition.latitude[1]) * (Math.PI / 180));
    // Inicio dos calculos 3° parte
    var p3 = Math.sin((90 - arrayPosition.latitude[0]) * (Math.PI / 180));
    // Inicio dos calculos 4° parte
    var p4 = Math.sin((90 - arrayPosition.latitude[1]) * (Math.PI / 180));
    // Inicio dos calculos 5° parte
    var p5 = Math.cos((arrayPosition.longitude[0] - arrayPosition.longitude[1]) * (Math.PI / 180));

    return ((Math.acos((p1 * p2) + (p3 * p4 * p5)) * 6371) * 1.15);
  }

  /**
   * 
   * @param {Number} d - Número em segundos do tempo
   * @returns {String} - Retorna uma String no formato hh:mm:ss
   */
  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h < 10 ? "0" + h : h;
    var mDisplay = m < 10 ? "0" + m : m;
    var sDisplay = s < 10 ? "0" + s : s;
    return hDisplay + ":" + mDisplay + ":" + sDisplay;
  }

  /**
   * Inicia o contador. Aumentando 1 a cada chamada no timeDuration e timeDurationString
   */

  async function counter() {
    setTimeDuration((prevState) => {
      setTimeDurationString(() => {
        return secondsToHms(prevState + 1);
      });
      return prevState + 1;
    })

  }

  /**
   * Altera o estado da corrida. Encerra caso tenha uma em andamento, se não, inicia uma nova corrida
   * (Obs: Falta enviar os dados para o Service ao finalizar uma corrida)
   * Dados a ser enviados: currentPosition, timeDuration, timeDurationString
   */
  function startRace() {
    if (statusRace) {
      clearInterval(intervalTimer);
      setStatusRace(false);
    }
    else {
      setStatusRace(true);
      var oneSecInterval = setInterval(() => {
        counter();
      }, 1000);
      setIntervalTimer(oneSecInterval);
    }
  }

  useEffect(() => {
    // Verifica a permissão de localização do usuário
    Location.requestForegroundPermissionsAsync()
      .then(res => {
        if (!res.granted) {
          Alert.alert("Permita a localização!", "Você precisa permitir compartilhar sua localização para que o app funcione corretamente!");
        }
        else {
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
      })
      .catch(error => {
        console.log(error);
      })
    const intervalTemp = setInterval(() => {
      getLiveLocation()
    }, 6000);
    return () => clearInterval(intervalTemp)
  }, []);


  return (
    <>
      <Container bottom='0%' width='100%' height='60%'>
        <MapView style={{
          width: screen.width,
          height: screen.height-0.4
        }}
          initialRegion={currentRegion}
          loadingEnabled
          ref={userMap}
        >
          {Object.keys(currentPosition).length > 0 &&
            <Marker.Animated
              ref={markerRef}
              coordinate={currentPositionAnimated.coordinates}
            >
              <Image
                source={avatar.getAvatar(user.photoURL)}
                style={{ height: 20, width: 20, borderWidth: 1, borderColor: "#000000", borderRadius: 30 }}
              />
            </Marker.Animated>

          }
        </MapView>
      </Container>
      <Container justify='space-between' bottom='0%' background width='100%' height='40%'>
        <MiniContainer>

          <Title bottom='0%' size='40px'>{timeDurationString}</Title>
          <MiniMessage top='0%'>Duração</MiniMessage>

          <MiniContainer alignItems='flex-start' flexDirection='row'>
            <MiniContainer width='50%' flexDirection='column'>
              <Title bottom='0%'>0,00</Title>
              <MiniMessage top='0%'>Distância</MiniMessage>
            </MiniContainer>

            <MiniContainer width='50%' flexDirection='column'>
              <Title bottom='0%'>00:00</Title>
              <MiniMessage top='0%'>Ritmo (min/km)</MiniMessage>
            </MiniContainer>

          </MiniContainer>

        </MiniContainer>

        {!statusRace &&
          <SubmitSignButton onPress={startRace} width='50%' bottom='1%'>
            <SubmitTextSign>Iniciar</SubmitTextSign>
          </SubmitSignButton>
        }
        {statusRace &&
          <SubmitSignButton onPress={startRace} width='50%' bottom='1%'>
            <SubmitTextSign>Encerrar</SubmitTextSign>
          </SubmitSignButton>
        }

      </Container>

    </>
  );
}