import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import { LoginIdContext, SaltContext } from '../App';
import Footer from './Footer';


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
    <View>
        <View style={styles.root}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.vector}>
                <Image source={require('../images/arrow.png')} style={{width: 16.17, height: 19.8, top:5}}/>
            </TouchableOpacity>
            <Text style={styles.회원탈퇴}>회원탈퇴</Text>
			<View style={[styles.line, {top: 45}]} />
			
            <Text style={styles.text1}>정말로 탈퇴하시겠습니까?</Text>
            <Text style={styles.text2}>지금 탈퇴하시면 서버에 저장하신{'\n'} 녹화영상을 더이상 이용하실 수 없습니다.</Text>
            <CheckBox style={{position: 'absolute', left: 30, top: 230,}}
                                  tintColors={{ true: '#4D4D4D' }}
                                  value={agree1}
                                  onValueChange={setAgree1}
                         />
			<View style={[styles.line, {top: 210}]} />
            <Text style={[styles.text2,{left: 49, top: 234}]}>  위 내용을 확인하였으며 동의합니다. (필수)</Text>
            <Text style={[styles.text3,{top: '35%'}]}>탈퇴 사유를 알려주세요.</Text>
            <TextInput  value={opinion} style={styles.textinput}
						multiline
						textAlignVertical="top"
                        onChangeText={setOpinion} maxLength={200}
                        placeholder="고객님의 소중한 피드백을 담아 더 나은 서비스로 개선하겠습니다."
                        placeholderTextColor="#6F6F6F" multiline={true} />
            <TouchableOpacity  onPress={unscribe} style={styles.Component1}>
                <Text  style={styles.회원탈퇴2}>회원탈퇴</Text>
            </TouchableOpacity>
            </View>
    </View>
	    <Footer style={[{top: 600}]} navigation={navigation} selectedIconIndex={selectedIconIndex} setSelectedIconIndex={setSelectedIconIndex} />
	</>
	
  );
};

const styles = StyleSheet.create({
root: {
    position: 'absolute', width: '100%', height: 800,
	backgroundColor: '#FFFFFF',
    justifyContent: 'center',
	
},

vector: {
    position: 'absolute', top: 15.1, left: 10
},

회원탈퇴: {
    position: 'absolute', left: '41.94%', top: 12.1,
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
    color: '#000000',
},

text1: {
    position: 'absolute', left: '11.11%', top: '13.12%',
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 22,
    lineHeight: 23,
    color: '#4D4D4D',
},

line: {
	borderColor: '#E0E0E0',
	backgroundColor: '#E0E0E0',
	borderWidth: 1,
	width: '100%',
},


text2: {
    position: 'absolute', left: '11.11%', top: '17.75%',
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 20,
    color: '#6F6F6F',
},

text3: {
    position: 'absolute', left: '11.11%', top: '13.12%',
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 23,
    color: '#4D4D4D',
},

img1: {
     position: 'absolute', left: '14%', width: 280, top: 164,
     height: 167,
},
textinput: {
    position: 'absolute', left: '12%', right: '12%', top: '40%', bottom: '30%',
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: '#FFFFFF',
	borderColor: '#D6D9EB',
	borderWidth: 1,
},

line:{
    position: 'absolute', left: '11.11%', right: '11.39%', top: 410,
    borderBottomWidth:1,
    borderBottomColor: '#ACACAC',
},
Component1: {
    position: 'absolute', left: '11.11%', right: '11.11%', top: 680,
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
