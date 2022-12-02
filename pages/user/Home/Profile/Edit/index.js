import { DismissKeyboard } from "../../../../../components/DismissKeyboard";
import { KeyboardView } from "../../../../../components/mainStyle";
import { Container } from "../styles";
import { Arrow, ArrowLeft, ArrowRight, ImageBox, ProfileImage } from "./styles";
import avatar from "../../../../../components/avatar"
import { useState } from "react";
import userService from "../../../../../services/UserManager";

export function ProfileEditor() {
    const user = userService.getUser();
    const [userAvatar, setUserAvatar] = useState(avatar.getAvatar(user.photoURL))
    const [keyAvatar, setKeyAvatar] = useState(avatar.getKeyAvatarByName(user.photoURL))
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

                </Container>
            </KeyboardView>
        </DismissKeyboard>
    );
}