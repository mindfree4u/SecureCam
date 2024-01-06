import React, { useState, useEffect, useContext } from 'react';
import { View, Text, NativeModules, Image,  ImageBackground, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert, Linking, StatusBar, Button } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';

//import AsyncStorage from '@react-native-async-storage/async-storage';
import {statusBarStyle} from './styles/statusbar_style';
import Dialog from "react-native-dialog";
import ShadowView from 'react-native-shadow-view';

import Footer from './Footer';
import { SaltContext } from '../App';
import axios from 'axios';

const Page_10000 = ({ navigation}) => {
const route = useRoute();
const { address, port, nickname, username, password } = route.params ||'' ;
const favorites = false;
const { IPLoginModule, DeviceSearchModule } = NativeModules;
const [Type, setType] = useState([]);                                  //장치구분
const [Address, setAddress] = useState([]);
const [Port, setPort] = useState([]);

const [NickName, setNickName] = useState([]);
const [Username, setUsername] = useState([]);
const [Password, setPassword] = useState([]);
const [Favorites, setFavorites] = useState([]);
const [selectedIconIndex, setSelectedIconIndex] = useState(0);
const [addVisible, setAddVisible] = useState(false);           
 
const saltContext = useContext(SaltContext);
const salt_vl = saltContext.salt;
let eqpmnt_info_sn;
const offset = 170;

//화면업데이트
useFocusEffect(
  React.useCallback(() => {
    getNickname();
      }, [])
  );

useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          setSelectedIconIndex(0);
        });

        return unsubscribe;
      }, [navigation]);

//화면시작시 저장된 장치불러오기 및 로그인하기 시작
  const getNickname =() => {
    try {
    //  const allKeys = await AsyncStorage.getAllKeys();
      let dataToSort = [];

    //  for (const key of allKeys) {
    //    if (key.startsWith('savedData_')) {
    //      const savedData = await AsyncStorage.getItem(key);
    //      if (savedData) {
    //        const data = JSON.parse(savedData);
    //       dataToSort.push(data);
    //      }
    //    }
    //  }

     //기기접속정보 목록 API 시작
        const deviceListdata = {
          salt_vl: salt_vl,
        };
        const deviceListurl = 'http://seeguard.ggulb.net/MdeviceList';

        // Axios를 사용하여 GET 요청 보내기
        axios
        .get(deviceListurl, { params: deviceListdata })
        .then((response) => {
           console.log('서버 응답 데이터:', response.data);
           const newData = response.data;

        dataToSort.push(newData);

      // 상태 변수 배열 업데이트
         setAddress(dataToSort.flatMap((data) => data.map((item) => item.eqpmnt_cntn_addr)));
         setPort(dataToSort.flatMap((data) => data.map((item) => item.eqpmnt_cntn_port)));
         setUsername(dataToSort.flatMap((data) => data.map((item) => item.eqpmnt_id)));
         setPassword(dataToSort.flatMap((data) => data.map((item) => item.eqpmnt_pswd)));
         setFavorites(dataToSort.flatMap((data) => data.map((item) => item.fvrt_stng_yn)));
         setNickName(dataToSort.flatMap((data) => data.map((item) => item.eqpmnt_nm)));

        const firstData = newData[0];
        const loginResult = IPLoginModule.login(
         // firstData.address.toString(),
         // firstData.port.toString(),
         // firstData.username.toString(),
         // firstData.password.toString()

         firstData.eqpmnt_cntn_addr ? firstData.eqpmnt_cntn_addr : '0',
         firstData.eqpmnt_cntn_port ? firstData.eqpmnt_cntn_port : '0',
         firstData.eqpmnt_id ? firstData.eqpmnt_id : '0',
         firstData.eqpmnt_pswd ? firstData.eqpmnt_pswd : '0'
        );

  /* AsyncStorage 사용시
        setAddress(dataToSort.map((data) => data.address));
        setPort(dataToSort.map((data) => data.port));
        setUsername(dataToSort.map((data) => data.username));
        setPassword(dataToSort.map((data) => data.password));
        setFavorites(dataToSort.map((data) => data.favorites));
        setNickName(dataToSort.map((data) => data.nickname));
  */
             })
             .catch((error) => {
               console.error('오류 발생:', error);
             });

    } catch (error) {
      console.log(error);
    }
  };
//화면시작시 저장된 장치불러오기 및 로그인하기 끝

/* 추가한 장치 정보저장 시작 (AsyncStorage 사용시)
useEffect(() => {
 if (nickname) {
  const handleFavorites = async () => {
      try {
        const data = { address, port, nickname, username, password, favorites};
             const key = `savedData_${nickname}`;                                   //저장 key는 입력한 nickname
             await AsyncStorage.setItem(key, JSON.stringify(data));

           setAddress(prevAddress => [...prevAddress, address]);
           setPort(prevPort => [...prevPort, port]);
           setNickName(prevNickName => [...prevNickName, nickname]);
           setUsername(prevUsername => [...prevUsername, username]);
           setPassword(prevPassword => [...prevPassword, password]);
           setFavorites(prevFavorites => [...prevFavorites, favorites]);

           } catch (error) {
            console.log(error);
            }
          };
          handleFavorites();
        }
}, [nickname]);
*/

//즐겨찾기 별아이콘 클릭시 시작
const handleImagePress = async(selectedNickName) => {

const index = NickName.indexOf(selectedNickName);
          // 저장된 데이터를 가져오기
          //  const key = `savedData_${selectedNickName}`;
          //  const storedData = await AsyncStorage.getItem(key);
          //  const parsedData = JSON.parse(storedData);

if (Favorites[index] === 'Y') {                      //즐겨찾기가 되어 있을경우
      Alert.alert(
        '즐겨찾기 채널에서 삭제하시겠습니까?',
        '',
        [
          { text: '취소', onPress: () => {

          }},
          { text: '삭제', onPress: async () => {

/*
AsyncStorage 사용시
            if (parsedData) {
             parsedData.favorites = false;
           AsyncStorage에 업데이트된 데이터 저장
             await AsyncStorage.setItem(key, JSON.stringify(parsedData));

             const newFavorites = [...Favorites];
             newFavorites[index] = parsedData.favorites;
             setFavorites(newFavorites);
 }
*/
           setFavorites(prevFavorites => {
             const newFavorites = [...prevFavorites];      // 기존 배열을 복사하여 수정
             newFavorites[index] = 'N';                  // 인덱스에 해당하는 값을 업데이트
             return newFavorites;                          // 새로운 배열을 반환하여 상태를 업데이트
              });
          // handleReorderDown(selectedNickName);

//즐겨찾기채널 목록 API 시작
        const Listdata = {
          salt_vl: salt_vl,
        };
        const Listurl = 'http://seeguard.ggulb.net/MfavrtList';

        // Axios를 사용하여 GET 요청 보내기
        axios
        .get(Listurl, { params: Listdata })
        .then((response) => {
           console.log('서버 응답 데이터:', response.data);
           // eqpmnt_nm가 nickname과 일치하는 데이터 찾기
           const matchingData = response.data.find(item => item.eqpmnt_nm === selectedNickName);

           if (matchingData) {
               eqpmnt_info_sn = matchingData.eqpmnt_info_sn;

                   //즐겨찾기 채널 삭제 API 시작
                   const Deldata = {
                     salt_vl: salt_vl,
                     eqpmnt_info_sn: eqpmnt_info_sn,
                   };
                   const Delurl = 'http://seeguard.ggulb.net/MfavrtDel';

                   // Axios를 사용하여 GET 요청 보내기
                   axios
                   .get(Delurl, { params: Deldata })
                   .then((response) => {
                      console.log('즐겨찾기채널 삭제 응답 데이터:', response.data);
                    })
                    .catch((error) => {
                               console.error('오류 발생:', error);
                               });
                   //즐겨찾기 채널 삭제 API 끝
                   getNickname();
           }
             })
             .catch((error) => {
               console.error('즐겨찾기채널 삭제 오류 발생:', error);
             });
//즐겨찾기채널 목록 API 끝

          }},
        ]
      );
    }

    else {                                      //즐겨찾기가 안되어 있을 경우
/*
AsyncStorage  사용시
            if (parsedData) {
             parsedData.favorites = true;

              // AsyncStorage에 업데이트된 데이터 저장
             // await AsyncStorage.setItem(key, JSON.stringify(parsedData));

              // 상태 변수를 업데이트
               const newFavorites = [...Favorites];
               newFavorites[index] = parsedData.favorites;
               setFavorites(newFavorites);
 }
 */
          setFavorites(prevFavorites => {
              const newFavorites = [...prevFavorites];    // 기존 배열을 복사하여 수정
              newFavorites[index] = 'Y';                  // 인덱스에 해당하는 값을 업데이트
              return newFavorites;                        // 새로운 배열을 반환하여 상태를 업데이트
          });
         // handleReorder(selectedNickName);


//즐겨찾기채널 목록 API 시작
        const Listdata = {
          salt_vl: salt_vl,
        };
        const Listurl = 'http://seeguard.ggulb.net/MfavrtList';

        // Axios를 사용하여 GET 요청 보내기
        axios
        .get(Listurl, { params: Listdata })
        .then((response) => {
           console.log('서버 응답 데이터:', response.data);

           const matchingData = response.data.find(item => item.eqpmnt_nm === selectedNickName);

           if (matchingData) {
               eqpmnt_info_sn = matchingData.eqpmnt_info_sn;

               //즐겨찾기 채널 등록 API 시작
                   const Adddata = {
                     salt_vl: salt_vl,
                     eqpmnt_info_sn: eqpmnt_info_sn,
                   };
                   const Addurl = 'http://seeguard.ggulb.net/MfavrtAdd';

                   // Axios를 사용하여 GET 요청 보내기
                   axios
                   .get(Addurl, { params: Adddata })
                   .then((response) => {
                      console.log('즐겨찾기채널 목록 응답 데이터:', response.data);
                    })
                    .catch((error) => {
                               console.error('즐겨찾기채널 목록 오류 발생:', error);
                               });
               //즐겨찾기 채널 등록 API 끝
               getNickname();
           }
             })
        .catch((error) => {
           console.error('오류 발생:', error);
             });
//즐겨찾기채널 목록 API 끝
}
};
//즐겨찾기 별아이콘 클릭시 끝

/*즐겨찾기 추가시 항목을 위로 이동 시작
const handleReorder = (selectedNickName) => {
  const index = NickName.indexOf(selectedNickName);

  // Remove the item from the current position
  const reorderedNickName = NickName.filter((item) => item !== selectedNickName);
  const reorderedFavorites = Favorites.filter((item, i) => i !== index);
  const reorderedAddress = Address.filter((item, i) => i !== index);
  const reorderedPort = Port.filter((item, i) => i !== index);
  const reorderedUsername = Username.filter((item, i) => i !== index);
  const reorderedPassword = Password.filter((item, i) => i !== index);

  // Add the item back to the top
  reorderedNickName.unshift(selectedNickName);
  reorderedFavorites.unshift('Y'); // Assuming it's a favorite
  reorderedAddress.unshift(Address[index]);
  reorderedPort.unshift(Port[index]);
  reorderedUsername.unshift(Username[index]);
  reorderedPassword.unshift(Password[index]);

  // Update the state variables with the new order
  setNickName(reorderedNickName);
  setFavorites(reorderedFavorites);
  setAddress(reorderedAddress);
  setPort(reorderedPort);
  setUsername(reorderedUsername);
  setPassword(reorderedPassword);
};
즐겨찾기 추가시 항목을 위로 이동 끝
*/

/*즐겨찾기 삭제시 항목을 아래로 이동 시작
const handleReorderDown = (selectedNickName) => {
  const index = NickName.indexOf(selectedNickName);

  // Check if the item is not already at the bottom
  if (index < NickName.length - 1) {
    // Remove the item from the current position
    const reorderedNickName = NickName.filter((item) => item !== selectedNickName);
    const reorderedFavorites = Favorites.filter((item, i) => i !== index);
    const reorderedAddress = Address.filter((item, i) => i !== index);
    const reorderedPort = Port.filter((item, i) => i !== index);
    const reorderedUsername = Username.filter((item, i) => i !== index);
    const reorderedPassword = Password.filter((item, i) => i !== index);

    // Add the item back to the next position
    reorderedNickName.splice(index + 1, 0, selectedNickName);
    reorderedFavorites.splice(index + 1, 0, 'N');
    reorderedAddress.splice(index + 1, 0, Address[index]);
    reorderedPort.splice(index + 1, 0, Port[index]);
    reorderedUsername.splice(index + 1, 0, Username[index]);
    reorderedPassword.splice(index + 1, 0, Password[index]);

    // Update the state variables with the new order
    setNickName(reorderedNickName);
    setFavorites(reorderedFavorites);
    setAddress(reorderedAddress);
    setPort(reorderedPort);
    setUsername(reorderedUsername);
    setPassword(reorderedPassword);
  }
};
즐겨찾기 삭제시 항목을 아래로 이동 끝
*/

// 공유버튼 클릭시 시작
const handleShareBtn =(selectedNickName) => {
     const Listdata = {
              salt_vl: salt_vl,
            };
            const Listurl = 'http://seeguard.ggulb.net/MfavrtList';

            // Axios를 사용하여 GET 요청 보내기
            axios
            .get(Listurl, { params: Listdata })
            .then((response) => {
               console.log('MfavrtList 응답 데이터:', response.data);
               const matchingData = response.data.find(item => item.eqpmnt_nm === selectedNickName);
               if (matchingData) {
                   eqpmnt_info_sn = matchingData.eqpmnt_info_sn;
                   navigation.navigate('Page_15200', {eqpmnt_info_sn: eqpmnt_info_sn});
                   }
               })
            .catch((error) => {
               console.error('MfavrtList오류 발생:', error);
               });
};
// 공유버튼 클릭시 끝

const handleScanQRCode = () => {
    setAddVisible(false);                              // "QR코드로 스캔" 버튼 누르면 모달 닫기
    navigation.navigate('Page_11000');
  };

const handleSN = () => {
    setAddVisible(false);
	navigation.navigate('Page_13000', { port: '123456' });
  };

const handleIpdomain = () => {
    setAddVisible(false);
    navigation.navigate('Page_13000', { port: '37777' });
  };

const  handleOnline = () => {
    setAddVisible(false);
    navigation.navigate('Page_13300');
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
	  
	<View style={styles.root}>
		<View style={[styles.head, {flex:0.27}]}>
			<View>
				<View style={styles.boxWithShadow} />

				<Image source={require('../images/home_right.png')} style={styles.img}/>
			</View>
			
			<View>
				<View style={styles.title_grp}>
					<Text style={[styles.title0, {color:'#B6BED8'}]}>GGULB</Text>
					<Text style={styles.title1}>Secure Cam</Text>
					<Text style={styles.title2}>방문을 환영합니다.</Text>
				</View>
			</View>
			
			<View style={styles.add_grp}>
				<View style={styles.add}>
					<TouchableOpacity style={styles.add_grp_sub}
						onPress={()=> navigation.navigate('Page_13200')} >
				<Image source={require('../images/plus_device.png')} style={styles.img_col1}/>
						<Text style={styles.add1}>장치추가</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.bar1}>
					<Image source={require('../images/home_bar.png')} style={[styles.img_col4, {left: 12}]}/>
				</View>
				<View style={styles.livecol}>
					<View style={styles.col_grp1}>
						<Image source={require('../images/collect.png')} style={styles.img_col2}/>
						<Text style={styles.add2}>라이브 모아보기</Text>
					</View>
				</View>
			</View>

		</View>						

			
		<View style={[styles.devices, {flex:0.60}]}>
			<ScrollView>
				<View style={{height: 500}}>
			
					{NickName && (
					 NickName.map((item, index) => (
					 
						<View key={index} style={{height:0}}>

						<View style={[styles.rectangle0, { top: 72 + index * offset }]}></View>
						
						<View style={[styles.dummy1,{ top: 150 + index * offset }]}/>

						<TouchableOpacity  style={{ position: 'absolute',  left:26,   top: 22 + index * offset }}
										   onPress={() => handleImagePress(item)}>
							<Image  source={(Favorites[index] ==='Y' ? require('../images/FullStar.png') : require('../images/star2.png'))}/>
						</TouchableOpacity>
						
						<Text style={[styles.text0, { position: 'absolute',  left:60, top: 15 + index * offset }]}>NVR</Text>
						<Text style={[styles.text1, { position: 'absolute',  left:60, top: 35 + index * offset }]}>{item}</Text>
						<TouchableOpacity style={[styles.Rectangle1, { position: 'absolute',  left:258, top: 25 + index * offset }]}
										  onPress={() => handleShareBtn(item) }>
							<Image source={require('../images/share.png')} style={styles.img_share}/>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.Rectangle1, { position: 'absolute', left:298, top: 26 + index * offset }]}
									  onPress={() =>  navigation.navigate('Page_15000', {address: Address[index], nickname: NickName[index], port:Port[index] })}>
							<Image source={require('../images/setup.png')} style={styles.img_setup}/>
						</TouchableOpacity>
						
						<View style={styles.col_grp2}>
							<TouchableOpacity style={[{ position: 'absolute',  left:'15%', top: 80 + index * offset, flexDirection: 'row' }]}
											  onPress={() => Linking.openURL('company://LivePreview')}>

										<Image source={require('../images/live.png')} style={styles.img_col3}/>
										<Text style={styles.text2}>LIVE</Text>

										<View style={[styles.center_bar]}></View>

							</TouchableOpacity>
						</View>
						
						
						<View style={styles.col_grp2}>
							<TouchableOpacity style={[{ position: 'absolute',  left:'53%', top: 80 + index * offset, flexDirection: 'row' }]}
											  onPress={()=> Linking.openURL('company://Page_17000')}>

									<Image source={require('../images/playback.png')} style={styles.img_col4}/>
									<Text style={styles.text2}>녹화영상</Text>

							</TouchableOpacity>
						</View>
					</View>

						)
						)
						)
					}
			   

				</View>

			</ScrollView>
			<View style={[styles.dummy, {flex:0.13}]}>
				<Text style={styles.bottom_text}>Security Total Solution</Text>
			</View>
			
			<View style={[styles.line,]} />

		</View>

		<View>
			<Dialog.Container visible={addVisible}>
			 <Dialog.Title style={{left:'15%', fontSize: 20}}>장치 추가방식 선택</Dialog.Title>
			 <Dialog.Description style={{left:10}} >원하는 추가방식을 선택하세요.</Dialog.Description>
				<View>
					<Dialog.Button label="QR코드로 스캔" onPress={() => handleScanQRCode()} style={styles.btn}/>
					<Dialog.Button label="SN번호로 추가" onPress={() => handleSN()}  style={styles.btn} />
					<Dialog.Button label="IP 또는 도메인으로 추가" onPress={() => handleIpdomain()}  style={styles.btn} />
					<Dialog.Button label="온라인검색으로 추가" onPress={() => handleOnline()}  style={styles.btn} />
					<Dialog.Button label="Cancel" onPress={() => setAddVisible(false)} style={{marginTop: 10}}/>
				</View>
			</Dialog.Container>
		</View>


    </View>
	
	<Footer  navigation={navigation} selectedIconIndex={selectedIconIndex} setSelectedIconIndex={setSelectedIconIndex} />
    </>
  );
};
  
const styles = StyleSheet.create({

root: {
	width: '100%', 
	flex:1,
	flexDirection: 'column',
	backgroundColor: '#F1F5FB',
},

btn: {
	width: '80%', 
	marginTop: 20,
	color: '#2d2d2d',
	backgroundColor: '#FFFFFF',
	borderColor: '#8d8d8d',
	borderWidth: 2,
},

head: {
	width: '100%',
	height: '40%',
},

title_grp: {
	position: 'absolute', left: '10%', top: 85,
},

title0: {
	position: 'absolute', top: -35,
	fontFamily: 'Work Sans',
    fontStyle: 'normal',
    color: '#322E7F',
	fontSize: 16,
	fontWeight: 700,
},

title1: {
	position: 'relative', top: 40,
    fontFamily: 'Work Sans',
    fontStyle: 'normal',
    lineHeight: 44.8,
    color: '#322E7F',
    fontSize: 32,
    fontWeight: 700,
	letterSpacing: -1.28
},

title2: {
	position: 'relative', top: 35,
	fontFamily: 'Pretendard',
    fontStyle: 'normal',
    color: '#322E7F',
	fontSize: 18,
	fontWeight: 400,
},

img: {
	position: 'absolute', right: 10, top: 1,
	width: 160, 
	height: 160,
},

img_left: {
	position: 'absolute', top: 100,
	width: 222, 
	height: 222,
},

img_round: {
	position: 'absolute',
	width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 5, // Android에서만 필요
},

boxWithShadow: {
	position: 'absolute', top: -15,
	width: '100%',
	height: 335,
	backgroundColor: 'white',
	borderRadius: 40,
//	elevation: 10, // 드롭 쉐도우의 높이
	padding: 20,
	justifyContent: 'center',
	alignItems: 'center',
},

add_grp: {
	position: 'absolute', top: 225, left: 24, right: 24, height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4543BA',
	justifyContent: 'space-between',
    borderRadius: 20,
},

add: {
	flex:0.35,
	lineHeight:20,
	alignItems: 'center',
},

bar1: {
	flex: 0.25, top: 4, left: 60, height: 70,
	justifyContent: 'center',
},

livecol: {
	flex:0.45,
	left: 18,
	marginRight: 60,
	color: '#FF0000',
	fontSize: 40,
	lineHeight:20,
},

add_grp_sub: {
	left:30,
	flexDirection: 'row',
	position: 'relative', top: 5,
},


col_grp1: {
    flexDirection: 'row',
    alignItems: 'center',
},

col_grp2: {
    flexDirection: 'row',
    alignItems: 'center',
},


plus1: {
	position: 'relative', left: 0, top: -2,
    fontStyle: 'normal',
	color: '#FFFFFF',
	fontSize: 28,
	fontWeight: 500,
	lineHeight: 23,
},

add1: {
	position: 'relative', left: 4, top: -5,
	fontFamily: 'Pretendard',
    fontStyle: 'normal',
	color: '#FFFFFF',
	fontSize: 14,
	fontHeight: 16.71,
	fontWeight: 700,
},

add2: {
	position: 'relative', left: 14, top: -2,
	fontFamily: 'Pretendard',
    fontStyle: 'normal',
	color: '#FFFFFF',
	fontSize: 14,
	fontHeight: 16.71,
	fontWeight: 700,
	letterSpacing: -1.28
},

view_grp: {
	flex:1,
    flexDirection: 'row',
    alignItems: 'center',
},

img_col1: {
	position: 'relative', top: -5,
},

img_col2: {
	position: 'relative', top: -2, left: 10,

},

img_col3: {
	position: 'relative', top: -4, left: 16,

},

img_col4: {
	position: 'relative', top: -4, left: 20,

},


img_share: {
	position: 'absolute', right: '40%',

},

img_setup: {
	position: 'absolute', right: '50%',
},



devices: {
	backgroundColor: '#F1F5FB',
	marginTop: 170, 
	height: 400,
},

dummy: {
	width: '100%',
	height: 70,
	borderWidth: 0.5,
	borderColor: '#D6D9E8',
	alignItems: 'center',
},

dummy1: {
	marginTop:15,
	position: 'relative',
	borderWidth: 0.5,
	borderColor: '#D6D9E8',
},

line: {
	top:73,
	width: '100%',
	borderWidth: 0.5,
	borderColor: '#D6D9E8',
	alignItems: 'center',
},

Rectangle1:{
    width: 60, height: 30,
    borderRadius: 5,

    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
    marginLeft: 10,
    backgroundColor: '#F5F8FD',
    borderRadius: 5,
},

text0: {
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 100,
    fontSize: 14,
    lineHeight: 16.71,
    color: '#808DD0',
},

text1: {
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 21.48,
    color: '#322E7F',
},

text2: {
	position: 'relative', left:25,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 16.71,
    color: '#322E7F',
},

text3: {
    fontFamily: 'Gothic A1',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 23,
    color: '#322E7F',
},

bottom_text: {
	position: 'absolute', top: 30,
    fontFamily: 'Work Sans',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 23,
    color: '#B6BEDB',
	textAlign: 'center',
},



rectangle: {
    position: 'absolute', left: '11%', right: '11%', 
    height: 70,
    backgroundColor: '#EDEDED',
	color: '#2D2D2D',
    borderRadius: 10,
},

rectangle0: {
    position: 'absolute', left: 24, right: 24, 
    height: 64,
    backgroundColor: '#FFFFFF',
	borderColor: '#000000',
    borderRadius: 10,
},

center_bar: {
    position: 'absolute', left: 124,  top: -25,
    height: 64,
	width: 1,
    backgroundColor: '#EDEDED',
	borderColor: '#EDEDED',
	borderWidth: 1,
    borderRadius: 1,
},

modalContainer: {

    justifyContent: 'center',
    alignItems: 'center',
},

Close: {
    position: 'absolute', marginRight: -30, right:20, top: 10, color: '#FFFFFF',
},

});

export default Page_10000;