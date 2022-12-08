import { useEffect, useState } from "react";
import avatar from "../../../../components/avatar";
import userService from "../../../../services/UserManager";
import { Avatar, BioText, ButtonText, CollegeName, Container, DescriptionRow, DescriptionText, DisplayName, ImageRow, Rect, Rect2, RectItems, SubDescriptionText, TouchableButton } from "./styles";


export function Profile({ navigation, route }) {
  const user = userService.getUser();
  const [state, setState] = useState({
    bio: "carregando dados...",
    university: "carregando dados...",
    avatarPic: null,
    displayName: "...",
    selfUser: false,
  })
  const { avatarPic, bio, displayName, university, selfUser } = state

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    let uid
    if(route) {
      if(route.params) {
        uid = route.params.userId?route.params.userId:false
      }
    }
    userService.getDataUser(uid)
      .then((dataUser) => {
        updateState({
          bio: dataUser.db.bio,
          university: dataUser.db.university,
          avatarPic: avatar.getAvatar(dataUser.fb.photoURL),
          displayName: dataUser.fb.displayName,
          selfUser: dataUser.fb.uid==user.uid?true:false
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
      {selfUser &&
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
      }
    </Container>
  );
}