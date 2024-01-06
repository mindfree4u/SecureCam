import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, StyleSheet, ScrollView} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from './Footer';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import { LoginIdContext, SaltContext } from '../App';



const Page_62000 = ({ navigation}) => {
  const [opinion, setOpinion] = useState('');
  const [agree1, setAgree1] = useState('');
  const saltContext = useContext(SaltContext);
  const salt = saltContext.salt;
  const loginIdContext = useContext(LoginIdContext);
  const eml_addr = loginIdContext.loginId;
  const [selectedIconIndex, setSelectedIconIndex] = useState(5);

  //회원탈퇴 버튼 클릭시 호출됨
  const unscribe =  async() => {
         if(agree1 === '') {
            Alert.alert('', '탈퇴확인에 동의해 주세요.', [{ text: '확인' }]);
         }
         else {
          try {
               const url = 'http://seeguard.ggulb.net/Mresign';

          // 요청에 전달할 데이터
           const data = {
           eml_addr: eml_addr,
           salt_vl: salt,
           };

           await AsyncStorage.clear();                             // 기기에 저장된 모든 데이터 삭제

          // Axios를 사용하여 GET 요청 보내기
           axios
           .get(url, { params: data })
           .then((response) => {
          // 서버 응답 데이터를 이용하여 원하는 작업 수행
           console.log('서버 응답 데이터:', response.data);
           if (response.data.rtnCode === "1") {
                 Alert.alert('', '회원탈퇴되었습니다.', [{ text: '확인' }]);
                 navigation.navigate('Intro_10000');
               }
           })
          .catch((error) => {
           console.error('오류 발생:', error);
           });
           }  catch (error) {
                 console.error('탈퇴오류 : ', error);
               }
           }
       };

  return (
  <>
	<View style={styles.root}>
		<TouchableOpacity onPress={() => navigation.goBack()}>
			<Image style={styles.back_arrow} source={require('../images/arrow.png')}/>
			<Text style={styles.마이페이지}>회원탈퇴</Text>
			<View style={[styles.line, {left:0, top: 45, width: '100%'}]} />
		</TouchableOpacity>

		<Text style={styles.text1}>정말로 탈퇴하시겠습니까?</Text>
		<Text style={styles.text2}>지금 탈퇴하시면 서버에 저장하신 녹화영상을{'\n'}더이상 이용하실 수 없습니다.</Text>

		<CheckBox style={{position: 'absolute', left: 20, top: 226,}}
			  tintColors={{ true: '#4543BA' }}

			  value={agree1}
			  onValueChange={setAgree1}
		/>


		<View style={[styles.line, {top: 200, left: 24, width: '87%'}]} />
		<Text style={[styles.text2,{left: 56, top: 230}]}>위 내용을 확인하였으며 동의합니다. (필수)</Text>
		<View style={[styles.line, {top: 280, left: 24, width: '87%'}]} />
		<Text style={[styles.text3,{top: 300}]}>탈퇴 사유를 알려주세요.</Text>
		

		<TextInput  value={opinion} style={styles.textinput}
					multiline
					textAlignVertical="top"
					onChangeText={setOpinion} maxLength={1000}
					placeholder="고객님의 소중한 피드백을 담아 더 나은 서비스로 개선하겠습니다."
					placeholderTextColor="#6F6F6F" multiline={true} />

		<TouchableOpacity  onPress={unscribe} style={styles.Component1}>
			<Text  style={styles.회원탈퇴2}>회원탈퇴</Text>
		</TouchableOpacity>
	</View>
	<Footer navigation={navigation} selectedIconIndex={selectedIconIndex} setSelectedIconIndex={setSelectedIconIndex} />
	</>
	
  );
};

const styles = StyleSheet.create({
root: {
	width: '100%',
	height: 800,
	flex:1,
	backgroundColor: '#FFFFFF',
  },

back_arrow: {
    position: 'absolute', left: 10, top: 11,
	width: 20, 
	height: 20,
},

마이페이지: {
    position: 'absolute', left: '39.5%', top: 11,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: 23,
	textAlign: 'center',
    color: '#000000',
},

  
vector: {
    position: 'absolute', top: 15.1, left: 10
},

회원탈퇴: {
    position: 'absolute', left: '41.94%', top: 12.1,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
    color: '#000000',
},

text1: {
    position: 'absolute', left: 24, top: 95,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 22,
    lineHeight: 23,
    color: '#222222',
},

line:{
    position: 'absolute', left: 24, right: 24, top: 410,
	borderWidth: 0.5,
    borderColor: '#E0E0E0',
},


text2: {
    position: 'absolute', left: 24, top: 127,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 20,
    color: '#4F4F4F',
},

text3: {
    position: 'absolute', left: 24, top: 150,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 23,
    color: '#222222',
},

img1: {
     position: 'absolute', left: '14%', width: 280, top: 164,
     height: 167,
},

textinput: {
    position: 'absolute', left: 24, right:24, top: 330, height: 200,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: '#FFFFFF',
	borderColor: '#D6D9EB',
	borderWidth: 1,
},

Component1: {
    position: 'absolute', left: 24, right: 24, top: 650,
    height: 44,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4543BA',
    borderRadius: 5,
},
회원탈퇴2: {
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 17,
    textAlign: 'center',
    color: '#FFFFFF',
},
});

export default Page_62000;
