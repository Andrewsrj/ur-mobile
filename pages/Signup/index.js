import { DismissKeyboard } from "../../components/DismissKeyboard";
import { Container, Header, Img, Input, KeyboardView, MessageError, SubmitSignButton, SubmitTextSign } from "../../components/mainStyle";
import Logo from '../../assets/logo-signup.png';
import { useState } from "react";
import userService from "../../services/UserManager";
import { Alert } from "react-native";



function Signup() {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [name, setName] = useState(null);
    const [errorName, setErrorName] = useState(null);
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorPassword, setErrorPassword] = useState(null);
    // Número mínimo de caracteres do Nome
    const minLengthName = 3;
    // Número mínimo de caracteres da Senha
    const minLengthPass = 6;

    // Saber se está aguardando resposta do servidor 
    const [isWaitingRequest, setWaitingRequest] = useState(false);

    /**
     * Valida e-mail, nome e senha e exibe mensagem na tela no local que estiver o erro
     * @returns boolean (true|false)
     */
    const validar = () => {
        let error = false;
        if(!String(email).toLowerCase().match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            setErrorEmail("Preencha o e-mail de forma válida!");
            error = true;
        }
        if(name == null || name.length < minLengthName) {
            setErrorName("O nome precisa ter ao menos " + minLengthName +" caracteres!");
            error = true;
        }

        if(password == null || password.length < minLengthPass) {
            setErrorPassword("A senha precisa ter ao menos " + minLengthPass +" caracteres!");
            error = true;
        }
        return !error;
    }

    /**
     * Envia para o Firebase a requisição de criar um novo usuário
     */

    const handleSignup = () => {
        // Verifica se não há requisições em andamento
        if(!isWaitingRequest) {
            if(validar()) {
                // Indica que há uma requisição em andamento
                setWaitingRequest(true);
                userService.signup({email: email, password: password, name: name})
                .then(res => {
                    // Indica que não há uma requisição em andamento
                    setWaitingRequest(false);
                    console.log('Usuario cadastrado:', res);
                })
                .catch(error => {
                    setWaitingRequest(false);
                    // Tratamento de erros
                    switch(error.code) {
                        case "auth/email-already-in-use":
                            setErrorEmail("Este e-mail já está cadastrado");
                            break;
                        default:
                            Alert.alert("Erro!", "Algo deu errado. Tente novamente mais tarde!");
                    }

                })
                
            }
        }
    }

    return(
        <DismissKeyboard>
            <KeyboardView behavior={Platform.OS == "ios" ? "padding" : "position"} >
                <Container>
                    <Header top='0.5%'>
                        <Img
                            width='110px'
                            height='122px'
                            source={Logo}
                        />
                    </Header>
                    <Input
                        placeholder="matricula@uezo.edu.br"
                        keyboardType="email-address" 
                        onChangeText={ (value) => { setEmail(value); setErrorEmail()}}
                    />
                    <MessageError>{errorEmail}</MessageError>
                    <Input
                        placeholder="Nome"
                        keyboardType="text" 
                        onChangeText={ (value) => { setName(value); setErrorName()}}
                    />
                    <MessageError>{errorName}</MessageError>
                    <Input
                        placeholder="Senha"
                        secureTextEntry
                        onChangeText={ (value) => { setPassword(value); setErrorPassword()}}
                    />
                    <MessageError>{errorPassword}</MessageError>
                    <SubmitSignButton onPress={() => handleSignup()}>
                        <SubmitTextSign>Registrar</SubmitTextSign>
                    </SubmitSignButton>
                </Container>
            </KeyboardView>
        </DismissKeyboard>
    )
}

export default Signup; 