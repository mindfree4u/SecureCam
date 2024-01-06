import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const Page_42000 = ({ navigation}) => {
  const [opinion, setOpinion] = useState('');
  const [agree1, setAgree1] = useState('');

  return (
    <ScrollView>
            <View style={styles.root}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.vector}>
                <Image source={require('../images/arrow.png')} style={{width: 16.17, height: 19.8}}/>
            </TouchableOpacity>
            <Text style={styles.회원탈퇴}>회원탈퇴</Text>
            <Text style={styles.text1}>정말로 탈퇴하시겠습니까?</Text>
            <Text style={styles.text2}>지금 탈퇴하시면 서버에 저장하신{'\n'} 녹화영상을 더이상 이용하실 수 없습니다.</Text>
            <CheckBox style={{position: 'absolute', left: 43, top: 182,}}
                                  tintColors={{ true: '#4D4D4D' }}
                                  value={agree1}
                                  onValueChange={setAgree1}
                         />
            <Text style={[styles.text2,{left: 69, top: 190}]}>위 내용을 확인하였으며 동의합니다. (필수)</Text>
            <Text style={[styles.text1,{top: '30.38%'}]}>탈퇴 사유를 알려주세요.</Text>
            <TextInput  value={opinion} style={styles.textinput}
                        onChangeText={setOpinion}
                        placeholder="고객님의 소중한 피드백을 담아 더 나은 서비스로 개선하겠습니다."
                        placeholderTextColor="#D9D9D9" multiline={true} />
            <TouchableOpacity  onPress={() => navigation.navigate('Login')} style={styles.Component1}>
                <Text  style={styles.다음}>회원탈퇴</Text>
            </TouchableOpacity>
            </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
root: {
    position: 'relative', width: '100%', height: 800,
    justifyContent: 'center'
},
vector: {
    position: 'absolute', left: 20, top: 21.1,
},
회원탈퇴: {
    position: 'absolute', left: '41.94%', top: '2.38%',

    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
    /* Text/b01 */
    color: '#000000',
},
text1: {
    position: 'absolute', left: '11.11%', top: '13.12%',

    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 23,
    /* Text/b02 */
    color: '#4D4D4D',
},
text2: {
    position: 'absolute', left: '11.11%', top: '17.75%',

    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 10,
    lineHeight: 14,
    /* Text/b02 */
    color: '#6F6F6F',
},

img1: {
     position: 'absolute', left: '14%', width: 280, top: 164,
     height: 167,
},
textinput: {
    position: 'absolute', left: '14.44%', right: '14.72%', top: '36.38%', bottom: '50.35%',

    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
},
line:{
    position: 'absolute', left: '11.11%', right: '11.39%', top: 410,

    borderBottomWidth:1,
    borderBottomColor: '#ACACAC',
},
Component1: {
    position: 'absolute', left: '11.11%', right: '11.11%', top: 717,
    height: 44,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 5,
},
다음: {
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',

    color: '#000000',
},
});

export default Page_42000;

