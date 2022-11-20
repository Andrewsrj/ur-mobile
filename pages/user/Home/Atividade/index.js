import { useEffect, useState } from "react";
import { Alert, Dimensions} from "react-native";
import MapView from 'react-native-maps';
import * as Location from "expo-location";
import { Container, MiniContainer, MiniMessage, SubmitSignButton, SubmitTextSign, Title } from "../../../../components/mainStyle";




export function Atividade() {
  // Posição do Mapa (posição inicial: UERJ/ZO)
  const [currentRegion, setCurrentRegion] = useState({
    latitude: -22.900716623318992,
    longitude: -43.57767133491654,
    latitudeDelta: 0.00014,
    longitudeDelta: 0.00014
  });
  const [currentPosition, setCurrentPosition] = useState(null);
  const [statusRace, setStatusRace] = useState(false);
  const [timeDurationString, setTimeDurationString] = useState("00:00:00");
  const [timeDuration, setTimeDuration] = useState(0);
  const [intervalTimer, setIntervalTimer] = useState(null);

  /**
   * Troca a posição do mapa de acordo com a movimentação do usuário
   * @param {Object} position 
   */
  
  function changeRegion(position) {
    if(position != null && !statusRace) {
      setCurrentRegion(() => {
        return {
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
      }});
    }
  }
  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h < 10 ? "0"+h:h ;
    var mDisplay = m < 10 ? "0"+m:m;
    var sDisplay = s < 10 ? "0"+s:s;
    return hDisplay + ":" + mDisplay + ":" + sDisplay; 
  }

  async function counter() {
    setTimeDuration((prevState) => {
      setTimeDurationString(() => {
        return secondsToHms(prevState+1);
      });
      return prevState+1;
    })
    
  }
  function startRace() {
    if(statusRace) {
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
    Location.requestForegroundPermissionsAsync()
    .then(res => {
      if(!res.granted) {
        Alert.alert("Permita a localização!", "Você precisa permitir compartilhar sua localização para que o app funcione corretamente!");
      }
      else {
        // Captura a localização atual do usuário
        Location.getCurrentPositionAsync({})
        .then(res => {
          changeRegion({
            latitude: res.coords.latitude,
            longitude: res.coords.longitude,
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





  }, []);

  
  return (
    <>
    <Container bottom='0%' width='100%' height='60%'>
      {statusRace&&
        <MapView style={{  
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').width }}
            showsUserLocation
            followsUserLocation
            loadingEnabled
          />
      
      }
      {!statusRace&&
        <MapView style={{  
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').width }}
          showsUserLocation
          region={currentRegion}
          loadingEnabled
        />
      }
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
      
      { !statusRace &&
        <SubmitSignButton onPress={startRace} width='50%' bottom='1%'>
          <SubmitTextSign>Iniciar</SubmitTextSign>
        </SubmitSignButton>
      }
      { statusRace &&
        <SubmitSignButton onPress={startRace} width='50%' bottom='1%'>
          <SubmitTextSign>Encerrar</SubmitTextSign>
        </SubmitSignButton>
      }
      
    </Container>
    
    </>
  );
}