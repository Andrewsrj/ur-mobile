import { FlatList, Text, View } from "react-native";
import { Avatar, Description, DescriptionBox, DescriptionMiniText, DescriptionText, Header, MapImage, MiniHeader, Name, Post, PostImage, ReactBar, ReactBox, Time } from "./styles";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import avatar from "../../../../components/avatar";
import feed from "../../../../services/FeedManager";
import { useEffect, useState } from "react";
import userService from "../../../../services/UserManager";
// Temp
const mapImage = require('../../../../assets/defaultmap.jpg');
// --


export function Feed() {
    const [feedContent, setFeedContent] = useState([]);
    const user = userService.getUser();
    useEffect(() => {
        async function loadFeed() {
            const tokenId = await user.getIdToken(true)
            // Puxar dados do Service para preencher o Feed
            const data = await feed.loadFeed(tokenId);
            setFeedContent(await data);
        }

        loadFeed();
    }, []);

    return (
        <View>
            {Object.keys(feedContent).length > 0 &&
                <FlatList
                    data={feedContent}
                    keyExtractor={post => String(post.id)}
                    renderItem={({ item }) => (

                        <Post>
                            <Header>
                                <Avatar verified={item.author.verified} source={avatar.getAvatar(item.author.image)} />
                                <MiniHeader>
                                    <Name>{item.author.name}</Name>
                                    <Time>{item.date}</Time>
                                </MiniHeader>
                            </Header>
                            <DescriptionBox>
                                <Description>
                                    <DescriptionText>{item.distance}</DescriptionText>
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
                                <MapImage source={mapImage} />
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
                <Text>No Connection</Text>
            }
        </View>
    );
}