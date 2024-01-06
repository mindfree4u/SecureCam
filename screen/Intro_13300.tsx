import React, { useState,  useEffect, useContext } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, Modal, StyleSheet, ScrollView, PermissionsAndroid } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';

const Intro_13300 = ({ navigation, route }) => {


  return (
  
     <View style={[styles.root, {color:'#FF0000'}]}>
        <View>
			<View style={styles.intro}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Image style={styles.back_arrow} source={require('../images/arrow.png')}/>
					<Text style={styles.비밀번호}>비밀번호 설정</Text>
				</TouchableOpacity>
			</View>
			<View style={[styles.line, {top: 45, width: '100%'}]} />


			<View style={styles.top_grp}>
				<Image source={require('../images/passwd_ok.png')} style={styles.passwd_init_ok_img}/>
				<Text style={styles.question}>비밀번호 재설정 완료</Text>
				<Text style={styles.text1}>재설정한 비밀번호로{'\n'}로그인을 진행해 주세요.</Text>


				
			</View>
			
			<TouchableOpacity style={styles.Component1} onPress={() => navigation.navigate('Intro_10000')}  >
					<Text style={styles.text3}>로그인 하기</Text>
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

line: {
	borderColor: '#E0E0E0',
	borderWidth: 0.5,
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
    position: 'absolute', top: 230,
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
    position: 'absolute', top: 335,
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
    position: 'absolute', top:  367,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 16.71,
    color: '#4F4F4F',
	textAlign: 'center',
},

Component1: {
    position: 'absolute', left: '11.11%', width:'77%', top: 715, height: 44,
    alignItems: 'center',
    backgroundColor: '#4543BA',
	borderColor: '#4543BA',
	borderWidth: 1,
    borderRadius: 2,
	marginTop: 8,
},

text3: {
    fontFamily: 'Pretendard', fontStyle: 'normal', fontWeight: 700, fontSize: 16, lineHeight: 19.09,
    textAlign: 'center',
    color: '#FFFFFF',
	marginTop:11,
},

});

export default Intro_13300;