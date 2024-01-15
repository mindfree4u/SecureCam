import React, { useState,  useEffect, useContext } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, Modal, StyleSheet, ScrollView, PermissionsAndroid } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useRoute } from '@react-navigation/native';
//import styles from './styles/Intro_11000styles';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';

const Intro_11000 = ({ navigation, route }) => {
  const [isPrivacyVisible, setIsPrivacyVisible] = useState(false);                           //개인정보 이용약관 보이기 상태저장
  const [isServiceVisible, setIsServiceVisible] = useState(false);                           //서비스 이용약관 보이기 상태저장
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailAvailable, setIsEmailAvailable] = useState('');                           //이메일 체크상태, 초기상태 false
  const [isNameAvailable, setIsNameAvailable] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [agree1, setAgree1] = useState('');
  const [agree2, setAgree2] = useState('');
  const [phone, setPhone] = useState(null);

//본인 휴대폰번호 가져오기 시작
useEffect(() => {
  const getPhoneNumber = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS)

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const phoneNumber = await DeviceInfo.getPhoneNumber();
        const modifiedPhoneNumber = phoneNumber.replace(/^\+\d{2}/, '0');
        setPhone(modifiedPhoneNumber);
      } else {
        console.log("Permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  getPhoneNumber();
}, []);
//본인 휴대폰번호 가져오기 끝

  //개인정보 이용약관 자세히보기 클릭시 호출됨
  const showPrivacyTerms = () => {
    setIsPrivacyVisible(true);
  };
  //서비스 이용약관 자세히보기 클릭시 호출됨
  const showServiceTerms = () => {
    setIsServiceVisible(true);
  };

  const closePrivacyTerms = () => {
    setIsPrivacyVisible(false);
  };

  const closeServiceTerms = () => {
    setIsServiceVisible(false);
  };

  //이메일 입력시 호출됨
  const handleEmail = (text) => {
  setEmail(text);
  setIsEmailAvailable(false);
  };

duplicationCheck = () => {
    if (!email ) {
               Alert.alert( '','이메일 주소를 입력하세요.', [{ text: '확인' }]);
               return;
        }
    else  if (!email.includes('@') || !email.includes('.')) {
           Alert.alert( '','이메일 형식이 올바르지 않습니다.', [{ text: '확인' }]);
           return;
    }

    else {
    // 아이디 중복 체크
    const url = 'http://seeguard.ggulb.net/MisMailUsed';
    const eml_addr = email;

    const data = {
               eml_addr: eml_addr
               };

    axios
            .get(url, { params: data })
            .then((response) => {
                if (response.data.rtnCode === "N") {
                    setIsEmailAvailable(true);
                } else if (response.data.rtnCode === "Y") {
                    setIsEmailAvailable('duplication');;
                } else {
                }
            })
            .catch((error) => {
            });
    }
  };

  //성명 입력시 호출됨
  const handleName = (text) => {
  setName(text);
  setIsNameAvailable(true);
  };

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

//가입완료 버튼 클릭시 호출됨
  const handleSignUp = () => {
      if (!email) {
              Alert.alert('', '이메일 주소를 입력하세요.', [{ text: '확인' }]);
            }
      else if (!isEmailAvailable) {
            Alert.alert('', '이메일 중복체크가 이루어지지 않았습니다.', [{ text: '확인' }]);
      }
      else if (!isNameAvailable) {
                  Alert.alert('', '성명을 입력하세요.', [{ text: '확인' }]);
            }
      else if (!isPasswordValid) {
            Alert.alert('', '비밀번호를 확인해 주세요.', [{ text: '확인' }]);
      }
      else if (!agree1 || !agree2) {
            Alert.alert('', '약관에 동의는 필수입니다.', [{ text: '확인' }]);
      }
      else if (isEmailAvailable === 'duplication' ) {
            Alert.alert('', '이메일 주소를 변경해주세요.', [{ text: '확인' }]);
      }
      else if(isPasswordValid && agree1 && agree2 && isEmailAvailable) {

           const eml_addr = email;
           const pswd = password;
           const mbr_tel = phone;

           const url = 'http://seeguard.ggulb.net/MsignIn';

           const salt = "TemporarySecretKey"            //서버에서 랜덤 생성된 키를 수신하게 변경필요

           // 비밀번호를 솔트와 함께 암호화
           const saltedPassword = salt + pswd;
           const encryptedPassword = CryptoJS.SHA256(saltedPassword).toString();

          // 요청에 전달할 데이터
           const data = {
           mbr_name: name,
           eml_addr: eml_addr,
           pswd: encryptedPassword,
           mbr_tel: phone
           };

          // Axios를 사용하여 GET 요청 보내기
           axios
           .get(url, { params: data })
           .then((response) => {
          // 서버 응답 데이터를 이용하여 원하는 작업 수행
           console.log('서버 응답 데이터:', response.data);
           if (response.data.rtnCode === "1") {
                // rtnCode가 1인 경우 페이지 이동
                navigation.navigate('Intro_11200');
                          }
           })
          .catch((error) => {
           console.error('오류 발생:', error);
           });

      }
    };

  return (
  <View style={{flex: 1, }} >
   <View >
     <View style={styles.root}>
 
            <TouchableOpacity onPress={() => navigation.navigate('Intro_10000')} style={styles.vector}>

            </TouchableOpacity>
            <Text style={styles.회원가입}>회원가입</Text>
			<View style={[styles.top_line]} />
			<Text style={styles.title}>Secure Cam</Text>
            <Text style={[styles.text0, { left: 24, top: 120 }]}>회원가입을 위해 아래의 정보를 입력해주세요</Text>
			<View style={[styles.line, {top: 155}]} />
						
            <Text style={[styles.text1, { left: 24, top: 180 }]}>이메일주소</Text>
			<Text style={[styles.text1, { left: 104, top: 180, color: '#6A6ED1', fontSize: 16 }]}>*</Text>
            <TextInput style={[styles.textinput, {width: '55%', height: 44,}]} value={email} maxLength={100}
            onChangeText={ handleEmail} placeholder="abcd@abcd.com" placeholderTextColor="#B6BEDB"/>

            <TouchableOpacity style={[styles.Rectangle4, { top: 202, height: 40 }, !isEmailAvailable === 'duplication' | isEmailAvailable ? {borderColor: '#B6BEDB'} : {borderColor: '#000000'}]} onPress= { duplicationCheck }>
            <Text style={[styles.dup_check, !isEmailAvailable === 'duplication' | isEmailAvailable ? {color: '#B6BEDB'} : {color: '#4543BA'}]} >중복확인</Text>

            </TouchableOpacity>
            {isEmailAvailable === true ? (
              <Text style={styles.text5}>*사용 가능한 이메일입니다.</Text>
            ) : isEmailAvailable === 'duplication' ? (
              <Text style={[styles.text5, {color: '#F45669'}]}>*이미 등록된 이메일입니다.</Text>
            ) : null}
			
            <Text style={[styles.text1, { left: 24, top: 265 }]}>휴대폰 번호</Text>
			<Text style={[styles.text1, { left: 108, top: 265, color: '#6A6ED1', fontSize: 16 }]}>*</Text>
            <Text style={[styles.textinput, {height: 44, top:287, padding:10}]} >{phone}</Text>

            <Text style={[styles.text1, { left: 24, top: 347 }]}>성명</Text>
			<Text style={[styles.text1, { left: 58, top: 347, color: '#6A6ED1', fontSize: 16 }]}>*</Text>
            <TextInput  value={name} style={[styles.textinput, {height: 44, top:369, padding:10}]}
                        onChangeText={handleName} placeholder="홍길동" maxLength={14}
                        placeholderTextColor="#D9D9D9" />

            <Text style={[styles.text1, { left: 24, top: 431 }]}>비밀번호</Text>
			<Text style={[styles.text1, { left: 88, top: 431, color: '#6A6ED1', fontSize: 16 }]}>*</Text>

            <TextInput  value={password} style={[styles.textinput, {height: 44, top:452, padding:10}]}
                        onChangeText={handlePasswordChange} placeholder="영문, 숫자 포함 8자이상" maxLength={80}
                        placeholderTextColor="#D9D9D9" secureTextEntry={true} onBlur={handlePasswordChangeBlur} />

            <Text style={[styles.text1, { left: 24, top: 513 }]}>비밀번호 확인</Text>
			<Text style={[styles.text1, { left: 126, top: 513, color: '#6A6ED1', fontSize: 16 }]}>*</Text>

            <TextInput value={confirmPassword} style={[styles.textinput, {height: 44, top:535, padding:10}]}
                       onChangeText={handleConfirmPasswordChange} placeholder="영문, 숫자 포함 8자이상" maxLength={80}
                       placeholderTextColor="#D9D9D9" secureTextEntry={true} onBlur={handleConfirmPasswordChangeBlur} />

            {isPasswordValid ? ( <Text style={[styles.text5, { top: 587 }]}>*사용 가능한 비밀번호입니다.</Text> )
                                :null }
            { !isPasswordValid  && password && confirmPassword ? ( <Text style={[styles.text5, { top: 587, color: '#FA584E' }]}>
                                                                                                        *비밀번호가 일치하지 않습니다.</Text>  )
                                :null }
								

			<View style={[styles.line, {top: 610}]} />


            <Text style={styles.text2}>가입하려면 약관에 동의가 필요합니다.</Text>

            <CheckBox style={{position: 'absolute', left: 19, top: 645, borderRadius: 5, borderWidth:5}}
                      tintColors={{ true: '#4543BA' }}
					  checkedIcon="dot-circle-o"
					  uncheckedIcon="circle-o" 
					  containerStyle={styles.checkboxContainer}
                      value={agree1}
                      onValueChange={setAgree1}
             />
            <Text style={[styles.text0, { left: 48, top: 652 }]}>개인정보 이용 약관 동의(필수)</Text>
            <Text style={[styles.text3, {top: 654}]} onPress={() => showPrivacyTerms()}>자세히보기</Text>
            <CheckBox style={{position: 'absolute', left: 19, top: 673,}} tintColors={{ true: '#4543BA' }}
                      value={agree2} onValueChange={setAgree2} />
            <Text style={[styles.text0, { left: 48, top: 681 }]}>서비스 이용 약관 동의(필수)</Text>
            <Text style={[styles.text3, {top: 683 }]} onPress={() => showServiceTerms()}>자세히보기</Text>
            <TouchableOpacity onPress={handleSignUp} style={styles.Component3} >
                <Text style={styles.text4}>동의하고 회원가입</Text>
            </TouchableOpacity>
						
            <Modal visible={isPrivacyVisible} animationType="slide">
            <ScrollView>
            <View style={styles.modalContainer}>
            <View style={styles.modal}>
            <Text style={{textAlign:'center'}}>개인정보 이용약관</Text>
            <Text style={{textAlign:'left'}}>
                {'\n'}{'\n'}{'\n'}1.개인정보 수집 및 이용에 대한 동의서{'\n'}
                회사는 회원가입, 원활한 서비스 제공을 위해 아래와 같이 개인정보를 처리하기 위하여 개인정보의 수집 및 이용에 대한 동의를 얻고자 합니다.
                {'\n'}{'\n'}
                2. 개인정보 수집 및 이용 목적{'\n'}회사는 개인정보를 다음의 목적을 위해 수집합니다.{'\n'}
                개인정보는 아래 기재된 목적 외 용도로 사용되지 않으며 이용 목적이 변경될 경우 사전 동의를 구할 예정입니다.
                 {'\n'}고객이 구매한 제품의 서비스 제공{'\n'}고객 문의사항에 대한 찾기 및 편집 서비스{'\n'}
                 신규 제품 정보 및 변경 기능의 공지 발송{'\n'}{'\n'}
                3. 개인정보 수집 항목{'\n'}회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.{'\n'}수집항목:
                이메일 주소, 접속 IP주소 정보{'\n'}{'\n'}4. 개인정보의 보유 및 이용기간{'\n'}개인정보는 원칙적으로 개인정보의 수집 및 이용
                 목적이 달성되면 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다. 고객이 개인정보 유지를 원치
                 않는 경우 가입탈퇴 기능을 통해 고객은 정보를 즉시 파기 가능합니다.{'\n'}보존 항목: 이메일 주소,접속 IP 주소 정보{'\n'}보존 사유:
                 "개인정보 수집 및 이용에 대한 동의서"내역 2항의 사유로 명시한 기간동안 보존함.{'\n'}보존 기간:3년{'\n'}{'\n'}
                 5. 동의를 거부할 권리{'\n'}
                 고객은 개인정보의 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 본 동의서에 대해 동의를 하지 않을 경우에는 [개인정보 수집 목적]
                 이행이 불가하여, 서비스 가입이 불가합니다. 이점 양지하시기 바랍니다.{'\n'}{'\n'}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity style={ styles.닫기 } onPress={closePrivacyTerms}>
                        <Text style={{textAlign:'center'}}>닫기</Text>
                    </TouchableOpacity>
              </View>
             </View>
            </View>
            </ScrollView>
            </Modal>

            <Modal visible={isServiceVisible} animationType="slide">
            <ScrollView>
            <View style={styles.modalContainer}>
             <View style={styles.modal}>
              <Text style={{textAlign:'center'}}>서비스 이용약관</Text>
              <Text style={{textAlign:'left'}}>
 {'\n'}{'\n'}{'\n'}[서비스 약관]{'\n'}제 1 장 총 칙{'\n'}{'\n'}제 1 조 (목적){'\n'}이 약관은 SeeGuard 주식회사(이하 "회사"라 합니다.)
 에서 제공하는 인터넷 관련 서비스 (이하 합하여 "서비스"라 합니다.)를 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을
  규정함을 목적으로 합니다.{'\n'}{'\n'}제 2 조 (약관의 효력 및 변경){'\n'}1. 이 약관은 서비스를 통하여 이를 공지하거나 전자메일 등의
  방법으로 회원에게 통지함으로써 효력이 발생합니다.{'\n'}2. 회사는 사정상 중요한 사유가 발생될 경우 사전 고지 없이 이 약관의
  내용을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 공지 또는 통지함으로써 효력이 발생됩니다.{'\n'}3. 회원은 변경된 약관에
  동의하지 않을 경우 회원 해지를 요청할 수 있으며, 변경된 약관의 효력 발생일 이후에도 서비스를 계속 사용할 경우 약관의 변경사항에 동의한
  것으로 간주됩니다.{'\n'}{'\n'}제 3 조 (약관 외 준칙){'\n'}본 약관에 명시되지 아니한 사항에 대해서는 전기통신기본법, 전기통신사업법,
  정보통신망 이용촉진 등에 관한 법률, 개인정보보호법 및 기타 관련 법령의 규정에 따릅니다. {'\n'}{'\n'}제 4조 (용어의 정의){'\n'}이
  약관에서 사용하는 용어의 정의는 다음과 같습니다.{'\n'}{'\n'}①회원 : 회사와 서비스 이용 계약을 체결하고 이용자ID를 부여받은 사람
  {'\n'}②비회원: 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자{'\n'}③이용자: 서비스에 접속하여 이 약관에 따라 회사가 제
  공하는 서비스를 받는 회원{'\n'}④ID: 회원의 식별과 서비스 이용을 위하여 회원이 정하고 회사가 승인하는 이메일주소{'\n'}
  ⑤비밀번호: 회원이 부여받은 ID와 일치되는 회원임을 확인하고, 회원의 비밀보호를 위해 회원 자신이 정한 문자 또는 숫자의 조합{'\n'}
  ⑥해지(탈퇴): 회사 또는 회원이 서비스 개통 후 이용계약을 해약하는 것{'\n'}{'\n'}제 2 장 서비스 이용 계약{'\n'}{'\n'}
  제 5 조 (이용 계약의 성립){'\n'}1.서비스 가입 신청시 본 약관을 읽고 체크를 하면 이 약관에 동의하는 것으로 간주됩니다.{'\n'}
  2.이용계약은 서비스 이용신청 고객의 이용약관 동의 후 이용신청에 대하여 회사가 승낙함으로써 성립합니다.{'\n'}{'\n'}
  제 6조 (이용 신청){'\n'}1.회원에 가입하기 위해서는 회사가 요청하는 소정의 가입신청 양식에서 요구하는 사항을 기록하여 신청
  하여야 합니다.{'\n'}2.가입신청 양식에 기재하는 모든 회원 정보는 모두 실제 데이터인 것으로 간주됩니다.{'\n'}실제 정보를
  입력하지 않은 사용자는 법적인 불이익을 받을 수 있으며, 서비스 이용에 제한을 받을 수 있습니다.{'\n'}{'\n'}제 7 조 (개인정보의 보호
  및 사용){'\n'}1.회사는 회원이 가입시에 제공한 개인정보와 이용자의 서비스 이용중에 발생하는 모든 개인정보를 매우 중요하게 생각하고 있
  습니다.{'\n'}2.회사는 이용 신청시 및 서비스 이용중에 회원이 제공하는 정보 등을 통하여 회원에 관한 정보를 수집하며, 회원의 개인정보는
  본 이용계약의 이행과 본 이용계약상의 서비스 제공을 위한 목적으로 사용됩니다.{'\n'}3.회사는 서비스 제공과 관련하여 취득한 회원의
  신상정보를 본인의 승낙없이 제3자에게 누설 또는 배포할 수 없으며 상업적 목적으로 사용할 수 없습니다. 다만, 다음의 각 호에 해당하는 경
  우에는 그러하지 아니합니다.{'\n'}①관계 법령에 의하여 수사상의 목적으로 관계기간으로부터 요청이 있는 경우{'\n'}②정보통신 윤리위
  원회의 요청이 있는 경우{'\n'}③기타 관계법령에서 정한 절차에 따른 요청이 있는 경우{'\n'}④회원에게 다양한 서비스를 제공하기 위해
  가족 사이트 서비스를 제공하는 경우{'\n'}4.제 3항의 범위 내에서 회사는 업무와 관련하여 회원 전체 또는 일부의 개인정보에 관한 집합적인
  통계 자료를 작성하여 이를 사용할 수 있고, 서비스를 통하여 회원의 기기에 쿠키를 전송할 수 있습니다. 이 경우 회원은 쿠키의 수신을 거부하거나
  쿠키의 수신에 대하여 경고하도록 할 수 있습니다.{'\n'}5.회원은 원하는 경우 언제든 회사에서 제공한 개인정보의 수집과 이용에 대한
  동의를 철회할 수 있으며, 동의의 철회는 회원 탈퇴를 하는 것으로 이루어집니다.{'\n'}{'\n'}제 8조 (이용 신청의 승낙){'\n'}1.회사는 제6조에 따
  른 이용신청 고객에 대하여 본 조 제 2항의 경우를 예외로 하여 서비스 이용을 승낙합니다.{'\n'}2.회사는 아래 사항에 해당하는 경우에 이용신청에 대
  한 승낙을 제한할 수 있고 그사유가 해소될 때까지 승낙을 유보할 수 있습니다.{'\n'}①서비스 관련 설비에 여유가 없는 경우{'\n'}②기술상 지장이 있
  는 경우{'\n'}③기타 회사의 사정상 필요하다고 인정되는 경우{'\n'}3.회사는 아래 사항에 해당하는 경우에 이용신청에 대한 승낙을 하지 않을 수 있
  습니다.{'\n'}①이용자 정보를 허위로 기재하여 신청한 경우{'\n'}②사회의 안녕질서 또는 미풍양속을 저해할 목적으로 신청한 경우{'\n'}③기타 회사
  가 정한 이용신청요건이 미비되었을 때{'\n'}4.제 2항 또는 3항에 의하여 이용신청의 승낙을 유보하거나 승낙하지 아니하는 경우, 회사는 이를 이용신청
  자에게 알려야 합니다. 다만, 회사의 귀책 사유 없이 이용신청자에게 통지할 수 없는 경우는 예외로 합니다.{'\n'}{'\n'}제 9조 (이용 계약 사항의 변
  경){'\n'}1.회원은 서비스 메뉴를 통해 언제든지 본인의 개인정보를 조회하고 수정할 수 있습니다.{'\n'}2.회원은 이용신청시 기재한 사항이 변경되었을 경
  우 서비스 메뉴를 통해 수정을 해야 하며 회원정보를 변경하지 않음으로 인하여 발생하는 문제의 책임은 회원에게 있습니다.{'\n'}{'\n'}제 3장 계약 당
  사자의 의무{'\n'}{'\n'}제 10조 (회사의 의무){'\n'}1.회사는 회원으로부터 제기되는 의견이나 불만이 정당하다고 인정할 경우에는 즉시 처리하도록 노
  력합니다. 다만, 즉시 처리가 곤란한 경우는 회원에게 그 사유와 처리일정을 전자메일 또는 전화 등으로 통보할 수 있습니다.{'\n'}2.회사는 회원 개인정
  보호와 관련하여 제 7조 제 1,2,3항에 제시된 내용을 지킵니다.{'\n'}3.회사는 계속적으로 안정적인 서비스의 제공을 위하여 지속적으로 노력하며, 설비
  에 장애가 생기거나 멸실된 때에는 지체없이 이를 수리 복구합니다. 다만, 천재지변, 비상사태 또는 그 밖에 부득이한 경우에는 그 서비스를 일시 중단하거
  나 중지할 수 있습니다.{'\n'}4.회사는 이용계약의 체결, 계약사항의 변경 및 해지 등 회원과의 계약관련 절차 및 내용 등에 있어 회원에게 편의를 제공하
  도록 노력합니다.{'\n'}{'\n'}제 11 조 (회원의 의무){'\n'}1.회원은 서비스 이용과 관련하여 다음 각 호에 해당하는 행위를 하여서는 안됩니다.{'\n'}
  ①다른 회원의 ID와 비밀번호 등을 도용하는 행위{'\n'}②본 서비스를 통하여 얻은 정보를 회사의 사전승낙 없이 회원의 이용 이외 목적으로 복제하는 행위
  {'\n'}③타인의 특허, 상표, 영업비밀, 저작권 기타 지적재산권을 침해하는 내용을 게시,전자메일 또는 기타의 방법으로 타인에게 유포하는 행위{'\n'}④
  공공질서 및 미풍양속에 위반되는 저속, 음란한 내용의 정보, 문장, 도형 등을 전송, 게시, 전자메일 또는 기타의 방법으로 타인에게 유포하는 행위{'\n'}
  ⑤모욕적이거나 위협적이어서 타인의 프라이버시를 침해할 수 있는 내용을 전송, 게시, 전자메일 또는 기타의 방법으로 타인에게 유포하는 행위{'\n'}⑥범죄
  와 결부된다고 객관적으로 판단되는 행위{'\n'}⑦회사의 승인을 받지 않고 다른 사용자의 개인정보를 수집 또는 저장하느 행위{'\n'}⑧기타 관계법령에 위
  배되는 행위{'\n'}2.회원은 이 약관에서 규정하는 사항과 서비스 이용안내 또는 주의사항 등 회사가 공지 혹은 통지하는 사항을 준수하여야 하며, 기타 회
  사의 업무에 방해되는 행위를 하여서는 안됩니다.{'\n'}3.회원의 ID와 비밀번호에 관한 모든 관리책임은 회원에게 있습니다. 회원에게 부여된 ID와 비밀
  번호의 관리 소홀, 부정 사용에 의하여 발생하는 모든 결과에 대한 책임은 회원에게 있습니다.{'\n'}4.회원은 자신의 ID나 비밀번호가 부정하게 사용되었
  다는 사실을 발견한 경우에는 즉시 회사에 신고하여야 하며, 신고를 하지 않아 발생하는 모든 결과에 대한 책임은 회원에게 있습니다.{'\n'}5.회원은 회사
  의 명시적인 동의가 없는 한 서비스의 이용권한, 기타 이용계약상 지위를 타인에게 양도, 증여할 수 없으며, 이를 담보로 제공할 수 없습니다.{'\n'}
  {'\n'}제 4 장 서비스 제공 및 이용{'\n'}{'\n'}제 12 조 (서비스 이용 시간){'\n'}1.서비스의 이용은 회사가 업무상 또는 기술상 특별한 경우를 제외
  하고는 연중무휴 1일24시간 동안 가능한 것을 원칙으로 합니다. 다만, 회사의 업무상이나 기술상의 이유로 서비스가 일시중지되거나, 운영상의 목적으로 회
  사가 정한 기간에는 서비스가 일시중지될 수 있습니다.이런 경우 회사는 사전 또는 사후 이를 공지합니다.{'\n'}{'\n'}제 13 조 (정보의 제공){'\n'}
  회사는 회원이 서비스 이용 중 필요하다고 인정되는 다양한 정보에 대해서 공지사항이나 전자메일 등의 방법으로 회원에게 제공할 수 있습니다.{'\n'}{'\n'}
  제 14 조 (요금 및 유료정보){'\n'}1.회사가 제공하는 서비스는 기본적으로 무료입니다.단, 서비스 이용시 회사가 제공하는 별도의 유료정보에 대해서는 해
  당 정보에 명시된 요금을 지불하여야 사용 가능합니다.{'\n'}{'\n'}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity style={ styles.닫기 } onPress={closeServiceTerms}>
                        <Text style={{textAlign:'center'}}>닫기</Text>
                    </TouchableOpacity>
              </View>
             </View>
            </View>
            </ScrollView>
            </Modal>

      </View>
	  </View>
     </View>
     );
   };
   
const styles = StyleSheet.create({

root: {
   height:800,
   backgroundColor: '#FFFFFF',
  },
  
title_grp: {
    position: 'absolute', left: 45, top: 350,
 },
 
title: {
    fontFamily: 'Work Sans',
    fontStyle: 'normal',
    lineHeight: 47.6,
    color: '#322E7F',
	marginTop: 70,
	left: 24,
	fontSize: 24,
	fontWeight: 700,
 },
 


vector: {
    position: 'absolute', left: 20, top: 21.1,
},
회원가입: {
    position: 'absolute', left: 24, right: 24, top: 19,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: 23,
    textAlign: 'center',
    textColor: '#222222',
},

반갑습니다: {
    position: 'absolute', left: 40, top: 80,
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 23,
    color: '#4D4D4D',
},

text0: {
    position: 'absolute', left: 24,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 16.71,
    color: '#222222',
},
text1: {
    position: 'absolute',
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 16.71,
    color: '#222222',
},
Component2: {
    position: 'absolute', left: '11.11%', right: '11.11%', top: 164, height: 45.13,
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
    position: 'absolute', left: 24, top: 625,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
    color: '#322E7F',
},

textinput: {
    position: 'absolute', left: 24, width: '86%', top: 200, 
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
	borderWidth:1,
	borderColor: '#D6D9EB',
},

top_line:{
    position: 'relative', width: '100%', top: 50,
    borderBottomWidth:1,
    borderBottomColor: '#E0E0E0',
},

line:{
    position: 'absolute', left: 24, width: '86%', 
    borderBottomWidth:1,
    borderBottomColor: '#E0E0E0',
},


Rectangle4:{
    position: 'absolute', right: '11.41%', top: 170, width: 89, height:40,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#808DD0',
    borderRadius: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
},
Component3: {
    position: 'absolute', left: 24, right: 24, top: 720, height: 45.13,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

	backgroundColor: '#4543BA',
    borderRadius: 2,
},
text3: {
    position: 'absolute', right: '11.11%',
    fontFamily: 'Noto Sans KR', fontStyle: 'normal', fontWeight: 400, fontSize: 12,
    lineHeight: 14,
    textAlign: 'center',
    color: '#4543BA',
},
text4: {
    fontFamily: 'Pretendard', fontStyle: 'normal', fontWeight: 700, fontSize: 16,
    lineHeight: 17,
    textAlign: 'center',
    color: '#FFFFFF',
},

dup_check: {
    fontFamily: 'Pretendard', fontStyle: 'normal', fontWeight: 700, fontSize: 14,
    lineHeight: 16,
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
    position: 'absolute', right: 45, top: 249,
    fontFamily: 'Inter', fontStyle: 'normal', fontWeight: 400, fontSize: 12,
    lineHeight: 12.1,
    textAlign: 'right',
    color: '#008B27',
},

});
   export default Intro_11000;