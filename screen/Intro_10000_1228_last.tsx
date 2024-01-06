import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, ScrollView, LogBox, StatusBar, Image } from 'react-native';

import CheckBox from '@react-native-community/checkbox';
import {useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SaltContext, LoginIdContext} from '../App';
import {statusBarStyle} from './styles/statusbar_style';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';

LogBox.ignoreLogs(['new NativeEventEmitter']);                                    // Ignore log notification by message
LogBox.ignoreAllLogs();                                                           //Ignore all log notifications

const Intro_10000 = ({ navigation }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberEmail, setRememberEmail] = useState(false);
  const [saltVl, setSaltVl] = React.useState('');
  const saltContext = useContext(SaltContext);
  saltContext.setSalt(saltVl);
  const loginIdContext = useContext(LoginIdContext);
  loginIdContext.setLoginId(email);

//화면업데이트
useFocusEffect(
  React.useCallback(() => {
    getEmail();
      }, [])
  );

//저장된 이메일 불러오기
    const getEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('savedEmail');
        if (savedEmail !== null) {
          setEmail(savedEmail);
          setPassword('');
          setRememberEmail(true);                                     // 이메일 저장 상태를 true로 설정
        }
        else {
          setEmail('');                                              // 저장된 이메일이 없을 경우 초기값으로 설정
          setPassword('');
          setRememberEmail(false);
            }
      } catch (error) {
        console.log(error);
      }
    };

  // 로그인 버튼 클릭시 호출됨
    const handleLogin = () => {
           if (email.length === 0) {
                Alert.alert('로그인 실패', '이메일 주소를 입력해 주세요.', [{ text: '확인' }]);
            }
           else if (password.length === 0 ){
                Alert.alert('로그인 실패', '비밀번호를 입력해 주세요.', [{ text: '확인' }]);
            }
           else if (email.length === 0 && password.length === 0 ){
                Alert.alert('로그인 실패', '이메일 주소와 비밀번호를 입력해 주세요.', [{ text: '확인' }]);
            }
           else if (!email || !email.includes('@') || !email.includes('.')) {
                Alert.alert( '','이메일 형식이 올바르지 않습니다.', [{ text: '확인' }]);
            }
           else  if ( !password || password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
                Alert.alert( '','비밀번호는 영문과 숫자를 포함해 8자리이상 입력해 주세요.', [{ text: '확인' }]);
                return;
            }
           else {
           const eml_addr = email;
           const pswd = password;

           const url = 'http://seeguard.ggulb.net/Mlogin';

           // 솔트 생성
    /*       const generateSalt = (length: number) => {
             const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
             let salt = '';
             for (let i = 0; i < length; i++) {
               const randomIndex = Math.floor(Math.random() * charset.length);
               salt += charset[randomIndex];
             }
             return salt;
           };

           salt = generateSalt(16);
        */
           const salt = "TemporarySecretKey"       //서버에서 랜덤 생성된 키를 수신하게 변경필요

           // 비밀번호를 솔트와 함께 암호화
           const saltedPassword = salt + pswd;
           const encryptedPassword = CryptoJS.SHA256(saltedPassword).toString();


          // 요청에 전달할 데이터
           const data = {
           eml_addr: eml_addr,
           pswd: encryptedPassword,
           };

          // Axios를 사용하여 GET 요청 보내기
           axios
           .get(url, { params: data })
           .then((response) => {
          // 서버 응답 데이터를 이용하여 원하는 작업 수행
           console.log('서버 응답 데이터:', response.data);
           setSaltVl(response.data.rtnMsg);

           if (response.data.rtnCode === "1") {
                 // rtnCode가 1인 경우 페이지 이동
                 navigation.navigate('Page_10000');
               }
           else if(response.data.rtnCode === "0"){
           Alert.alert('', '로그인에 실패했습니다.', [{ text: '확인' }]);
           }
           })
          .catch((error) => {
           console.error('오류 발생:', error);
           });
           }
    };

  //이메일 저장용 체크박스 터치시 호출됨
  const handleRememberEmail = () => {
      setRememberEmail(!rememberEmail);
   };





  // 이메일 저장 상태 변경 시 이메일 저장/삭제
useEffect(() => {
    const saveEmail = async () => {
      try {
        if (rememberEmail) {
          await AsyncStorage.setItem('savedEmail', email);
        } else {
          await AsyncStorage.removeItem('savedEmail');
        }
      } catch (error) {
        console.log(error);
      }
    };

    saveEmail();
  }, [rememberEmail, email]);

const handlePassword = (text) => {
      setPassword(text);
      validatePassword(text);
    };

 
const validatePassword = (password) => {
      // 비밀번호 유효성 검사
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      const isValid = passwordRegex.test(password);
    };
  
  return (

	<>
  	
		<StatusBar
			animated={false}
			backgroundColor="#FFFFFF"
			barStyle='dark-content'
			color='#000000'

			
	//        barStyle={statusBarStyle}
	//        showHideTransition={statusBarTransition}
	//        hidden={hidden}
		 />
	
		 <View style={styles.root}>
			  <Image source={require('../images/home_right.png')} style={styles.img}/>
			  <Text style={[{top: 40, left: 40, color:'#B6BED8', fontSize: 16, fontWeight: 700, fontFamily: 'Pretendard'}]}>GGULB</Text>

			  <Text style={styles.title}>Secure Cam</Text>
			  <Text style={styles.welcome}>방문을 환영합니다.</Text>
			  <Text style={styles.email}>E-mail</Text>
			  <TextInput style={[styles.text_input, { top: 268}]} value={email} onChangeText={setEmail}
								   placeholder="ggulb@ggulb.net" placeholderTextColor="#4F4F4F" />

			  <View style={[styles.line, {top: 290, }]}/>
			  <View style={[styles.line, {top: 358, }]}/>
			  
			  <Text style={styles.password}>Password</Text>
			  <TextInput style={[styles.text_input, { top: 341}]} value={password}
						  onChangeText={handlePassword} secureTextEntry={true}
						  placeholder="비밀번호를 입력해주세요." placeholderTextColor="#BDBDBD"/>

			<View style={styles.email_confirm}>
				<CheckBox style={[styles.checkbox, ]}
							 tintColors={{ true: '#bbbbbb', false: '#cccccc' }}
							 value={rememberEmail}
							 onValueChange={handleRememberEmail}
				 />
				 <Text style={styles.이메일저장}>이메일 저장</Text>
			</View>

			<TouchableOpacity style={styles.Component1} onPress={handleLogin}>
				<Text style={styles.로그인}>로그인</Text>
			</TouchableOpacity>
			  
			<View style={styles.search_grp} >
				<View style={styles.search_id} >
					<TouchableOpacity onPress={() => navigation.navigate('Intro_12000')}>
						<Text style={styles.id_search}>아이디 찾기</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.bar}>
					<Text>|</Text>
				</View>
				<View style={styles.search_passwd}>
					<TouchableOpacity onPress={() => navigation.navigate('Intro_13000')}>
						<Text style={styles.passwd_search}>비밀번호 찾기</Text>
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.bottom} >
				<Image source={require('../images/login_left.png')} style={styles.img_bottom}/>
				<Text style={styles.text1}>아직 회원이 아니신가요?</Text>
				<TouchableOpacity style={[styles.Component2, ]} onPress={() => navigation.navigate('Intro_11000')}>
					<Text style={styles.회원가입}>회원가입</Text>
				</TouchableOpacity>
			</View>
		</View>
	</>

  );
};

const styles = StyleSheet.create({
root: {
width: '100%',
   height:800,
   backgroundColor: '#FFFFFF',
  },
  
img: {
	flex:1,
	position: 'absolute', right:20, top: 10,
	width: 152, 
	height: 152,
},

img_bottom: {
	flex:1,
	position: 'absolute', left:-40, top: 640,
	width: 160, 
	height: 160,
},
title_grp: {
    position: 'absolute', left: 40, top: 146,
 },
 
title: {
	position: 'absolute', left: 40, top: 146,
    fontFamily: 'Work Sans',
    fontStyle: 'normal',
    lineHeight: 44.8,
    color: '#322E7F',
    fontSize: 32,
    fontWeight: 700,
	letterSpacing: -1.28

 },
 
welcome: {
	position: 'absolute', left: 40, top: 197,
    fontFamily: 'Pretendard', 
    fontStyle: 'normal',
    lineHeight: 21.48,
    color: '#322E7F',
    fontSize: 18,
    fontWeight: 400,
 },
 
email: {
	position: 'absolute', left: 40, top: 250,
    fontFamily: 'Work Sans',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 22.4,
    color: '#808DD0',
},

text_input: {
	position: 'absolute', left: 36, 
	fontFamily: 'Work Sans',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22.4,
    color: '#4F4F4F',
},

line: {
	borderColor: '#322E7F',
	borderWidth: 0.5,
	left:'11.11%',
	width: '77%'
},


passwd_grp: {
    position: 'absolute', left: 40, right: 40, top: 323,
 },
 
password:{
    position: 'absolute', left: 40, right: 40, top: 323,
    fontFamily: 'Work Sans1',
    fontStyle: 'normal',
    fontWeight: 4700,
    fontSize: 14,
    lineHeight: 22.4,
    color: '#808DD0',
},

email_confirm: {
   flexDirection: 'row',
},

checkbox:{
   position: 'absolute', left: 34, top: 365,
   color: '#000000',
},

이메일저장:{
    position: 'absolute', left: 64, top: 374,
    fontFamily: 'Gothic A1',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 12,
    lineHeight: 14.32,
    color: '#606060',
},

Component1: {
    position: 'absolute', left: '11.11%', width: '77%', top: 450, height: 44,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4543BA',
    fontSize: 16,
    borderRadius: 2,
},


로그인: {
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 17,
    textAlign: 'center',
    color: '#FFFFFF',
},

회원가입: {
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 17,
    textAlign: 'center',
    color: '#4543BA',
},

search_grp: {
	flexDirection: 'row',
	position: 'absolute', left: '11.11%', width: '77%', top: 505,
	color: '#4543BA',
	justifyContent:'space-between',
	alignItems: 'center',
},

search_id: {
	flex:0.45,
	fontFamily: 'Gothic A1',
	fontStyle: 'normal',
	fontWeight: 700,
	fontSize: 12,
	lineHeight: 17,
	color: '#4543BA',
},

search_bar: {
	flex:0.1,
   fontFamily: 'Pretendard',
   fontStyle: 'normal',
   fontWeight: 700,
   fontSize: 12,
   lineHeight: 17,
   color: '#E0E0E0',
},

search_passwd: {
	flex:0.45,

   fontFamily: 'Pretendard',
   fontStyle: 'normal',
   fontWeight: 700,
   fontSize: 12,
   lineHeight: 17,
   color: '#4543BA',
},

id_search:{
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 12,
	textAlign: 'center',
	marginLeft: 20,
    color: '#4543BA',
},

passwd_search:{
    fontFamily: 'Gothic A1',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 12,
	textAlign: 'center',
	marginRight: 20,
    color: '#4543BA',
},

text1:{
    position: 'absolute', top: 665,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 15,
	textAlign: 'center',
    color: '#4F4F4F',

},

Component2: {
    position: 'absolute', left: '11.11%', width: '77%', top: 695, height: 44,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
	borderColor:'#808DD0',
	borderWidth: 1,
	fontSize: 16,
    borderRadius: 2,
},

bottom:{
    alignItems: 'center',
},

});

export default Intro_10000;