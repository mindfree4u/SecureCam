import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import {deviceDataContext } from '../App';

const Page_12000 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { serialNo } = route.params;                           //Intro_13000에서 받음

  const [serial, setSerial] = useState(serialNo);
  const [code, setCode] = useState('');
//  const { deviceData, setDeviceData } = useContext(deviceDataContext);
//	console.log('=============================================================', route.params);

  const handleDeviceData = () => {
		console.log(serialNo);
		Alert.alert('연동필요', '향후 P2P서버와 연동이 필요합니다.', [{ text: '확인' }]);
    };

  return (
  

		
      <View style={styles.root}>
        <View >
			<View>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Image style={styles.back_arrow} source={require('../images/arrow.png')}/>
					<Text style={styles.title}>SN번호로 추가</Text>
				<View style={[styles.line, {top: 45, width: '100%'}]} />
				</TouchableOpacity>
			</View>
			
			<Text style={[styles.question, { left: 24, top: 60 }]}>SN번호로 추가</Text>
			<Text style={[styles.intro1, { left: 24, top: 95 }]}>디바이스의 시리얼번호와 안전코드를 입력하세요.</Text>

			<View style={[styles.line, {top: 115, left: 24, width: '86%'}]} />
				
            <Text style={[styles.text1, { left: 24, top: 150 }]}>시리얼넘버(필수)</Text>
			<Text style={[styles.text1, { left: 135, top: 150, color: '#6A6ED1', fontSize: 16 }]}>*</Text>

				
				
				
            <TextInput  value={serial} style={[styles.textinput, {top: 178 }]}
                        onChangeText={setSerial} placeholder="시리얼 번호" maxLength={15}
                        placeholderTextColor="#D9D9D9" />

            <Text style={[styles.text1, { left: 24, top: 235 }]}>안전코드(선택)</Text>
			<Text style={[styles.text1, { left: 121, top: 235, color: '#6A6ED1', fontSize: 16 }]}>*</Text>

            <TextInput  style={[styles.textinput, {top: 263 }]}
                        onChangeText={setCode} placeholder="안전코드는 선택사항입니다." maxLength={9}
                        placeholderTextColor="#D9D9D9" />
            <TouchableOpacity  onPress={serial === '' ? () =>  {Alert.alert("시리얼번호","시리얼 번호를 입력하세요")}   :
                                         handleDeviceData } style={styles.Component1} >
										             
			    <Text  style={styles.button}>다음</Text>		  
            </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
root: {
	width: '100%', height: 800,
	backgroundColor: '#FFFFFF',
},

back_arrow: {
    position: 'absolute', left: 10, top: 15,
	width: 20, 
	height: 20,
},

intro: {
    position: 'relative',  top: 118,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 19.09,
    textAlign: 'center',
	
    color: '#000000',
},


title: {
    position: 'absolute', left: 125, top: 11,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: 23,
    color: '#000000',
},

question: {
    position: 'absolute', top: 180,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 28.8,
    marginTop: 5,
    color:'#322E7F',
	textAlign: 'center',
	alignItems: 'center',
},

line: {
	borderColor: '#E0E0E0',
	borderWidth: 0.5,
	width: '80%',
},


text1: {
    position: 'absolute', left: 40, top: 105,
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 21,
    color: '#4D4D4D',
},
text2: {
    position: 'absolute', left: '11.11%', top: 355,
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 10,
    lineHeight: 14,
    color: '#4D4D4D',
},
square:{
    position: 'absolute', left: '8%', right: '40%', top: 350,
    backgroundColor: 'transparent',                              // 배경색을 투명하게 설정
    padding: 35,                                                 // 내부 여백 설정
    borderWidth: 0.5,                                              // 테두리 두께 설정
    borderColor: '#000000',                                      // 테두리 색상 설정
    borderRadius: 5,
},

textinput: {
    position: 'absolute', left: 24, 
	width: '86%',
	height: 44,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
	borderWidth:1,
	borderColor: '#D6D9EB',


	
},

Component1: {
    position: 'absolute', left: 24, right: 24, top: 715,
    height: 44,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4543BA',
    borderRadius: 2,
},
button: {
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 17,
    textAlign: 'center',
	color: '#FFFFFF',
},
});

export default Page_12000;
