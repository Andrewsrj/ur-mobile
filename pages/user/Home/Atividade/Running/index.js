import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Image, Platform } from "react-native";
import MapView, { Marker, AnimatedRegion, Polyline } from 'react-native-maps';
import avatar from "../../../../../components/avatar";
import userService from "../../../../../services/UserManager";
import * as Location from "expo-location";
import { Container, MiniContainer, MiniMessage, SubmitSignButton, SubmitTextSign, Title } from "../../../../../components/mainStyle";


const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.004;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// Tempo em milisegundos para pegar localização
const TIME_TO_TRACKING = 3000;
const ANIMATION_TIME_RATIO_ANDROID = 1.13;
const ANIMATION_TIME_RATIO_IOS = 0.83;

export function Running({ route, navigation }) {
    const user = userService.getUser();
    // Posição do Mapa (posição inicial: UERJ/ZO)
    const [currentRegion, setCurrentRegion] = useState(route.params.currentRegion);
    const userMap = useRef();
    const markerRef = useRef();
    // Estado da corrida (Se foi iniciada ou não)
    const [statusRace, setStatusRace] = useState(false);
    const [ready, setReady] = useState(true);
    // Formato String da duração da corrida
    const [timeDurationString, setTimeDurationString] = useState("00:00:00");
    // Formato String do Ritmo min/km
    const [paceString, setPaceString] = useState("00:00")
    // Formato Number da duração da corrida em segundos
    const [timeDuration, setTimeDuration] = useState(0);
    // Formato Number da distância percorrida
    const [distance, setDistance] = useState(0.00);
    // Apenas usadas para cálculos
    let timeTemp = 0, distanceTemp = 0;
    // Referência para o Timer
    const [intervalTimer, setIntervalTimer] = useState(null);
    const [intervalTimerTrack, setIntervalTimerTrack] = useState(null);
    // Vetor com posições para marcação de trajeto no mapa
    const [currentPosition, setCurrentPosition] = useState(new Array());
    const [state, setState] = useState({
        coordinate: new AnimatedRegion({
            latitude: route.params.currentRegion.latitude,
            longitude: route.params.currentRegion.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }),
    })

    const { coordinate } = state
    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const getCurrentPosition = async () => {
        return Location.getCurrentPositionAsync({
            enableHighAccuracy: true,
            accuracy: Location.Accuracy.High,
        })
            .then(res => {
                if (res.coords.accuracy < 15) {
                    return false
                }
                else {
                    return {
                        latitude: res.coords.latitude,
                        longitude: res.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA

                    }
                }
            })
            .catch(e => {
                console.log(e)
            });

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
                })
            })
        }
    }
    const pushCurrentPosition = async () => {
        let { latitude, longitude } = await getCurrentPosition();
        if (latitude && longitude) {
            setCurrentPosition((prevState) => {
                let objPosition = new Array()
                let maxLength = Object.keys(prevState).length
                if (maxLength == 0) {
                    objPosition = new Array({ latitude, longitude })
                    //console.log(maxLength)
                } else {
                    let index = maxLength - 1
                    objPosition = new Array(...prevState)
                    if (prevState[index].latitude !== latitude || prevState[index].longitude !== longitude) {
                        objPosition = new Array(...prevState, { latitude, longitude })
                        setDistance((previousState) => {
                            let coord0 = prevState[index]
                            distanceTemp = previousState + calcDistance([coord0, { latitude, longitude }])
                            return distanceTemp
                        })
                        //console.log(objPosition)
                    }
                }
                return objPosition;
            })
        }
        else {
            console.log("Localização imprecisa!")
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
                duration: animationTime
            }).start();
        }

    }
    /**
     * 
     * @param {{{latitude, longitude},{latitude, longitude}}} arrayPosition - Array com a coordenada inicial e coordenada final
     * @returns {Number} - Retorna a distância em KM
     */
    function calcDistance(arrayPosition) {
        //console.log(arrayPosition[0].latitude, arrayPosition[1].latitude)
        // Inicio dos calculos 1° parte
        var p1 = Math.cos((90 - arrayPosition[0].latitude) * (Math.PI / 180));
        // Inicio dos calculos 2° parte
        var p2 = Math.cos((90 - arrayPosition[1].latitude) * (Math.PI / 180));
        // Inicio dos calculos 3° parte
        var p3 = Math.sin((90 - arrayPosition[0].latitude) * (Math.PI / 180));
        // Inicio dos calculos 4° parte
        var p4 = Math.sin((90 - arrayPosition[1].latitude) * (Math.PI / 180));
        // Inicio dos calculos 5° parte
        var p5 = Math.cos((arrayPosition[0].longitude - arrayPosition[1].longitude) * (Math.PI / 180));

        return ((Math.acos((p1 * p2) + (p3 * p4 * p5)) * 6371) * 1.15);
    }

    function calcPace() {
        let minutes = 0, rounded = 0
        if (distanceTemp > 0) {
            // Passar segundos para minutos
            let mTime = timeTemp / 60
            // Divide o tempo em minutos pela distância
            let res = mTime / distanceTemp;
            // Transforma o resultado em String
            let n = res.toString();
            // Transforma os minutos em Inteiro
            minutes = parseInt(n);
            // Diminui os minutos para obter os segundos
            let seconds = (res - minutes) * 60;
            // Arredonda os segundos
            rounded = Math.round(Math.round(seconds * 10) / 10);
        }
        //console.log(minutes, rounded, timeTemp)
        setPaceString(() => { return minutesSecondsToMs(minutes, rounded) })
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

    function minutesSecondsToMs(min, sec) {
        min = Number(min)
        sec = Number(sec)
        var mDisplay = min < 10 ? "0" + min : min;
        var sDisplay = sec < 10 ? "0" + sec : sec;
        return mDisplay + ":" + sDisplay;
    }

    /**
     * Inicia o contador. Aumentando 1 a cada chamada no timeDuration e timeDurationString
     */

    async function counter() {
        setTimeDuration((prevState) => {
            setTimeDurationString(() => {
                return secondsToHms(prevState + 1);
            });
            timeTemp = prevState + 1
            return timeTemp;
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
            clearInterval(intervalTimerTrack);
            setReady(() => {
                return false
            })
            setStatusRace(() => {
                return false
            });
            // Ir para relatório da corrida!
        }
        else {
            setStatusRace(() => {
                return true
            });
            var oneSecInterval = setInterval(() => {
                counter();
            }, 1000);
            pushCurrentPosition()
            var trackingInterval = setInterval(() => {
                pushCurrentPosition();
                calcPace();
            }, TIME_TO_TRACKING);
            setIntervalTimer(oneSecInterval);
            setIntervalTimerTrack(() => { return trackingInterval });
        }
    }

    useEffect(() => {
        if (ready) {
            startRace()
        }
        const intervalTemp = setInterval(() => {
            getLiveLocation()
        }, TIME_TO_TRACKING);
        return () => clearInterval(intervalTemp)
    }, []);


    return (
        <>
            <Container bottom='0%' width='100%' height='60%'>
                <MapView style={{
                    width: screen.width,
                    height: screen.height - 0.4
                }}
                    initialRegion={currentRegion}
                    loadingEnabled
                    ref={userMap}
                >

                    <Marker.Animated
                        ref={markerRef}
                        coordinate={coordinate}
                    >
                        <Image
                            source={avatar.getAvatar(user.photoURL)}
                            style={{ height: 20, width: 20, borderWidth: 1, borderColor: "#000000", borderRadius: 30 }}
                        />
                    </Marker.Animated>


                    {Object.keys(currentPosition).length > 0 &&
                        <Polyline coordinates={currentPosition} strokeWidth={3} />
                    }
                </MapView>
            </Container>
            <Container justify='space-between' bottom='0%' background width='100%' height='40%'>
                <MiniContainer>

                    <Title bottom='0%' size='40px'>{timeDurationString}</Title>
                    <MiniMessage top='0%'>Duração</MiniMessage>

                    <MiniContainer alignItems='flex-start' flexDirection='row'>
                        <MiniContainer width='50%' flexDirection='column'>
                            <Title bottom='0%'>{parseFloat(distance).toFixed(2)}</Title>
                            <MiniMessage top='0%'>Distância (Km)</MiniMessage>
                        </MiniContainer>

                        <MiniContainer width='50%' flexDirection='column'>
                            <Title bottom='0%'>{paceString}</Title>
                            <MiniMessage top='0%'>Ritmo (min/km)</MiniMessage>
                        </MiniContainer>

                    </MiniContainer>

                </MiniContainer>

                {!statusRace &&
                    <SubmitSignButton width='50%' bottom='1%'>
                        <ActivityIndicator size="small" color="#ffffff" />
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