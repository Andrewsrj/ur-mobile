import { useEffect, useState } from "react";
import avatar from "../../../../components/avatar";
import userService from "../../../../services/UserManager";
import { Avatar, BioText, ButtonText, CollegeName, Container, DescriptionRow, DescriptionText, DisplayName, ImageRow, Rect, Rect2, RectItems, SubDescriptionText, TouchableButton } from "./styles";


export function Profile({ navigation }) {
  const user = userService.getUser();
  const [state, setState] = useState({
    bio: "carregando dados...",
    university: "carregando dados...",
    avatarPic: null,
    displayName: "...",
  })
  const { avatarPic, bio, displayName, university } = state

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    userService.getDataUser()
      .then((dataUser) => {
        updateState({
          bio: dataUser.bio,
          university: dataUser.university,
          avatarPic: avatar.getAvatar(dataUser.photoURL),
          displayName: dataUser.displayName,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }, []);

  /**
   * Remove a autenticação de um usuário
   */
  const handleSignout = () => {
    userService.signout()
      .then()
      .catch(error => {
        console.log(error);
      })
  }

  const editProfile = () => {
    navigation.navigate("ProfileEditor");
  }

  return (
    <Container>
      <Rect>
        <RectItems>
          <ImageRow>
            <Avatar
              source={avatarPic}
              resizeMode="contain"
            />
            <DisplayName>{displayName}</DisplayName>
            <CollegeName>{university}</CollegeName>
          </ImageRow>
          <DescriptionRow>
            <DescriptionText>000</DescriptionText>
            <SubDescriptionText>Kms</SubDescriptionText>
          </DescriptionRow>
          <DescriptionRow>
            <DescriptionText>000</DescriptionText>
            <SubDescriptionText>Atividades</SubDescriptionText>
          </DescriptionRow>
          <DescriptionRow>
            <DescriptionText>000</DescriptionText>
            <SubDescriptionText>Conquistas</SubDescriptionText>
          </DescriptionRow>
        </RectItems>
        <BioText>"{bio}"</BioText>
      </Rect>
      <Rect2>
        <TouchableButton onPress={editProfile}>
          <ButtonText>Editar</ButtonText>
        </TouchableButton>
        {!user.verified &&
          <TouchableButton>
            <ButtonText>Verificar</ButtonText>
          </TouchableButton>
        }
        <TouchableButton>
          <ButtonText>Conquistas</ButtonText>
        </TouchableButton>
        <TouchableButton onPress={handleSignout}>
          <ButtonText>Sair</ButtonText>
        </TouchableButton>
      </Rect2>
    </Container>
  );
}