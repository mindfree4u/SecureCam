import React, { useCallback, useState } from 'react';
import { View, Image, Text, StyleSheet,TouchableOpacity, StatusBar} from 'react-native';
import type {StatusBarStyle} from 'react-native';



const STYLES = ['default', 'dark-content', 'light-content'] as const;
const TRANSITIONS = ['fade', 'slide', 'none'] as const;

const Footer = ({ navigation, selectedIconIndex, setSelectedIconIndex}) => {

  const [hidden, setHidden] = useState(true);

  const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>(
    STYLES[0],
  )
  const [statusBarTransition, setStatusBarTransition] = useState<
    'fade' | 'slide' | 'none'
  >(TRANSITIONS[0]);


 return (
	<View>
	  <StatusBar
        animated={false}
        backgroundColor="#FFFFFF"
		barStyle='dark-content'
		color='#000000'
//        barStyle={statusBarStyle}
//        showHideTransition={statusBarTransition}
//        hidden={hidden}
      />
	  
  <View style={styles.line } />
	<View style={styles.container}>
		<TouchableOpacity onPress={() => {navigation.navigate('Page_10000'); setSelectedIconIndex(0); }} style={{width: 50, marginLeft: 20}}>
			
			{ selectedIconIndex === 0 ? <Image source={require('../images/short_line.png')} style={[styles.short_line]}/> : <Text style={{height: 12}}></Text>}
			{ selectedIconIndex === 0 ? <Image source={require('../images/home.png')} style={{width: 30, height: 30, left: 10}}/> : <Image source={require('../images/home.png')} style={{width: 30, height: 30, left: 10, opacity:0.5}}/>  }
			<Text style={[styles.text1, selectedIconIndex === 0 ? {color:'#000000'} : {color:'#9190B2'}]}>홈</Text>
		</TouchableOpacity>
		
		
		 <TouchableOpacity onPress={() => {navigation.navigate('Page_50000'); setSelectedIconIndex(4); }} style={{width: 50}}>
			{ selectedIconIndex === 4 ? <Image source={require('../images/short_line.png')} style={[styles.short_line]}/> : <Text style={{height: 12}}></Text>}
			{ selectedIconIndex === 4 ? <Image source={require('../images/message.png')} style={{width: 30, height: 30, left:10 }}/> : <Image source={require('../images/message.png')} style={{width: 30, height: 30, left:10, opacity: 0.5 }}/> }
			<Text style={[styles.text1,{left: 8}, selectedIconIndex === 4 ? {color:'#000000'} : {color:'#9190B2'}]}>알림</Text>
		</TouchableOpacity>
		
		
		<TouchableOpacity onPress={() => {navigation.navigate('Page_60000'); setSelectedIconIndex(5); }} style={{width: 50, marginRight: 20}}>
			{ selectedIconIndex === 5 ?  <Image source={require('../images/short_line.png')} style={[styles.short_line]}/> : <Text style={{height: 12}}></Text>}
			{ selectedIconIndex === 5 ?  <Image source={require('../images/my.png')} style={{width: 30, height: 30, left:8}}/> : <Image source={require('../images/my.png')} style={{width: 30, height: 30, left:8, opacity: 0.5}}/>}
			<Text style={[styles.text1, {left: -13, width: 100},  selectedIconIndex === 5 ? {color:'#000000'} : {color:'#9190B2'}]}>마이페이지</Text>
		</TouchableOpacity>

	</View>
    </View>
   );
 };



const styles = StyleSheet.create({
container: {
	flexDirection: 'row',
	justifyContent: 'space-between',
	backgroundColor: '#FFFFFF',
	paddingBottom: 10, paddingRight: 20, paddingRLeft: 20
},
line: {
	marginTop: -10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDF9',
},

short_line: {
	top: 0,
    width: 52,
	height: 3,
	backgroundColor: '#FF0000',
	marginBottom: 10,
//    borderBottomWidth: 1,
//    borderBottomColor: '#ACACAC',
},

text1: {
    fontFamily: 'Noto Sans KR',
	marginTop: 1,
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 18,
	left:17
},
});

export default Footer;