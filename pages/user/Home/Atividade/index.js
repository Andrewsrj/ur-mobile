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
  const [statusRace, setStatusRace] = useState(false);

  /**
   * Troca a posição do mapa de acordo com a movimentação do usuário
   * @param {Object} position 
   */
  
  function changeRegion(position) {
    if(position != null) {
      setCurrentRegion({
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.00012,
        longitudeDelta: 0.00012
      });
    }
  }
  function startRace() {
    if(statusRace) {
      setStatusRace(false);
    }
    else {
      setStatusRace(true);

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
            latitudeDelta: 0.00012,
            longitudeDelta: 0.00012
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
      <MapView style={{  
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').width }}
          region={currentRegion}
          showsUserLocation
          followsUserLocation
          loadingEnabled
        />
    </Container>
    <Container justify='space-between' bottom='0%' background width='100%' height='40%'>
      <MiniContainer>

        <Title bottom='0%' size='40px'>00:00:00</Title>
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