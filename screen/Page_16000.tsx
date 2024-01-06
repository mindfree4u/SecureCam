import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, NativeModules, TouchableOpacity, StyleSheet, ScrollView, Linking, StatusBar  } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {statusBarStyle} from './styles/statusbar_style';

const Page_16000 = () => {
  const navigation = useNavigation();

   useEffect(() => {
      // Open the LivePreviewActivity
      Linking.openURL('company://LivePreview');

      return () => {
      };
    }, []);



  return (

      <ScrollView>

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

	 
	 
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.vector}>
                <Image source={require('../images/arrow.png')} style={{width: 16.17, height: 19.8}}/>
            </TouchableOpacity>
            <Text style={styles.라이브}>라이브</Text>
            <TouchableOpacity  style={styles.Component1}  >
                <Text style={styles.채널추가}>채널추가</Text>
            </TouchableOpacity>

        </View>
      </ScrollView>
      );
};

const styles = StyleSheet.create({
root: {
    position: 'relative', width: '100%', height: 800,
    alignItems: 'center'
},
vector: {
    position: 'absolute', left: 20, top: 21.1,
},
img1: {
    position: 'absolute', top: 219.5,
},
라이브: {
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 19,
    color: '#000000',
},
Component1: {
    position: 'absolute', right: '5%', top: 21.1,
    width:60, height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0DDBA',
    borderRadius: 5,
},
채널추가: {
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 12,
    lineHeight: 17.38,
    textAlign: 'center',
    color: '#000000',
},
});

export default Page_16000;