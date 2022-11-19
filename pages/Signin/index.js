import {KeyboardView, Container, Header, Img, Title, Input, MiniMessage, MessageError, Destaque, SubmitSignButton, SubmitTextSign} from '../../components/mainStyle';
import { useState } from 'react';
import Logo from '../../assets/logo-login.png';
import { DismissKeyboard } from '../../components/DismissKeyboard';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebaseConnection';
import userService from '../../services/UserManager';


function Signin({navigation}) {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorPassword, setErrorPassword] = useState(null);
    
    // Saber se está aguardando resposta do servidor 
    const [isWaitingRequest, setWaitingRequest] = useState(false);


    /**
     * Encaminhador para a página Home
     */
     const goToHome = () => {
        navigation.reset({
            index: 0,
            routes: [
                {name: "Home"}
            ]
        })
    }

    /**
     * Encaminha o usuário para a página Home se já estiver autenticado.
     */

    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          
          // Redirecionamento para a página Home
          goToHome();
        }
      });

    /**
     * Valida e-mail e senha e exibe mensagem na tela no local que estiver o erro
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
        if(password == null || password.length < 6) {
            setErrorPassword("A senha precisa ter ao menos 6 caracteres!");
            error = true;
        }
        return !error;
    }
    /**
     * Encaminhador para a página de Registro
     */
    const signup = () => {
        navigation.navigate("Signup");
    }

    /**
     * Encaminhador para a página de Recuperação de senha
     */
    const forgotPassword = () => {
        navigation.navigate("Recovery");

    }

    /**
     * Envia para o Firebase a requisição de autenticar usuário
     */

    const handleSignin = () => {
        // Verifica se não há alguma requisição em andamento
        if(!isWaitingRequest) {
            // Valida e-mail e senha
            if(validar()) {
                // Indica que há uma requisição em andamento
                setWaitingRequest(true);
                userService.sign({email: email, password: password})
                .then(() => {
                    setWaitingRequest(false);
                    goToHome();
                })
                .catch(error => {
                    // Indica que não há mais uma requisição em andamento
                    setWaitingRequest(false);
                    
                    // Tratamento de erros
                    switch(error.code) {
                        case "auth/user-not-found":
                            setErrorEmail("E-mail ainda não cadastrado!");
                            break;
                        case "auth/wrong-password":
                            setErrorPassword("Senha incorreta!");
                            break;
                        default:
                            setErrorPassword("Ops! Algo deu errado. Tente novamente mais tarde!");
                    }
                    console.log(error);
                })
                
            }
        }
    }
    //
    return(
        <DismissKeyboard>
            <KeyboardView behavior={Platform.OS == "ios" ? "padding" : "position"} >
                
                <Container>
                    <Header>
                        <Img
                        source={Logo}
                        />
                    </Header>
                    <Title>U-Running Login</Title>
                    <Input 
                        placeholder="matricula@uezo.edu.br"
                        keyboardType="email-address"
                        onChangeText={ (value) => { setEmail(value); setErrorEmail()}}
                    />
                    <MessageError>{errorEmail}</MessageError>
                    <Input 
                        placeholder="Senha"
                        onChangeText={ (value) => { setPassword(value); setErrorPassword()}}
                        secureTextEntry
                    />
                    <MessageError>{errorPassword}</MessageError>
                    <SubmitSignButton onPress={() => handleSignin()}>
                        <SubmitTextSign>Entrar</SubmitTextSign>
                    </SubmitSignButton>
                    <MiniMessage><Destaque underline onPress={() => forgotPassword()}>Esqueceu sua senha?</Destaque></MiniMessage>
                    <MiniMessage>Primeira vez aqui? <Destaque underline onPress={() => signup()}>Registre-se</Destaque></MiniMessage>
                </Container>
            
            </KeyboardView>
        </DismissKeyboard>
    )
}

export default Signin;