import { DismissKeyboard } from "../../../../../components/DismissKeyboard";
import { Container, Input, KeyboardView, SubmitSignButton, SubmitTextSign } from "../../../../../components/mainStyle";

import { Arrow, ArrowLeft, ArrowRight, ImageBox, ProfileImage } from "./styles";
import avatar from "../../../../../components/avatar"
import { useEffect, useState } from "react";
import userService from "../../../../../services/UserManager";
import { Alert } from "react-native";

export function ProfileEditor({navigation}) {
    const user = userService.getUser();
    const [userAvatar, setUserAvatar] = useState(avatar.getAvatar(user.photoURL))
    const [keyAvatar, setKeyAvatar] = useState(avatar.getKeyAvatarByName(user.photoURL))
    const [userName, setUserName] = useState(user.displayName)
    const [state, setState] = useState({
        bio: null,
        university: null,
    })
    const { bio, university } = state

    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const nextImage = (key) => {
        key++
        if (key >= avatar.getAvatarsLength()) {
            setKeyAvatar(0)
            setUserAvatar(avatar.getAvatarByKey(0))
        }
        else {
            setKeyAvatar(key)
            setUserAvatar(avatar.getAvatarByKey(key))
        }
    }
    const previousImage = (key) => {
        key--
        if (key < 0) {
            setKeyAvatar(avatar.getAvatarsLength() - 1)
            setUserAvatar(avatar.getAvatarByKey(avatar.getAvatarsLength() - 1))
        }
        else {
            setKeyAvatar(key)
            setUserAvatar(avatar.getAvatarByKey(key))
        }
    }
    const saveData = () => {
        const data = {
            photoURL: avatar.getAvatarNameByKey(keyAvatar),
            displayName: userName,
            bio: bio,
            university: university,
        }
        userService.setDataUser(data)
            .then(() => {
                Alert.alert("Sucesso", "Dados salvos com sucesso!")
                navigation.reset({
                    index: 0,
                    routes: [
                        {name: "Home", params: {initialRoute: "Profile"}}
                    ]
                })
            })
            .catch((error) => {
                console.log(error)
                //Alert.alert("Erro", error)
            })
    }
    useEffect(() => {
        userService.getDataUser()
            .then((dataUser) => {
                updateState({
                    bio: dataUser.bio,
                    university: dataUser.university,
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }, []);

    return (
        <DismissKeyboard>
            <KeyboardView behavior={Platform.OS == "ios" ? "padding" : "position"} >

                <Container>

                    <ImageBox>
                        <Arrow onPress={() => previousImage(keyAvatar)} >
                            <ArrowLeft source={require('../../../../../assets/editor/back.png')} />

                        </Arrow>
                        <ProfileImage source={userAvatar} />
                        <Arrow onPress={() => nextImage(keyAvatar)}>
                            <ArrowRight source={require('../../../../../assets/editor/next.png')} />

                        </Arrow>
                    </ImageBox>
                    <Input
                        placeholder="Seu nome"
                        value={userName}
                        onChangeText={(value) => { setUserName(value) }}
                    />
                    <Input
                        placeholder="Conte um pouco mais sobre você..."
                        value={bio}
                        onChangeText={(value) => { updateState({ bio: value }) }}
                    />
                    <Input
                        placeholder="Onde você estuda/estudou?"
                        value={university}
                        onChangeText={(value) => { updateState({ university: value }) }}
                    />
                    <SubmitSignButton onPress={() => saveData()}>
                        <SubmitTextSign>Salvar</SubmitTextSign>
                    </SubmitSignButton>
                </Container>
            </KeyboardView>
        </DismissKeyboard>
    );
}