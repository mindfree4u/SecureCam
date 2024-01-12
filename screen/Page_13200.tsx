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
  <View style={styles.root}>
	<View >
		<View style={styles.intro}>
			<TouchableOpacity onPress={() => navigation.navigate('Page_10000')}>
				<Image style={styles.back_arrow} source={require('../images/arrow.png')}/>
				<Text style={styles.장치추가}>장치추가</Text>
				<View style={[styles.line, {top: 45, width: '100%'}]} />
			</TouchableOpacity>
		</View>
  
        <Text style={[styles.question, { left: 24, top: 70 }]}>추가방식 선택</Text>
        <Text style={[styles.intro1, { left: 24, top: 110 }]}>원하는 추가방식을 선택해주세요.</Text>



		<View style={[{top: 100}]}>
             <View>

				<View style={[styles.row, {top: 45, left: 24}]}>
					<View style={[styles.line, {top: -10, left:0, width: '86%'}]} />
					<Image style={[styles.img, {top: 3, left:0}]} source={require('../images/qr_code.png')}/>
					<Text style={[styles.text1, {left: 44, top: 8}]}>QR코드로 스캔</Text>
					<TouchableOpacity onPress={()=> navigation.navigate('Page_11000')} >
						<Image style={styles.right_arrow} source={require('../images/right_arrow.png')}/>
					</TouchableOpacity>
				</View>
				
				<View style={[styles.row, {top: 96, left: 24}]}>
					<View style={[styles.line, {top: -10, left:0, width: '86%'}]} />
					<Image style={[styles.img, {top: 3, left:0}]} source={require('../images/sn.png')}/>
					<Text style={[styles.text1, {left: 44, top: 8}]}>SN번호로 추가</Text>
					<TouchableOpacity onPress={()=> navigation.navigate('Page_12000', { serialNo: '' } ) }>
						<Image style={styles.right_arrow} source={require('../images/right_arrow.png')}/>
					</TouchableOpacity>
				</View>

				<View style={[styles.row, {top: 147, left: 24}]}>
					<View style={[styles.line, {top: -10, left:0, width: '86%'}]} />
					<Image style={[styles.img, {top: 3, left:0}]} source={require('../images/ip_domain.png')}/>
					<Text style={[styles.text1, {left: 44, top: 8}]}>IP 또는 도메인으로 추가</Text>
					<TouchableOpacity onPress={()=> navigation.navigate('Page_13000',  { port: '37777' } ) }>
						<Image style={styles.right_arrow} source={require('../images/right_arrow.png')}/>
					</TouchableOpacity>
				</View>				

				<View style={[styles.row, {top: 198, left: 24}]}>
					<View style={[styles.line, {top: -10, left:0, width: '86%'}]} />
					<Image style={[styles.img, {top: 3, left:0}]} source={require('../images/online.png')}/>
					<Text style={[styles.text1, {left: 44, top: 8}]}>온라인검색으로 추가</Text>
					<TouchableOpacity onPress={handleOnline} >
						<Image style={styles.right_arrow} source={require('../images/right_arrow.png')}/>
					</TouchableOpacity>
				</View>	
				<View style={[styles.row, {top: 249, left: 24}]}>
					<View style={[styles.line, {top: -10, left:0, width: '86%'}]} />
				</View>					
				
				<View>
					<TouchableOpacity style={[styles.Component1, ]} onPress={()=> navigation.navigate('Page_10000')} >
						<Text style={styles.text2}>취소</Text>
					</TouchableOpacity>
				</View>

            </View>

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

img: {
    position: 'absolute',
	width: 30, 
	height: 30,
},

back_arrow: {
    position: 'absolute', left: 10, top: 11,
	width: 20, 
	height: 20,
},

right_arrow: {
    position: 'absolute',  right: -7, top: 8,
	width: 20,
	height: 20,
},

top_grp:{

	alignItems:'center',
    backgroundColor: 'transparent',	
},

line: {

	borderColor: '#E0E0E0',
	borderWidth: 0.5,
	width: '86%',

},

question: {
    position: 'absolute', top: 180,
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


title: {
    fontFamily: 'Work Sans',
    fontStyle: 'normal',
    lineHeight: 47.6,
    color: '#322E7F',
	marginTop: 70,
	left: 40,
	fontSize: 24,
	fontWeight: 700,
 },
 

top_line:{
    position: 'relative', width: '80%', left: 40, top: 30,
    borderBottomWidth:1,
    borderBottomColor: '#ACACAC',
},


장치추가: {
    position: 'absolute', left: 130, top: 11,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: 23,
    color: '#000000',
},


text1: {
    position: 'absolute',
    fontFamily: 'pretendard',
    fontStyle: 'normal',
	fontSize: 16,
	fontWeight: 700,
    lineHeight: 19,
    color: '#322E7F',

},

text2: {
    position: 'absolute', top:10,
    fontFamily: 'pretendard',
    fontStyle: 'normal',
	fontSize: 16,
	fontWeight: 700,
    lineHeight: 19,
    color: '#828282',
	alignText: 'center',
},

Component1: {
    position: 'absolute', left: 24, right: 24, top: 590, height: 44,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
	borderColor: '#E0E0E0',
	borderWidth: 1,
    borderRadius: 2,
},

row_one:{
    width: '80%', height:44,
},
});

export default Page_13200;
