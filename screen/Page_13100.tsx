import React, { useState, useContext } from 'react';
import { View, Text, NativeModules, TextInput, StyleSheet, ScrollView, Image, Alert, ImageBackground, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { deviceDataContext, SaltContext } from '../App';
import axios from 'axios';

const Page_13100 = ({ navigation, route }) => {
  const { DEVTYPE, IP, port} = route.params;
  const { deviceData, setDeviceData } = useContext(deviceDataContext);
  const [type, setType] = React.useState(DEVTYPE);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [address, setAddress] = React.useState(IP);
  const [portNum, setPortNum] = React.useState( port );
  const [nickname, setNickname] = React.useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const placeholderTextColor = port ?  '#000000' : '#D9D9D9' ;                   // port 값을 받았는지 여부에 따라 placeholder 색상을 설정
  const { IPLoginModule } = NativeModules;
  const [saltVl, setSaltVl] = React.useState('');
  const saltContext = useContext(SaltContext);

// 추가 버튼 클릭시 호출됨
const handleAdd =() => {
  let newType = type;
  if(type === 'DVR' || type ==='NVR') {
    newType = 'R';
  }
  const newAddress = address;                                  // 사용자로부터 입력 받은 주소
  //const newPort = portNum !== '' ? parseInt(portNum) : 0;
  const newPort = portNum;
  const newNickname = nickname;
  const newUsername = email;                                  // 사용자로부터 입력 받은 아이디
  const newPassword = password;

  if(address == '' || email === '' || nickname ==='') {
    Alert.alert("정보 입력", "정보를 입력해 주세요.")
	return;
  }

     IPLoginModule.login(newAddress, newPort, newUsername, newPassword)
         .then(sn => {
           if (sn) {
           const newSerial = sn;
           const salt_vl = saltContext.salt;
           const EQPMNT_TYPE_CT = newType;
           const EQPMNT_CNTN_ADDR = newAddress;
           const EQPMNT_CNTN_PORT = newPort;
           const EQPMNT_NM = newNickname;
           const EQPMNT_ID = newUsername;
           const EQPMNT_PSWD = newPassword;
           const EQPMNT_SERIAL_NO = newSerial;
           const EQPMNT_SAFETY_CD = '';

           const url = 'http://seeguard.ggulb.net/MdeviceAdd';

      // 요청에 전달할 데이터
           const data = {
           salt_vl: salt_vl,
           eqpmnt_type_ct: EQPMNT_TYPE_CT,             //장치구분
           eqpmnt_cntn_addr: EQPMNT_CNTN_ADDR,         //장치주소
           eqpmnt_cntn_port: EQPMNT_CNTN_PORT,         //장치포트
           eqpmnt_nm: EQPMNT_NM,                       //장치닉네임
           eqpmnt_id: EQPMNT_ID,                       //장치접속아이디
           eqpmnt_pswd: EQPMNT_PSWD,                   //장치접속비밀번호
           eqpmnt_serial_no: EQPMNT_SERIAL_NO,         //장치시리얼번호
           eqpmnt_safety_cd: EQPMNT_SAFETY_CD,         //장치안전코드
           };

          // Axios를 사용하여 GET 요청 보내기
           axios
           .get(url, { params: data })
           .then((response) => {
           console.log('MdeviceAdd 응답 데이터:', response.data);

           if (response.data.rtnCode === "1") {
               Alert.alert('', '장치가 추가되었습니다.', [{ text: '확인' }]);
                 // rtnCode가 1인 경우 페이지 이동
               navigation.navigate('Page_10000', { address: newAddress, port: newPort, nickname: nickname, username: newUsername, password: newPassword});
               }
           else if (response.data.rtnMsg === "이미 등록된 기기 접속 정보 입니다") {
               Alert.alert('', '이미 등록된 기기 접속 정보 입니다.', [{ text: '확인' }]);

                   }
         })
         .catch((error) => {
                    console.error('MdeviceAdd 오류 발생:', error);
                    });
}
})
         .catch(error => {
           setErrorMessage('장치 추가에 실패하였습니다');
         });
};

  return (
  
    <View style={styles.root}>

		<View style={styles.intro}>
            <TouchableOpacity onPress={()=> navigation.navigate('Page_13000',  { port: '37777' } ) } style={styles.vector}>
				<Image style={styles.back_arrow} source={require('../images/arrow.png')}/>
				<Text style={styles.장치추가}>장치추가</Text>
				<View style={[styles.line, {top: 45, width: '100%'}]} />
			</TouchableOpacity>
		</View>  
		
            <Text style={styles.text0}>장치정보 입력</Text>
            <Text style={styles.text1}>아래에 정보를 입력해주세요.</Text>

            <Text style={[styles.text2, {top:170}]}>IP주소</Text>
			<Text style={[styles.text1, { left: 73, top: 169, color: '#6A6ED1', fontSize: 16 }]}>*</Text>
            <View style={[styles.square, {top:200}]}/>
            <TextInput style={[styles.textinput, {top:199}]} value={address} onChangeText={setAddress} maxLength={20}
                       placeholder='IP주소를 입력해 주세요' placeholderTextColor="#D9D9D9" />

            <Text style={[styles.text2, {top:270}]}>포트번호</Text>
			<Text style={[styles.text1, { left: 87, top: 270, color: '#6A6ED1', fontSize: 16 }]}>*</Text>
            <View style={[styles.square, {top:300}]}/>
            <TextInput style={[styles.textinput, {top:299}]} value={portNum} onChangeText={setPortNum} maxLength={10}
                       placeholder={port}  placeholderTextColor={placeholderTextColor} />

            <Text style={[styles.text2, {top:370}]}>장치 닉네임</Text>
			<Text style={[styles.text1, { left: 107, top: 370, color: '#6A6ED1', fontSize: 16 }]}>*</Text>
            <View style={[styles.square, {top:400}]}/>
            <TextInput style={[styles.textinput, {top:399}]} value={nickname} onChangeText={setNickname} maxLength={10}
                        placeholder="예시)남측CCTV 주차장" placeholderTextColor="#D9D9D9" />

            <Text style={[styles.text2, {top:470}]}>아이디</Text>
			<Text style={[styles.text1, { left: 73, top: 470, color: '#6A6ED1', fontSize: 16 }]}>*</Text>
            <View style={[styles.square, {top:500}]}/>
            <TextInput style={[styles.textinput, {top:499}]} value={email} onChangeText={setEmail}
                                           placeholder="abcd@abcd.com" placeholderTextColor="#D9D9D9" />
            <Text style={[styles.text2,{top:570}]}>비밀번호</Text>
			<Text style={[styles.text1, { left: 87, top: 570, color: '#6A6ED1', fontSize: 16 }]}>*</Text>
            <View style={[styles.square,{ top: 600}]} />
            <TextInput style={[styles.textinput, {top:599}]} value={password}
                       onChangeText={setPassword} secureTextEntry={true}
                       placeholder="영문,숫자 포함 8자리 이상" placeholderTextColor="#D9D9D9"/>
            <Text style={[styles.text3,{left: '12%', top:694}]}>{errorMessage}</Text>
            <TouchableOpacity style={[styles.Component1, {top:715}]} onPress={handleAdd}>
                <Text style={styles.추가}>추가</Text>
            </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
root: {
	width: '100%',
	height: 800,
	backgroundColor:'#FFFFFF',
},

back_arrow: {
    position: 'absolute', left: 10, top: 11,
	width: 20, 
	height: 20,
},

장치추가: {
    position: 'absolute', left: '41%', top: 11,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: 23,
    color: '#000000',
},

line: {
	borderColor: '#E0E0E0',
	borderWidth: 0.5,
	width: '100%',

},

text0: {
    position: 'absolute', left:24, top:80,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 22,
    lineHeight: 26,
    color: '#222222',
},

text1: {
    position: 'absolute', left:24, top:110,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 20,
    color: '#4F4F4F',
},

text2: {
    position: 'absolute', left: 24, top: 500,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 20,
    color: '#222222',
},

textinput: {
    position: 'absolute', left: 28, top: 522, width: '73%',
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 17,
    color: '#4D4D4D',
},

square:{
    position: 'absolute', left: 24, right: 24, top: 500,
    backgroundColor: 'transparent',                                // 배경색을 투명하게 설정
    height: 44,
    borderWidth: 0.5,                                              // 테두리 두께 설정
    borderColor: '#000000',                                        // 테두리 색상 설정
    borderRadius: 2,
},
text3: {
    position: 'absolute', left: '8%', top: 440,
    fontFamily: 'Inter', fontStyle: 'normal', fontWeight: 400, fontSize: 10,
    lineHeight: 12.1,
    textAlign: 'left',
    color: '#F00101',
},

Component1: {
    position: 'absolute', left: 24, right: 24, top: 715, height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4543BA',
    borderRadius: 5,
},

추가: {
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 17,
    textAlign: 'center',
    color: '#FFFFFF',
},
});

export default Page_13100;