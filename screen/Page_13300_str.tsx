import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, NativeModules, DeviceEventEmitter } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { deviceDataContext } from '../App';

const Page_13300 = ({ navigation }) => {
  let flag = false;
  const { deviceData, setDeviceData } = useContext(deviceDataContext);
  const [deviceInfos, setDeviceInfos] = useState([]);
  const { DeviceSearchModule } = NativeModules;

//화면업데이트
useFocusEffect(
  React.useCallback(() => {
    getdeviceInfos();
      }, [ ])
  );

const getdeviceInfos =() => {

  // 장치 검색 시작
  DeviceSearchModule.startSearchDevices();


  const subscription = DeviceEventEmitter.addListener('onDeviceFound', async(deviceInfo) => {
	flag =true;
	setDeviceInfos((prevDeviceInfos) => [...prevDeviceInfos, deviceInfo]);

	if (deviceInfo.length === 0 ) {
				navigation.navigate('Page_13200');
			  }
  });
  
	setTimeout(() => {
		if (!flag) {
			navigation.navigate('Page_13200');
		}
	}, 1500);

  // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
  return () => {
    subscription.remove();

  };
};


  return (
    <View style={styles.root}>
        <View >
			<View style={styles.intro}>
				<TouchableOpacity onPress={() => navigation.navigate('Page_13200')}>
					<Image style={styles.back_arrow} source={require('../images/arrow.png')}/>
					<Text style={styles.장치추가}>온라인검색으로 추가</Text>
					<View style={[styles.line, {top: 45, width: '100%'}]} />
				</TouchableOpacity>
			</View>
			
			<Text style={styles.text1}>추가할 장치를 선택해 주세요.</Text>

			<View style={styles.container1}>
				<View style={[styles.line_mid]} />
				{deviceInfos.map((info) => (
				 <TouchableOpacity key={info.DEVINFO}
						onPress={() => navigation.navigate('Page_13100', { DEVTYPE:info.DEVTYPE, IP:info.IP, port:'37777' })}>

					<View style={styles.container2}>

						<View >
							<Image style = {styles.image} source={require('../images/NVR.png')} />
						</View>
						<View key={info.DEVINFO}>
							<Text style={styles.deviceText}>
								{info.DEVINFO}
							</Text>
						</View>
					</View>
					<View style={[styles.line_mid]} />
					</TouchableOpacity>
				))}
			</View>			
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
root: {
	width: '100%', height: 800,
	backgroundColor:'#FFFFFF',
},

row: {
	flexDirection: 'row',
},

intro: {

},
back_arrow: {
    position: 'absolute', left: 10, top: 11,
	width: 20, 
	height: 20,
},

장치추가: {
    position: 'absolute', left: '15%', top: 11,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: 23,
    color: '#000000',

},

text1: {
    position: 'relative', top: 85,
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 21,
    color: '#222222',
	textAlign: 'center',
},

container1:{
   position: 'absolute', left: 0, top: 120,
   width: '100%',
},

container2:{
    flex: 1,
    flexDirection: 'row',
	left: 24,
},

line_mid: {
	left: 24,
	top:25,
	marginRight: 20,
	borderColor: '#E0E0E0',
	borderWidth: 0.5,
	width: '86%',
},

line: {
	borderColor: '#E0E0E0',
	borderWidth: 0.5,
	width: '80%',
},



item: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    margin: 10
},

image: {
    flex: 1,
	width: 110,
	height: 30,
	top: 20,

  },

deviceText: {
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 21,
    color: '#4D4D4D',
    marginTop: 35,
	left: 15
  },
});


export default Page_13300;