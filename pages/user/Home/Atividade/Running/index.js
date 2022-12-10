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
const MIN_ACCURACY = 7;
// Tempo em milisegundos para pegar localização
const TIME_TO_TRACKING = 2000;
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
    const [intervalTracker, setIntervalTracker] = useState(null);
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
                    if(res.coords.latitude&&res.coords.longitude) {
                        //console.log(res.coords.latitude, res.coords.longitude)
                        return {
                            latitude: res.coords.latitude,
                            longitude: res.coords.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA
    
                        }
                    }
                    else {
                        return false
                    }

                })
                .catch(e => {
                    console.log(e)
                    return false
                });

        }
        else {
            return false
        }

    }
    const setLiveLocation = (latitude, longitude) => {
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
            setLiveLocation(latitude, longitude)
            setCurrentPosition((prevState) => {
                let objPosition = new Array()
                let maxLength = Object.keys(prevState).length
                console.log("Tamanho Array:", maxLength)
                console.log(prevState)
                if (maxLength == 0) {
                    objPosition = new Array({ latitude, longitude })
                    
                } else {
                    let index = maxLength - 1
                    objPosition = new Array(...prevState)
                    if (objPosition[index].latitude != latitude || objPosition[index].longitude != longitude) {
                        objPosition = new Array(...prevState, { latitude, longitude })
                        setDistance((previousState) => {
                            let coord0 = objPosition[index]
                            let coord1 = objPosition[index+1]
                            distanceTemp = previousState + calcDistance([coord0, coord1])
                            //console.log("Ant:", coord0, " Atual:", latitude, longitude)
                            console.log("Distancia percorrida:",calcDistance([coord0, { latitude, longitude }]))
                            console.log("Distancia atual:", distanceTemp)
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
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(arrayPosition[1].latitude - arrayPosition[0].latitude);  // deg2rad below
        var dLon = deg2rad(arrayPosition[1].longitude - arrayPosition[0].longitude);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(arrayPosition[0].latitude)) * Math.cos(deg2rad(arrayPosition[1].latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
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
            startTracking()
            var trackingInterval = setInterval(() => {
                pushCurrentPosition();
                calcPace();
            }, TIME_TO_TRACKING);
            setIntervalTimer(oneSecInterval);
            setIntervalTimerTrack(() => { return trackingInterval });
        }
    }
    function startTracking() {
        clearInterval(intervalTracker);
        /*const intervalTemp = setInterval(() => {
            getLiveLocation()
        }, TIME_TO_TRACKING);
        setIntervalTracker(() => { return intervalTemp }) */
        return true;
    }

    useEffect(() => {
        if (ready) {
            startRace()
        }
    }, []);


    return (
        <>
            <Container bottom='0%' width='100%' height='60%'>
                <MapView style={{
                    width: "100%",
                    height: "100%"
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
                            style={{ height: 30, width: 30, borderWidth: 2, borderColor: "#fff", borderRadius: 30 }}
                        />
                    </Marker.Animated>


                    {Object.keys(currentPosition).length > 0 &&
                        <Polyline coordinates={currentPosition} strokeWidth={5} />
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