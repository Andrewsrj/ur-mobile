import { Dimensions, FlatList, Text, View } from "react-native";
import { Avatar, Clickable, Description, DescriptionBox, DescriptionMiniText, DescriptionText, Header, MapImage, MiniHeader, Name, Post, PostImage, ReactBar, ReactBox, Time } from "./styles";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import avatar from "../../../../components/avatar";
import feed from "../../../../services/FeedManager";
import { useEffect, useState } from "react";
import userService from "../../../../services/UserManager";
import MapView, { Polyline } from "react-native-maps";
// Temp
const mapImage = require('../../../../assets/defaultmap.jpg');
// --


export function Feed({ navigation }) {
    const [feedContent, setFeedContent] = useState([]);
    const user = userService.getUser();
    const screen = Dimensions.get('window');
    const ASPECT_RATIO = screen.width / screen.height;
    const LATITUDE_DELTA = 0.00004;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
    useEffect(() => {
        async function loadFeed() {
            const tokenId = await user.getIdToken(true)
            // Puxar dados do Service para preencher o Feed
            const data = await feed.loadFeed(tokenId);
            setFeedContent(await data);
        }

        loadFeed();
    }, []);
    const viewProfile = (uid) => {
        navigation.navigate("ViewProfile", { userId: uid });
    }

    return (
        <View>
            {Object.keys(feedContent).length > 0 &&
                <FlatList
                    data={feedContent}
                    keyExtractor={post => String(post.id)}
                    renderItem={({ item }) => (
                        <Post>
                            <Clickable onPress={() => viewProfile(item.author.id)}>
                                <Header>
                                    <Avatar verified={item.author.verified} source={avatar.getAvatar(item.author.image)} />
                                    <MiniHeader>
                                        <Name>{item.author.name}</Name>
                                        <Time>{(new Date(item.date)).getHours()}:{(new Date(item.date)).getMinutes()}:{(new Date(item.date)).getSeconds()} - {(new Date(item.date)).getDate()}/{(new Date(item.date)).getMonth() + 1}/{(new Date(item.date)).getFullYear()}</Time>
                                    </MiniHeader>
                                </Header>

                            </Clickable>
                            <DescriptionBox>
                                <Description>
                                    <DescriptionText>{item.distance} Km</DescriptionText>
                                    <DescriptionMiniText>Distância</DescriptionMiniText>
                                </Description>
                                <Description>
                                    <DescriptionText>{item.duration}</DescriptionText>
                                    <DescriptionMiniText>Tempo</DescriptionMiniText>
                                </Description>
                                <Description>
                                    <DescriptionText>{item.pace} min/km</DescriptionText>
                                    <DescriptionMiniText>Ritmo</DescriptionMiniText>
                                </Description>
                            </DescriptionBox>
                            <PostImage>
                                <MapView style={{
                                    width: '95%',
                                    height: 250,
                                    borderRadius: 25
                                }}
                                    showsPointsOfInterest={false}
                                    showsBuildings={false}
                                    zoomEnabled={false}
                                    rotateEnabled={false}
                                    scrollEnabled={false}
                                    pitchEnabled={false}
                                    toolbarEnabled={false}
                                    cacheEnabled={true}
                                    initialRegion={
                                        {
                                            latitude: item.mapCoordinate[0].latitude,
                                            longitude: item.mapCoordinate[0].longitude,
                                            latitudeDelta: LATITUDE_DELTA,
                                            longitudeDelta: LONGITUDE_DELTA
                                        }
                                    } >
                                    <Polyline coordinates={item.mapCoordinate} strokeWidth={3} />
                                </MapView>
                            </PostImage>
                            <DescriptionBox>
                                <ReactBar>
                                    <ReactBox>
                                        <MaterialCommunityIcons name="heart" size='30' />
                                        <DescriptionText>{item.likes}</DescriptionText>
                                    </ReactBox>
                                    <ReactBox>
                                        <MaterialCommunityIcons name="message" size='30' />
                                        <DescriptionText>{item.comments}</DescriptionText>
                                    </ReactBox>
                                </ReactBar>
                            </DescriptionBox>
                        </Post>

                    )} />

            }
            {Object.keys(feedContent).length < 1 &&
                <Text>Waiting Connection</Text>
            }
        </View>
    );
}