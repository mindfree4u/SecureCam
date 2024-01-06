import React, { useState } from 'react';
import { View, Text, TextInput, Image, Button, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';

const Intro_13000 = ({ navigation}) => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');

//안내이메일 받기 클릭시
const ReceiveClick = () => {
  //입력 이메일 체크 로직
      if (!email || !email.includes('@') || !email.includes('.')) {
      Alert.alert( '','이메일 주소를 정확히 입력해주세요.', [{ text: '확인' }]);
          return;
        }

    else {
        const eml_addr = email;
        const url = 'http://seeguard.ggulb.net/MfindPwd';

        // 요청에 전달할 데이터
        const data = {
        eml_addr: eml_addr
        };

        // Axios를 사용하여 GET 요청 보내기
        axios
        .get(url, { params: data })
        .then((response) => {
            console.log('서버 응답 데이터:', response.data);
        if (response.data.rtnCode === "1") {
            const code = response.data.rtnMsg;
            navigation.navigate('Intro_13100', { Code: code, Email:email } );
        }
                   })
        .catch((error) => {
            console.error('오류 발생:', error);
        });
        }
  };

  return (
  
  
  
    <View style={styles.root}>
        <View >
			<View style={styles.intro}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Image style={styles.back_arrow} source={require('../images/arrow.png')}/>
					<Text style={styles.비밀번호}>비밀번호 찾기</Text>
					<View style={[styles.line, {top: 45, width: '100%'}]} />
				</TouchableOpacity>
			</View>

			<View style={styles.top_grp}>
				<Image source={require('../images/passwd_search.png')} style={styles.passwd_search_img}/>
				<Text style={styles.question}>비밀번호를 잊으셨나요?</Text>
				<Text style={styles.text1}>비밀번호 재설정을 위해{'\n'}가입하신 이메일 번호를 입력해주세요.</Text>

				
				<Text style={[styles.text2]}>이메일주소</Text>
				<Text style={[styles.text1, { left: 103, top: 307, color: '#6A6ED1', fontSize: 16 }]}>*</Text>
				<TextInput  value={email} style={styles.textinput} maxLength={80}
										  onChangeText={setEmail} placeholder="이메일주소 입력"
										  placeholderTextColor="#D9D9D9" />
				<TouchableOpacity style={styles.Component1} onPress={ReceiveClick}>
					<Text style={styles.text3}>초기화 비밀번호 받기</Text>
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
},

top_grp:{
	flex:1,
	alignItems:'center',
    backgroundColor: 'transparent',	
},

row: {
	flexDirection:'row',
},

intro: {
	flex:1,
},

passwd_search_img: {
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
    position: 'absolute', left: 128, top: 11,
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
    position: 'absolute', top: 306, left: 24,
    fontFamily: 'Pretendard', 
	fontStyle: 'normal', 
	fontWeight: 400, 
	fontSize: 16,
    lineHeight: 19.09,
    color: '#222222',
},

textinput: {
    position: 'absolute', left: 24, top: 334,
    fontFamily: 'Gothic A1',
    fontStyle: 'normal',
    fontWeight: '400',
	width: '86%',
	height: 44,
    fontSize: 14,
    lineHeight: 16.71,
    color: '#4D4D4D',
	borderColor: '#B6BEDB',
	borderWidth: 1,
	paddingTop: 12,
	borderRadius: 2,
},

line: {
	borderColor: '#E0E0E0',
	borderWidth: 0.5,
	width: '86%',
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
    position: 'absolute', left: 24, width: '86%', top: 715, height: 44,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
	borderColor: '#808DD0',
	borderWidth: 1,
    borderRadius: 2,
},

text3: {
    fontFamily: 'Pretendard', fontStyle: 'normal', fontWeight: 700, fontSize: 16, lineHeight: 19.09,
 
    textAlign: 'center',
    color: '#4543BA',
	borderColor: '#808DD0',
	marginTop:11,
},

});

export default Intro_13000;