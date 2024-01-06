import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const Intro_11200 = ({ navigation }) => {

  return (
    <View>
        <View style={styles.root}>
		
            <TouchableOpacity onPress={() => navigation.navigate('Intro_11000')} style={styles.vector}>
                <Image source={require('../images/arrow.png')} style={{width: 16.17, height: 19.8}}/>
            </TouchableOpacity>
            <Text style={styles.가입완료}>가입완료</Text>
			<View style={[styles.top_line]} />

			<Image source={require('../images/regist_ok.png')} style={{width: 70, height: 70, top: 250}}/>
			<Text style={styles.text0}>회원가입 완료</Text>
            <Text style={[styles.text1, {top:375}]}>로그인 후 편리하게 서비스를 이용하실 수 있습니다.</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Intro_10000')} style={styles.Component1} >
                <Text style={styles.로그인}>로그인 하기</Text>
            </TouchableOpacity>

        </View>
    </View>
  );
};

const styles = StyleSheet.create({
root: {
    position: 'absolute',width: '100%', height: 800,

    backgroundColor: '#FFFFFF',

    alignItems: 'center'
},
vector: {
    position: 'absolute', left: 20, top: 21.1, color: '#FFFFFF',
},

top_line:{
    position: 'absolute', width: '100%', top: 50,
    borderBottomWidth:1,
    borderBottomColor: '#E0E0E0',
},

text0: {
    position: 'absolute',top: 340,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 22,
    lineHeight: 26.25,
    /* Text/b02 */
    color: '#322E7F',
},

text1: {
    position: 'absolute',top: 320,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 16.71,
    /* Text/b02 */
    color: '#322E7F',
},
가입완료: {
    position: 'absolute', top: 19,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: 21.48,
    textAlign: 'center',
    color: '#222222',
},
Component1: {
    position: 'absolute', left: 24, right: 24, top: 715, height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4543BA',
    borderRadius: 2,
},

로그인: {
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 19.09,
    textAlign: 'center',
    color: '#FFFFFF',
},

});

export default Intro_11200;
