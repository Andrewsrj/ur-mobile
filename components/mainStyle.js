import styled from 'styled-components/native';

export const KeyboardView = styled.KeyboardAvoidingView`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: #f7f7f7;
`
export const Container = styled.View`
    background-color: ${(props) => props.background ? '#FFF' : 'none' };
    align-items: center;
    justify-content: ${(props) => props.justify ? props.justify : 'center' };
    padding-bottom: ${(props) => props.bottom || '10%'};
    width: ${(props) => props.width || '90%'};
    height: ${(props) => props.height ? props.height : '100%' };
`

export const Box = styled.View`
    flex: 1;
    justifyContent: 'center';
    alignItems: 'center';
`

export const Header = styled.View`
    margin-top: ${(props) => props.top || '20%'};
    padding: ${(props) => props.padding || '0.5%'};
`

export const Img = styled.Image`
    width: ${(props) => props.width || '130px'};
    height: ${(props) => props.height || '142px'};
`

export const Title = styled.Text`
    flexGrow: 1;
    color: blue;
    fontSize: ${(props) => props.size || '26px'};
    font-weight: ${(props) => props.fontWeight || '700'};
    margin-bottom: ${(props) => props.bottom || '5%'};
`

export const Input = styled.TextInput`
    align-self: center;
    border: 2px solid blue;
    padding: ${(props) => props.padding || '5% 5%'};
    color: blue;
    fontSize: ${(props) => props.size || '20px'};
    border-radius: ${(props) => props.radius || '9px'};
    width: ${(props) => props.width || '95%'};
`
export const MessageError = styled.Text`
    margin-bottom: ${(props) => props.bottom || '6%'};
    color: red;
    fontSize: ${(props) => props.size || '13px'};
`

export const MiniMessage = styled.Text`
    color: blue;
    fontSize: ${(props) => props.size || '16px'};
    margin-top: ${(props) => props.top || '5%'};
`
export const Destaque = styled.Text`
    color: blue;
    font-weight: bold;
    text-decoration: ${(props) => props.underline ? 'underline': 'none'};
`

export const SubmitSignButton = styled.TouchableOpacity`
    background-color: blue;
    border-radius: 9px;
    width: ${(props) => props.width ? props.width : '95%' };
    padding: 5%;
    align-items: center;
    margin-bottom: ${(props) => props.bottom ? props.bottom : '0%' };

`

export const MiniContainer = styled.View`
    width: ${(props) => props.width ? props.width : '100%' };;
    align-items: ${(props) => props.alignItems ? props.alignItems : 'center' };
    flex-direction: ${(props) => props.flexDirection ? props.flexDirection : 'column' };
    padding: ${(props) => props.padding ? props.padding : '0%' };
`

export const SubmitTextSign = styled.Text`
    color: #fff;
    font-size: 20px;
    font-weight: bold;

`