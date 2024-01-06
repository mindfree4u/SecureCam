import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { CameraScreen } from 'react-native-camera-kit';

const Page_11000 = ({ navigation }) => {
  const [scanned, setScanned] = useState(false);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!scanned) {
        navigation.navigate('Page_13200', { deviceData: '' });
      }
    }, 50000);
    setTimerId(timer);
    return () => clearTimeout(timer);
  }, [scanned]);


  const handleQRCodeScan = (event) => {
    setScanned(true);
    clearTimeout(timerId);
    navigation.navigate('Page_13000', { deviceData: event.nativeEvent.codeStringValue });
  };

  return (
  <View style={{flex: 1, }} >
   <View >
     <View style={styles.root}>
            <TouchableOpacity onPress={() => navigation.navigate('Intro_10000')} style={styles.vector}>
                <Image source={require('../images/arrow.png')} style={{width: 16.17, height: 19.8}}/>
            </TouchableOpacity>
            <Text style={styles.title}>QR코드로 추가</Text>


	</View>
	        <Text style={[styles.text1, {zIndex: 1}]}>기기 본체에 있는 QR코드를 스캔하십시오.</Text>
	<View style={{top: 40, }}>
        <CameraScreen
          key={Date.now()}
          scanBarcode={true}
          onReadCode={handleQRCodeScan}
          showFrame={true}
          laserColor='red'
          frameColor='white'
        />		
	</View>
    </View>
	</View>
  );
};

const styles = StyleSheet.create({
root: {
    position: 'absolute', width: '100%',
    backgroundColor: '#000000',
	flex:1,
},

vector: {
    position: 'absolute', left: 10, top: 10,
},


title: {
    position: 'absolute', left:'35%', top: 10,
    fontFamily: 'Gothic A1',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 19.09,
    color: '#000000',
	backgrooundColor: '#FFFFFF',
},

text1: {
    position: 'absolute', left:'16.66%', top: 250,
    fontFamily: 'Gothic A1',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
},

});
export default Page_11000;
