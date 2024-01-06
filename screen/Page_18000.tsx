import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const Intro_18000 = ({ navigation }) => {

  return (
    <ScrollView>
        <View style={styles.root}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.vector}>
                <Image source={require('../images/arrow.png')} style={{width: 16.17, height: 19.8}}/>
            </TouchableOpacity>
            <Text style={styles.My}>My</Text>
            <Text style={[styles.My, {top:100, left:'12%' }]}>즐겨찾기</Text>
            <Text style={[styles.text1, {top:100, right:'12%' }]}>더보기</Text>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
root: {
    position: 'relative',width: '100%', height: 800,
    background: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
},
vector: {
    position: 'absolute', left: 20, top: 21.1, color: '#FFFFFF',
},
img1: {
     position: 'absolute', top: 219.5,
},
My: {
    position: 'absolute', top: 19,
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
    color: '#000000',
},
text1: {
    position: 'absolute', top: 19,
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 10,
    lineHeight: 23,
    textAlign: 'center',
    color: '#4D4D4D',
},
});

export default Intro_18000;
