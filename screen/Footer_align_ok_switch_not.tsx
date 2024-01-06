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

const [homeVisible, setHomeVisible] = useState(true); 
const [msgVisible, setMsgVisible] = useState(false); 
const [myVisible, setMyVisible] = useState(false); 

const handleHome = () => {
    setHomeVisible(true);                             
	setMsgVisible(false);
    setMyVisible(false); 	
    navigation.navigate('Page_10000');
  };
  
 const handleMsg = () => {
    setHomeVisible(false);                             
	setMsgVisible(true);
    setMyVisible(false); 	
    navigation.navigate('Page_10000');
  };
  
 const handleMy = () => {
    setHomeVisible(false);                             
	setMsgVisible(false);
    setMyVisible(true); 	
    navigation.navigate('Page_10000');
  };


 return (
	<>
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
		<TouchableOpacity onPress={() => {handleHome(); setSelectedIconIndex(0); }} style={{width: 50, marginLeft: 30}}>
			
			{ homeVisible ? <Image source={require('../images/short_line.png')} style={[styles.short_line]}/> : <Text style={{height: 12}}></Text>}
			<Image source={require('../images/home.png')} style={{width: 30, height: 30, left: 10}}/>
			<Text style={[styles.text1, selectedIconIndex === 0 ? {color:'#000000'} : {color:'#9190B2'}]}>홈</Text>
		</TouchableOpacity>
		
		
		 <TouchableOpacity onPress={() => {handleMsg(); setSelectedIconIndex(4); }} style={{width: 50}}>
			{ msgVisible ? <Image source={require('../images/short_line.png')} style={[styles.short_line]}/> : <Text style={{height: 12}}></Text>}
			<Image source={require('../images/message.png')} style={{width: 30, height: 30, left:10}}/>
			<Text style={[styles.text1,{left: 2}, selectedIconIndex === 4 ? {color:'#000000'} : {color:'#9190B2'}]}>메세지</Text>
		</TouchableOpacity>
		
		
		<TouchableOpacity onPress={() => {handleMy(); setSelectedIconIndex(5); }} style={{width: 50, marginRight: 30}}>
			{ myVisible ? <Image source={require('../images/short_line.png')} style={[styles.short_line]}/> : <Text style={{height: 12}}></Text>}
			<Image source={require('../images/my.png')} style={{width: 30, height: 30, left:8}}/>
			<Text style={[styles.text1, {left: 10},  selectedIconIndex === 5 ? {color:'#000000'} : {color:'#9190B2'}]}>MY</Text>
		</TouchableOpacity>

	</View>
    </>
   );
 };

const styles = StyleSheet.create({
container: {
   flexDirection: 'row',
   justifyContent: 'space-between',

   marginTop: 20, marginBottom: 10, marginRight: 30, marginLeft: 30
},
line: {
	marginTop: -20,
    width: '100%',
//    borderBottomWidth: 1,
//    borderBottomColor: '#ACACAC',
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