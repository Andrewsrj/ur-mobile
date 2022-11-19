import { useEffect, useState } from "react";
import avatar from "../../../../components/avatar";
import userService from "../../../../services/UserManager";
import { Avatar, BioText, ButtonText, CollegeName, Container, DescriptionRow, DescriptionText, DisplayName, ImageRow, Rect, Rect2, RectItems,  SubDescriptionText, TouchableButton } from "./styles";


export function Profile() {
    const user = userService.getUser();
    
    useEffect(() => {

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

    return (
      <Container>
        <Rect>
          <RectItems>
            <ImageRow>
              <Avatar
                source={avatar.getAvatar(user.photoURL)}
                resizeMode="contain"
              />
              <DisplayName>{user.displayName}</DisplayName>
              <CollegeName>UERJ/ZO</CollegeName>
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
          <BioText>"A esperança é a última que morre!"</BioText>
        </Rect>
        <Rect2>
          <TouchableButton>
            <ButtonText>Editar</ButtonText>
          </TouchableButton>
          <TouchableButton>
            <ButtonText>Verificar</ButtonText>
          </TouchableButton>
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