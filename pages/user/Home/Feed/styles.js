import styled from 'styled-components/native';

export const Post = styled.View`
margin-top: 10px;
background-color: white;
`

export const Header = styled.View`
padding: 15px;
flex-direction: row;
align-items: center;
`
export const MiniHeader = styled.View`
flex-direction: column;
align-items: flex-start;
`
export const Name = styled.Text`
color: #333;
font-weight: bold;
`
export const Time = styled.Text`
color: #333;
fontSize: 12px;

`
export const Avatar = styled.Image`
width: 32px;
height: 32px;
border-radius: 16px;
margin-right: 10px;
border:  ${(props) => props.verified ? '2px solid blue': 'none'};
`
export const PostImage = styled.View`
width: 100%;
align-items: center;
justify-content: center;
`
export const MapImage = styled.Image`
width: 95%;
height: 250px;
border-radius: 25px;
`

export const DescriptionBox = styled.View`
width: 100%;
flex-direction: row;
`
export const ReactBar = styled.View`
flex-direction: row;
padding: 2%;
`
export const ReactBox = styled.View`
align-items: center;
flex-direction: row;
padding: 2%;
margin-right: 15px;
`

export const Description = styled.View`
padding: 2%;
flex-drection: column;
align-items: center;
margin-right: 15%
`

export const DescriptionText = styled.Text`
color: #333;
fontSize: 14px;
font-weight: bold;
`

export const DescriptionMiniText = styled.Text`
color: #333;
fontSize: 10px;
`