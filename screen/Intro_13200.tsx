import React, { useState,  useEffect, useContext } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, Modal, StyleSheet, ScrollView, PermissionsAndroid } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';

const Intro_13200 = ({ navigation, route }) => {
  const { Code, Email } = route.params;                           //Intro_13100에서 받음
  const [isPrivacyVisible, setIsPrivacyVisible] = useState(false);                           //개인정보 이용약관 보이기 상태저장
  const [isServiceVisible, setIsServiceVisible] = useState(false);                           //서비스 이용약관 보이기 상태저장
  const [email, setEmail] = useState(Email);
  const [name, setName] = useState('');
  const [tmppswd, setTmppswd] = useState(Code);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const handlePasswordChange = (text) => {
      setPassword(text);
      validatePassword(text, confirmPassword);
    };

  const handlePasswordChangeBlur = () => {
        if ( !password || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
                  Alert.alert( '','영문과 숫자를 포함시켜 주세요.', [{ text: '확인' }]);
                          return;
                        }
        else if ( !password || password.length < 8) {
                  Alert.alert( '','8자리 이상으로 지정해 주세요.', [{ text: '확인' }]);
                         return;
                       }
   };

  const handleConfirmPasswordChange = (text) => {
      setConfirmPassword(text);
      validatePassword(password, text);
    };

  const handleConfirmPasswordChangeBlur = () => {
     if ( !password || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
              Alert.alert( '','영문과 숫자를 포함시켜 주세요.', [{ text: '확인' }]);
              return;
              }
        else if ( !password || password.length < 8) {
              Alert.alert( '','8자리 이상으로 지정해 주세요.', [{ text: '확인' }]);
              return;
              }
   };

  const validatePassword = (password, confirmPassword) => {
      // 비밀번호 유효성 검사
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      const isValid = passwordRegex.test(password);

      // 비밀번호 확인 일치 여부 검사
      const isMatch = password === confirmPassword;

      setIsPasswordValid(isValid && isMatch);
    };

//확인 버튼 클릭시 호출됨
  const handleChangePW = () => {
      if (!isPasswordValid) {
            Alert.alert('', '비밀번호를 확인해 주세요.', [{ text: '확인' }]);
      }
      else if(isPasswordValid) {

           const eml_addr = email;
           const temppswd = pswd;
           const pswd = password;

           const url = 'http://seeguard.ggulb.net/MchangePwd';

           const salt = "TemporarySecretKey"       //서버에서 랜덤 생성된 키를 수신하게 변경필요

           // 비밀번호를 솔트와 함께 암호화
           const saltedPassword = salt + pswd;
           const encryptedPassword = CryptoJS.SHA256(saltedPassword).toString();

          // 요청에 전달할 데이터
           const data = {
           eml_addr: eml_addr,
           temp_pswd: tmppswd,
           pswd: encryptedPassword,
           };
          // Axios를 사용하여 GET 요청 보내기
           axios
           .get(url, { params: data })
           .then((response) => {
          // 서버 응답 데이터를 이용하여 원하는 작업 수행
           console.log('서버 응답 데이터:', response.data);

           if (response.data.rtnCode === "1") {
                // rtnCode가 1인 경우 페이지 이동
                navigation.navigate('Intro_13300');
                          }
           })
          .catch((error) => {
           console.error('오류 발생:', error);
           });

      }
    };

  return (
  
     <View style={[styles.root, {color:'#FF0000'}]}>
        <View >
			<View style={styles.intro}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Image style={styles.back_arrow} source={require('../images/arrow.png')}/>
					<Text style={styles.비밀번호}>비밀번호 관리</Text>
					<View style={[styles.line, {top: 45, width: '100%'}]} />
				</TouchableOpacity>
			</View>
  
        <Text style={[styles.question]}>비밀번호 재설정</Text>
        <Text style={[styles.text0]}>비밀번호 변경을 위해 아래 정보를 입력해주세요.</Text>
		<View style={[styles.line, {top: 142, left:24, width: '86%'}]} />
		<Text style={[styles.text1, { left: 24, top: 163 }]}>이메일주소</Text>	
		<View style={[styles.box, {top: 188,}]} />
		<Text style={[styles.text_box, { left: 26, top: 200 }]}> {email}</Text>

		<Text style={[styles.text1, { left: 24, top: 253 }]}>초기화 비밀번호</Text>
		<View style={[styles.box, {top: 233,}]} />
		<Text style={[styles.text_box, { left: 26, top: 290 }]}> {tmppswd}</Text>

		<Text style={[styles.text1, { left: 24, top: 343 }]}>비밀번호</Text>
		<Text style={[styles.text1, { left: 89, top: 343, color: '#6A6ED1', fontSize: 16 }]}>*</Text>		
		
		<TextInput  value={password} style={[styles.textinput, { left: 24, top: 368, width: '86%' }]}
					onChangeText={handlePasswordChange} placeholder="영문, 숫자 포함 8자이상" maxLength={80}
					placeholderTextColor="#D6D9EB" secureTextEntry={true} onBlur={handlePasswordChangeBlur} />

		<Text style={[styles.text1, { left: 24, top: 427 }]}>비밀번호 확인</Text>
		<Text style={[styles.text1, { left: 125, top: 427, color: '#6A6ED1', fontSize: 16 }]}>*</Text>
		<TextInput value={confirmPassword} style={[styles.textinput, { left: 24, top: 454, width: '86%' }]}
				   onChangeText={handleConfirmPasswordChange} placeholder="영문, 숫자 포함 8자이상" maxLength={80}
				   placeholderTextColor="#D9D9D9" secureTextEntry={true} onBlur={handleConfirmPasswordChangeBlur} />

		{isPasswordValid ? ( <Text style={[styles.text5, { top: 506 }]}>*사용 가능한 비밀번호입니다.</Text> )
							:null }
		{ !isPasswordValid  && password && confirmPassword ? ( <Text style={[styles.text5, { top: 506, color: '#FA584E' }]}>
																		  *비밀번호가 일치하지 않습니다.</Text>  )
							:null }
		<TouchableOpacity onPress={handleChangePW} style={styles.Component3} >
	
			<Text style={styles.text4}>재설정 완료</Text>
		</TouchableOpacity>
      </View>
     </View>
     );
   };

const styles = StyleSheet.create({
root: {
	width: '100%', height: 800,
	backgroundColor:'#FFFFFF',
},

back_arrow: {
    position: 'absolute', left: 10, top: 11,
	width: 20, 
	height: 20,
},

비밀번호: {
    position: 'absolute', left: 120, top: 11,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: 21.48,
    color: '#222222',
},

title: {
    position: 'absolute', left:'35%', top: 10,
    fontFamily: 'Gothic A1',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 19.09,
    color: '#000000',
	backgrooundColor: '#FFFFFF',
},

question: {
    position: 'absolute', left: 30, top: 70,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 22,
    lineHeight: 26.25,
    color:'#322E7F',
	textAlign: 'center',
	alignItems: 'center',
},

text0: {
    position: 'absolute', left: 30, top: 102,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 16.71,
    color: '#4F4F4F',
},


intro: {
	flex:1,
},

text_box: {
    position: 'absolute',
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 16.71,
    color: '#4543BA',
},

text1: {
    position: 'absolute',
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 19.07,
    color: '#222222',
},

Component2: {
    position: 'absolute', left: '8%',  top: 164, height: 45.13,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 5,
},

본인인증: {
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    color: '#FFFFFF',
},

text2: {
    position: 'absolute', left: 40, top: 590,
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    color: '#000000',
},

textinput: {
    position: 'absolute', left: 26, 
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16.71,
	color: '#B6BED8',
	paddingTop: 13,
	borderColor: '#D6D9EB',
	borderWidth: 1,
	height: 44,
},

line: {
	borderColor: '#E0E0E0',
	borderWidth: 0.5,
},

box:{
    position: 'relative', left: 24, 
	width: '86%',
	borderColor: '#D6D9EB',
	backgroundColor: '#F8F8FA',
	borderWidth: 1,
	height: 44,
},


Rectangle4:{
    position: 'absolute', left: '64.16%', top: 170, width: 89, height:40,
    borderWidth: 1,
    backgroundColor: '#000000',
    borderColor: '#ACACAC',
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
},

Component3: {
    position: 'absolute', left: 24,  top: 715, height: 44, width: '86%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
	borderColor: '#808DD0',
    borderRadius: 2,
	borderWidth: 1,
},
text3: {
    position: 'absolute', left: 266, top: 620,
    fontFamily: 'Noto Sans KR', fontStyle: 'normal', fontWeight: 400, fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
    color: '#D9D9D9',
},
text4: {
    fontFamily: 'Pretendard', fontStyle: 'normal', fontWeight: 700, fontSize: 16,
    lineHeight: 19.09,
    textAlign: 'center',
    color: '#4543BA',
},
modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
modal: {
    width: '88%',  maxWidth: 600,
},
닫기:{
    width: 106, height:44,
    borderWidth: 1,
    borderColor: '#ACACAC',
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
},
text5: {
    position: 'absolute', right: 45, top: 217,
    fontFamily: 'Inter', fontStyle: 'normal', fontWeight: 400, fontSize: 12,
    lineHeight: 14.1,
    textAlign: 'center',
    color: '#008B27',
},
});

export default Intro_13200;