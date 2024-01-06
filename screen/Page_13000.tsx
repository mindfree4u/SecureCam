import React, { useContext } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { deviceDataContext } from '../App';

const Page_13000 = ({ navigation, route }) => {
  const { deviceData, setDeviceData } = useContext(deviceDataContext);
  const { port } = route.params;

  return (
    <View style={styles.root}>
	<View >
		<View style={styles.intro}>
			<TouchableOpacity onPress={() => navigation.navigate('Page_13200')}>
				<Image style={styles.back_arrow} source={require('../images/arrow.png')}/>
				<Text style={styles.장치추가}>IP / 도메인으로 추가</Text>
				<View style={[styles.line, {top: 45, width: '100%'}]} />
			</TouchableOpacity>
		</View>
  
        <Text style={[styles.device_grp_name, ]}>카메라</Text>
		<View style={[styles.cameracontainer, {top: 110}]}>
			<TouchableOpacity  style={styles.Component1} onPress={() => navigation.navigate('Page_13100', { port, DEVTYPE:'C' } ) }>
				<View style={styles.device}>
					<Image style={styles.device_img} source={require('../images/net_cam.png')}/>
					<Text style={styles.device_name}>네트워크 카메라</Text>
				</View>
			</TouchableOpacity>

			<View style={[{right:10}]}>
					<Text style={styles.device_name1}> </Text>
			</View>

			<TouchableOpacity  style={styles.Component1} onPress={() => navigation.navigate('Page_13100', { port, DEVTYPE:'C' } ) }>
				<Image style={styles.device_img} source={require('../images/anal_cam.png')}/>
				<Text style={styles.device_name}>아날로그 카메라</Text>
			</TouchableOpacity>
		</View>
		
		<View style={[styles.cameracontainer, {top:220}]}>
			<TouchableOpacity  style={styles.Component1} onPress={() => navigation.navigate('Page_13100', { port, DEVTYPE:'C' } ) }>
				<Image style={styles.device_img} source={require('../images/ptz_cam.png')}/>
				<Text style={styles.device_name}>PTZ</Text>
			</TouchableOpacity>
			<TouchableOpacity  style={styles.Component2} >
			</TouchableOpacity>
		</View>
			
		<View style={[styles.line_mid, {top:300}]}/>

        <Text style={[styles.device_grp_name, {top: 315}]}>저장장치</Text>
		<View style={[styles.cameracontainer, {top: 405}]}>
			<TouchableOpacity  style={styles.Component1} onPress={() => navigation.navigate('Page_13100', { port, DEVTYPE:'C' } ) }>
				<View style={styles.device}>
					<Image style={styles.device_img} source={require('../images/nvr_device.png')}/>
					<Text style={styles.device_name}>NVR</Text>
				</View>
			</TouchableOpacity>
			<View style={[{right:10}]}>
					<Text style={styles.device_name}> </Text>
			</View>			
			<TouchableOpacity  style={styles.Component1} onPress={() => navigation.navigate('Page_13100', { port, DEVTYPE:'C' } ) }>
				<Image style={styles.device_img} source={require('../images/dvr_device.png')}/>
				<Text style={styles.device_name}>DVR</Text>
			</TouchableOpacity>
		</View>

		<View style={[styles.line_mid, {top:448}]}/>		
        <Text style={[styles.device_grp_name, {top: 460}]}>특수카메라</Text>
		<View style={[styles.cameracontainer, {top: 590}]}>
			<TouchableOpacity  style={styles.Component1} onPress={() => navigation.navigate('Page_13100', { port, DEVTYPE:'C' } ) }>
				<View style={styles.device}>
					<Image style={styles.device_img} source={require('../images/multicam.png')}/>
					<Text style={styles.device_name}>멀티캠</Text>
				</View>
			</TouchableOpacity>
			<View style={[{right:10}]}>
					<Text style={styles.device_name}> </Text>
			</View>			
			<TouchableOpacity  style={styles.Component1} onPress={() => navigation.navigate('Page_13100', { port, DEVTYPE:'C' } ) }>
				<Image style={styles.device_img} source={require('../images/doorcam.png')}/>
				<Text style={styles.device_name}>도어캡</Text>
			</TouchableOpacity>
		</View>
		<View style={[styles.line_mid, {top:595}]}/>
       </View>
    </View>
  );
};

const styles = StyleSheet.create({
root: {
	width: '100%', height: 800,
	backgroundColor:'#FFFFFF',
},

back_arrow: {
    position: 'absolute', left: 10, top: 11,
	width: 20, 
	height: 20,
},

장치추가: {
    position: 'absolute', left: "30%", top: 11,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: 23,
    color: '#000000',
},

line: {
	borderColor: '#E0E0E0',
	backgroundColor: '#E0E0E0',
	borderWidth: 0.5,
	width: '100%',
},

line_mid: {
	borderColor: '#F5F5F5',
	backgroundColor: '#F5F5F5',
	borderWidth: 0.5,
	width: '100%',
	height:4,
},

device_grp_name: {
	top: 55,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 28.8,
    marginTop: 5,
    color:'#322E7F',
	textAlign: 'center',
	alignItems: 'center',
},

device: {
	flexDirection: 'column',
	justifyContent: 'center',
},

device_img: {
	top: 2, left: '34%',
	width: 50, 
	height: 50,
	color: '#6A6ED1',
},

device_name: {
	left: '2%', top:2,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 16,
    textAlign: 'center',
    color: '#4F4F4F',

},

device_name1: {
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    color: '#4F4F4F',
},

text1: {
    position: 'absolute', left:60, top:100,
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 20,
    color: '#4D4D4D',
},

cameracontainer: {
    position: 'absolute', left: 25, right: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
	widht: '80%',
	borderColor: '#2D2D2D',


},

Component1: {
    width:'47%', height: 100,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
	borderColor: '#E0E0E0',
	borderWidth: 1,
},

Component2: {
    width:'45%', height: 100,
    justifyContent: 'center',
},

});

export default Page_13000;
