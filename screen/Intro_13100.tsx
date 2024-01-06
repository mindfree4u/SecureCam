import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

const Intro_13100 = () => {
  const route = useRoute();
  const { Code, Email } = route.params;                           //Intro_13000에서 받음
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
        <View >
			<View style={styles.intro}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Image style={styles.back_arrow} source={require('../images/arrow.png')}/>
					<Text style={styles.비밀번호}>비밀번호 찾기</Text>

				</TouchableOpacity>
			</View>
			<View style={[styles.line, {top: 45, width: '100%'}]} />
			<View style={styles.top_grp}>
				<Image source={require('../images/passwd_init_ok.png')} style={styles.passwd_init_ok_img}/>
				<Text style={styles.question}>비밀번호 초기화 완료</Text>
				<Text style={styles.text1}>아래와 같이 비밀번호가 초기화 되었습니다.{'\n'}확인 후 비밀번호를 재설정하세요. </Text>

				
                <Text style={styles.text2}>초기화비밀번호</Text>
                <TextInput  value={Code} style={styles.textinput} maxLength={20} placeholderTextColor="#4D4D4D" />
				<TouchableOpacity style={styles.Component1} onPress={() => navigation.navigate('Intro_13200', { Code: Code, Email: Email })}  >
					<Text style={styles.text3}>비밀번호 재설정</Text>
				</TouchableOpacity>
			</View>
			<View style={[styles.line, {top: 285, left: 24, width: '86%'}]} />
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

passwd_init_ok_img: {
    position: 'absolute', top: 75,
	alignItems: 'center',
	width: 90, 
	height: 90,
},

back_arrow: {
    position: 'absolute', left: 10, top: 11,
	width: 20, 
	height: 20,
},

비밀번호: {
    position: 'absolute', left: 127, top: 11,
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

    color:'#322E7F',
	textAlign: 'center',
	alignItems: 'center',
},

text1: {
    position: 'absolute', top:  218,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 16.71,
    color: '#4F4F4F',
	textAlign: 'center',
},

text2: {
    position: 'absolute', top: 310, left: 24,
    fontFamily: 'Pretendard', 
	fontStyle: 'normal', 
	fontWeight: 400, 
	fontSize: 16,
    lineHeight: 22,
    color: '#222222',
},

textinput: {
    position: 'absolute', left: 24, width: '86%', top: 340,
    fontStyle: 'normal',
    fontWeight: '400',

	height: 40,
    fontSize: 16,
    lineHeight: 19,
    color: '#4543BA',
	backgroundColor: '#F8F8FA',
	borderColor: '#D6D9EB',
	borderWidth: 1,
	padding: 8,
	borderRadius: 2,
},

line: {
	top: 365,
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
    position: 'absolute', left: 24, width:'86%', top: 715, height: 44,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
	borderColor: '#808DD0',
	borderWidth: 1,
    borderRadius: 2,
	marginTop: 8,
},

text3: {
    fontFamily: 'Pretendard', fontStyle: 'normal', fontWeight: 700, fontSize: 16, lineHeight: 19.09,
    textAlign: 'center',
    color: '#4543BA',
	marginTop:11,
},

});

export default Intro_13100;