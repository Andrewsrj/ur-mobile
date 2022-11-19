import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    align-items: center;
`

export const Rect = styled.View`
    width: 95%;
    height: 30%;
    backgroundColor: rgba(71,111,247,1);
    marginTop: 2%;
    flexDirection: column;
    borderRadius: 15px;
`
export const Rect2 = styled.View`
    width: 95%;
    height: 70%;
    flexDirection: column;
    align-items: center;
    justify-content: center;
    marginTop: 5%;
`
export const TouchableButton = styled.TouchableOpacity`
    backgroundColor: rgba(74,144,226,1);
    borderWidth: 1px;
    borderColor: #000000;
    borderRadius: 25px;
    width: 126px;
    height: 39px;
    align-items: center;
    justify-content: center;
    marginBottom: 8%;
`
export const ButtonText = styled.Text`
    color: rgba(255,255,255,1);
    fontSize: 25px;
`
export const RectItems = styled.View`
    flexDirection: row;
`

export const ImageRow = styled.View`
    height: 100px;
    flexDirection: column;
    marginTop: 5%;
    align-items: center;
    
`

export const DescriptionRow = styled.View`
    height: 50px;
    flexDirection: column;
    marginTop: 5%;
    marginLeft: 2%;
    align-items: center;
    justify-content: center;
`
export const DescriptionText = styled.Text`
    color: #121212;
`

export const SubDescriptionText = styled.Text`
    color: #121212;
`

export const Avatar = styled.Image`
    width: 70px;
    height: 70px;
    borderWidth: 1px;
    borderColor: #000000;
    borderRadius: 30px;
    marginLeft: 5%;
`

export const DisplayName = styled.Text`
    color: rgba(255,255,255,1);
    fontSize: 20px;
    marginLeft: 2%;
`
export const CollegeName = styled.Text`
    color: #121212;
    marginLeft: 2%;
`
export const BioText = styled.Text`
    marginLeft: 2%;
    marginTop: 4%;
    color: #121212;
    width: 100%;
    height: 50px;
`
