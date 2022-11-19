import Logo from '../../assets/shoes.png';
import {Alert} from 'react-native';
import { DismissKeyboard } from '../../components/DismissKeyboard';
import { Container, Header, Img, Input, KeyboardView, MessageError, SubmitSignButton, SubmitTextSign } from '../../components/mainStyle';
import { useState } from 'react';
import userService from '../../services/UserManager';

function Recovery() {
    const [email, setEmail] = useState(null);
    const [errorEmail, setErrorEmail] = useState(null);

    // Saber se está aguardando resposta do servidor 
    const [isWaitingRequest, setWaitingRequest] = useState(false);

    /**
     * Valida se o e-mail é válido
     * 
     * @returns boolean (true|false)
     */

    const validar = () => {
        if(!String(email).toLowerCase().match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            setErrorEmail("Preencha o e-mail de forma válida!");
            return false;
        }
        return true;
    }

    /**
     *  Envia para o Firebase a requisição de recuperar senha
     */

    const handleRecovery = () => {
        // Verifica se há uma requisição em andamento
        if(!isWaitingRequest) {
            // Valida o e-mail
            if(validar()) {
                // Indica que há uma requisição em andamento
                setWaitingRequest(true);
                userService.recovery(email)
                .then((res) => {
                    Alert.alert(res.title, res.msg);
                    setWaitingRequest(false);
                })
                .catch(error => {
                    setWaitingRequest(false);
                    console.log(error.message);
                })
                
            }
        }
    }

    return(
        <DismissKeyboard>
            <KeyboardView behavior={Platform.OS == "ios" ? "padding" : "position"} >
                <Container>
                    <Header>
                        <Img
                            source={Logo}
                        />
                    </Header>
                    <Input
                        placeholder="matricula@uezo.edu.br"
                        keyboardType="email-address" 
                        onChangeText={ (value) => { setEmail(value); setErrorEmail()}}
                    />
                    <MessageError>{errorEmail}</MessageError>
                    <SubmitSignButton onPress={() => handleRecovery()}>
                        <SubmitTextSign>Enviar e-mail!</SubmitTextSign>
                    </SubmitSignButton>
                </Container>
            </KeyboardView>
        </DismissKeyboard>
    )
}

export default Recovery;