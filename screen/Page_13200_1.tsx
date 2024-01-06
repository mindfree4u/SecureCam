import React, { useContext } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { deviceDataContext } from '../App';

const Page_13200 = ({ navigation }) => {
  const { deviceData, setDeviceData } = useContext(deviceDataContext);

  const  handleOnline = () => {
      navigation.navigate('Page_13300');
    };

  return (
    <ScrollView>
            <View style={styles.root}>
            <TouchableOpacity onPress={()=> navigation.navigate('Page_10000')} style={styles.vector}>
                 <Image source={require('../images/arrow.png')} style={{width: 16.17, height: 19.8}}/>
            </TouchableOpacity>
            <Text style={styles.장치추가}>장치추가</Text>
            <View style={styles.Container1}>
                <Text style={styles.text1}>확인된 장치가 없습니다.</Text>
                <Text style={styles.text1}>다시 시도해 주세요.</Text>
            </View>
            <View style={styles.Container2}>
                <TouchableOpacity style={styles.Rectangle3} onPress={()=> navigation.navigate('Page_11000')} >
                    <Text style={styles.text1}>QR코드로 스캔</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.Rectangle3}  onPress={()=> navigation.navigate('Page_12000')}>
                    <Text style={styles.text1}>SN번호로 추가</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.Rectangle3}   onPress={()=> navigation.navigate('Page_13000',  { port: '37777' } ) }>
                    <Text style={styles.text1}>IP 또는 도메인으로 추가</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.Rectangle3} onPress={()=> navigation.navigate('Page_13300')}>
                    <Text style={styles.text1}>온라인검색으로 추가</Text>
                </TouchableOpacity>
            </View>
            </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
root: {
    position: 'relative', width: '100%', height: 800,

    justifyContent: 'center',
    alignItems: 'center'
},
vector: {
    position: 'absolute', left: 20, top: 21.1,
},
장치추가: {
    position: 'absolute', top: 19,
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
    color: '#000000',
},
Container1: {
    flex: 1, position: 'absolute', top: 105,
    justifyContent: 'center',
    alignItems: 'center',
},
text1: {
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 21,
    color: '#4D4D4D',
},
Container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
Rectangle3:{
    width: 190, height:45,
    borderWidth: 1,
    borderColor: '#ACACAC',
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
},
});

export default Page_13200;
