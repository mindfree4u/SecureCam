import React, { useState } from 'react';
import { View, Text, TextInput, Image, Button, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useRoute } from '@react-navigation/native';

const Intro_12100 = ({ navigation }) => {
  const route = useRoute();
  const { Email } = route.params;                           //Intro_12000에서 받음
  const [state, setState] = useState('false');


  return (
      <View style={styles.root}>
        <View >
			<View style={styles.intro}>
				<TouchableOpacity onPress={() => navigation.navigate('Intro_10000')} >
					<Image style={styles.back_arrow} source={require('../images/arrow.png')}/>
					<Text style={styles.아이디} >아이디 찾기</Text>
					<View style={[styles.line, {top: 45, width: '100%'}]} />		
				</TouchableOpacity>
			</View>
			
			<View style={styles.top_grp}>
				<Image source={require('../images/id_search_ok.png')} style={styles.id_search_img}/>
				<Text style={styles.question}>아이디 찾기 완료</Text>
				<Text style={styles.text1}>가입하신 아이디는 아래와 같습니다.</Text>


				<Text style={[styles.text2]}>이메일 주소</Text>
				<Text style={[styles.textinput]}>{Email}</Text>

				<TouchableOpacity  style={styles.Component1} onPress={ () => navigation.navigate('Intro_10000')}>
					<Text style={[styles.text3]}>로그인하기</Text>
				</TouchableOpacity>
			</View>
			<View style={[styles.line, {top: 270, left: 24, width: '86%'}]} />
		</View>
    </View>
  );
};

const styles = StyleSheet.create({
root: {
	width: '100%', height: 800,
	backgroundColor:'#FFFFFF',
},

top_grp:{
	flex:1,
	alignItems:'center',
    backgroundColor: 'transparent',	
},

row: {
	flexDirection:'row',
	backgroundColor: '#FFFFFF',
},

intro: {
	flex:1,
},

id_search_img: {
    position: 'absolute', top: 75,
	alignItems: 'center',
},

back_arrow: {
    position: 'absolute', left: 10, top: 11,
	width: 20, 
	height: 20,
},

아이디: {
    position: 'absolute', left: 130, top: 11,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: 21.48,
    color: '#000000',

},

question: {
    position: 'absolute', top: 180,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 21.48,
    marginTop: 5,
    color:'#322E7F',
	textAlign: 'center',
	alignItems: 'center',
},

찾기완료: {
    position: 'absolute', top: 232,
    fontFamily: 'Gothinc A1',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 28.8,
    marginTop: 5,
	textAlign: 'center',
	alignItems: 'center',
	color: '#322E7F',
},

text1: {
    position: 'absolute', top:  215,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 16.71,
    color: '#4F4F4F',
},

text2: {
    position: 'absolute', top: 290, left: 24,
    fontFamily: 'Pretendard', 
	fontStyle: 'normal', 
	fontWeight: 400, 
	fontSize: 16,
    lineHeight: 19.09,
    color: '#222222',
},

text3: {
    fontFamily: 'Pretendard', fontStyle: 'normal', fontWeight: 700, fontSize: 16, lineHeight: 19.09,
    textAlign: 'center',
    color: '#FFFFFF',
	borderColor: '#4543BA',
	marginTop:10,
},

textinput: {
    position: 'absolute', left: 24, top: 320,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: '400',
	width: '86%',
	height: 44,
    fontSize: 14,
    lineHeight: 16.71,
    color: '#4543BA',
	borderColor: '#D6D9EB',
	backgroundColor: '#F8F8FA',
	borderWidth: 1,
	paddingTop: 10,
	paddingLeft: 4,
	borderRadius: 2,
},

line: {
	top: 315,
	borderColor: '#E0E0E0',
	borderWidth: 0.5,
	width: '77%',

}
,
square:{
    position: 'absolute', left: '8%', right: '45%', top: 200,
    backgroundColor: 'transparent',                              // 배경색을 투명하게 설정
    padding: 27,                                                 // 내부 여백 설정
    borderWidth: 0.5,                                              // 테두리 두께 설정
    borderColor: '#000000',                                      // 테두리 색상 설정
},

Component1: {
    position: 'absolute', left: 24, width: '86%', top:720, height: 44,
    alignItems: 'center',
    backgroundColor: '#4543BA',
	borderWidth: 1,
    borderRadius: 2,
},

});


export default Intro_12100;
