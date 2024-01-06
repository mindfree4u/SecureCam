import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, FlatList, Alert, Switch } from 'react-native';
import { useRoute } from '@react-navigation/native';
//import Toggle from "react-native-toggle-element";
import FlipToggle from 'react-native-flip-toggle-button';

import axios from 'axios';
import { SaltContext } from '../App';

const Page_15200 = ({ navigation }) => {
   const route = useRoute();
   const { eqpmnt_info_sn } = route.params || '';
   const saltContext = useContext(SaltContext);
   const salt_vl = saltContext.salt;
   const [shareId, setShareId] = useState('');                         //공유할 ID 저장용
    const [emails, setEmails] = useState([]);
   const [shrMbrSn, setShrMbrSn] = useState([]);

   const [eqpmntInfoSn, setEqpmntInfoSn ] = useState([]);

   const [eqpmntShrYn, setEqpmntShrYn] = useState([]);
   const [filteredEmails, setFilteredEmails] = useState([]);
//   const [viewpermit, setViewpermit] = useState('허용');               //라이브뷰 허용/비허용
//   const [recordpermit, setRecordpermit] = useState('비허용');         //녹화된영상 허용/비허용
//   const [alarmpermit, setAlarmpermit] = useState('비허용');           //푸쉬알람 허용/비허용
//   const [controlpermit, setControlpermit] = useState('비허용');  
   const [viewpermit_isOn, setViewpermit_IsOn] = useState(false);
   const [recordpermit_isOn, setRecordpermit_IsOn] = useState(false);
   const [alarmpermit_isOn, setAlarmpermit_IsOn] = useState(false);
   const [controlpermit_isOn, setControlpermit_IsOn] = useState(false);
   
   //장치제어 허용/비허용
   const handleToggle_View = () => {
     setViewpermit_IsOn(!viewpermit_isOn);
  };
   const handleToggle_Record = () => {
     setRecordpermit_IsOn(!recordpermit_isOn);
	 console.log("========================= Record ========================");
  };
   const handleToggle_Alarm = () => {
     setAlarmpermit_IsOn(!alarmpermit_isOn);
  };
   const handleToggle_Control = () => {
     setControlpermit_IsOn(!controlpermit_isOn);
  };  
//화면시작시 공유된 계정 가져오기 시작
    useEffect(() => {
    const GetShareID = async () => {
         //기기공유목록 API 시작
         const MshareListdata = {
            salt_vl: salt_vl,
         };
         const MshareListurl = 'http://seeguard.ggulb.net/MshareList';

         // Axios를 사용하여 GET 요청 보내기
         axios
         .get(MshareListurl, { params: MshareListdata })
         .then((response) => {
            console.log('기기공유목록 응답 데이터:', response.data);
            setShrMbrSn(response.data.map(item => item.shr_mbr_sn));

			setEqpmntInfoSn(response.data.map(item => item.eqpmnt_info_sn));
			setEqpmntShrYn(response.data.map(item => item.eqpmnt_shr_yn));
            setEmails(response.data
                                      .filter(item => item.eqpmnt_shr_yn === 'Y')
                                      .map(item => item.eml_addr));

    // setEmails(['rhdy@gmail.com', 'rhdy7889898080805@gmail.com', 'rhdy745574645464564333543@gmail.com', 'test@gmai.com', 'test4444@naver.com', 'eheyyr@daum.net']);
         })
         };
         //기기공유목록 API 끝
    GetShareID();
    }, []);
//화면시작시 공유된 씨가드계정 가져오기 끝

const handlePermitToggle = (permitSetter) => {
           permitSetter((prevPermit) => {
               const newPermit = (prevPermit === '허용' ? '비허용' : '허용');
               return newPermit;
             });
           };

//공유할 ID입력시 호출됨
const handleShareID = (text) => {
      setShareId(text);
    };

// 공유하기 버튼 클릭시 호출됨
const handleShare =() => {
    if (shareId.length === 0) {
        Alert.alert('', '공유할 ID를 입력해 주세요.', [{ text: '확인' }]);
    }
    else if (!shareId || !shareId.includes('@') || !shareId.includes('.')) {
        Alert.alert( '','공유할 ID 형식이 올바르지 않습니다.', [{ text: '확인' }]);
    }
    else if(emails.length > 5) {
        Alert.alert('', '최대 6명까지 공유할 수 있습니다.', [{ text: '확인' }]);
    }
    else {

//	const toggleSwitch = () => setIsEnabled(previousState => !previousState);
//      <Switch
//        trackColor={{false: '#767577', true: '#81b0ff'}}
//        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
//        ios_backgroundColor="#3e3e3e"
//        onValueChange={toggleSwitch}
//        viewpermitValue={isEnabled}
//      />

    const viewpermitValue = viewpermit_isOn === true ? '1' : '0';
    const recordpermitValue = recordpermit_isOn === true ? '1' : '0';
    const alarmpermitValue = alarmpermit_isOn === true ? '1' : '0';
    const controlpermitValue = controlpermit_isOn === true ? '1' : '0';

    // 변환된 값을 문자열로 연결하여 eqpmnt_shr_role에 할당
    const eqpmnt_shr_role = viewpermitValue + recordpermitValue + alarmpermitValue + controlpermitValue;

        //기기공유등록 API 시작
        const MshareAdddata = {
            eml_addr: shareId,
            salt_vl: salt_vl,
            eqpmnt_info_sn: eqpmnt_info_sn,
            eqpmnt_shr_role: eqpmnt_shr_role,
        };
        const MshareAddurl = 'http://seeguard.ggulb.net/MshareAdd';

        // Axios를 사용하여 GET 요청 보내기
        axios
        .get(MshareAddurl, { params: MshareAdddata })
        .then((response) => {
            console.log('기기공유등록 응답 데이터:', response.data);
            if (response.data.rtnCode === "1") {
                            Alert.alert('', '장치공유 요청을 보냈습니다', [{ text: '확인' }]);
                        }
            else if (response.data.rtnCode === "0") {
                Alert.alert('', response.data.rtnMsg, [{ text: '확인' }]);
            }
        })
        .catch((error) => {
            console.error('기기공유등록 오류 발생:', error);
        });
    }
};

const removeItem = async (index) => {
  try {
   Alert.alert(
           `${emails[index]} 님과의 공유를 취소하시겠습니까 ?`,
                '',
          [
            { text: '취소', onPress: () => {

            }},
            { text: '확인', onPress: async () => {
          //기기공유삭제 API 시작
          const MshareDeldata = {
              salt_vl: salt_vl,
              shr_mbr_sn: shrMbrSn[index],
              eqpmnt_info_sn: eqpmntInfoSn[index],
          };
          const MshareDelurl = 'http://seeguard.ggulb.net/MshareDel';

          console.log('salt_vl:', salt_vl);
          console.log('공유대상자 SN:', shrMbrSn[index]);
		  console.log('eqpmnt_info_sn:', eqpmntInfoSn[index]);

          // Axios를 사용하여 GET 요청 보내기
          axios
          .get(MshareDelurl, { params: MshareDeldata })
          .then((response) => {
              console.log('기기공유삭제  데이터:', response.data);
              if (response.data.rtnCode === "1") {
                              const newEmails = [...emails];
                              newEmails.splice(index, 1);
                              setEmails(newEmails);
                          }
          })
          .catch((error) => {
              console.error('기기공유삭제 오류 발생:', error);
          });
        }},
        ]
      );
  } catch (error) {
    console.error('삭제 실패: ', error);
  }
};

  return (
  
    <View style={styles.root}>
	<View >
		<View style={styles.intro}>
            <TouchableOpacity onPress={()=> navigation.goBack()}>
				<Image style={styles.back_arrow} source={require('../images/arrow.png')}/>

			</TouchableOpacity>
			<Text style={styles.장치공유}>장치공유</Text>
			<View style={[styles.line, {top: 45, width: '100%'}]} />
		</View>  
		
        <Text style={styles.text0}>공유된 계정</Text>

		<ScrollView style={{  marginTop: 120, height: 220}}>
			<View style={{  height: 326, }}>
				<FlatList data={emails}  keyExtractor={(item, index) => index.toString()}
				renderItem={({ item, index  }) => (
					<TouchableOpacity onPress={() => removeItem(index)} style={{ marginBottom: 15 }}>
						<View style={styles.email_id}>
							<Image source={require('../images/person.png')} style={{marginLeft: 16}}/>
							<Text numberOfLines={1} ellipsizeMode="tail" style={{ left: 10, top: -2, fontSize: 16, fontWeight: 400, color: '#4F4F4F', flexShrink: 0 }}>{item}</Text>
							<Image source={require('../images/Close.png')} style={styles.delete}/>
						</View>

					</TouchableOpacity>
				)}
				/>
			</View>
		</ScrollView>
		<View style={[{backgroundColor: '#FFFFFF', height: 600}]}>
			<View style={[styles.centerline, {width: '100%'}]} />
				
			<Text style={[styles.text1, { top: 25, left: '26%'}]}>새로운 공유계정 추가</Text>
			<Text style={[styles.text1, {top:56, left: 24, fontSize: 14, lineHeight: 20}]}>추가할 ID</Text>
			<Text style={[styles.text2, {top: 56}] }>최대 6명까지 추가 가능합니다.</Text>
			

			<TextInput style={styles.textinput} value={shareId}  onChangeText={handleShareID} maxLength={20}
												placeholder="공유할 ID입력" placeholderTextColor="#B6BED8" />
												
												
			<View style={styles.permit_grp}>
				<View style={[styles.line, {top: 20, left: 24, width: '87%'}]} />			
				<View style={[{top: 10}]}>
					<Text style={[styles.text3, {top: 23}]}>라이브뷰</Text>
					<Text style={[styles.permit, {top: 21.5}]} >{viewpermit_isOn ? '   허용' : '비허용'}</Text>
					<View style={[styles.toggle_btn, {top:21}]}>
						<FlipToggle 
							value={viewpermit_isOn}
							buttonWidth={40}
							buttonHeight={25}
							buttonRadius={55}
							sliderWidth={20}
							sliderHeight={20}
							sliderRadius={55}
							onLabel={''}
							offLabel={''}
							labelStyle={{ color: 'white' }}
							onToggle={handleToggle_View}
							buttonOnColor="#4543BA" // ON 상태일 때 버튼의 색상
							buttonOffColor="#B6BEDB" // OFF 상태일 때 버튼의 색상
							sliderOnColor="#ffffff" // ON 상태일 때 슬라이더의 색상
							sliderOffColor="#ffffff" // OFF 상태일 때 슬라이더의 색상
						/>
					</View>
				</View>



				<View style={[styles.line, {top: 45, left: 24, width: '87%'}]} />
				<View style={[{top: 20}]}>
					<Text style={[styles.text3, {top: 38}]}>녹화된영상</Text>
					<Text style={[styles.permit, {top: 37}]} >{recordpermit_isOn ? '   허용' : '비허용'}</Text>
					<View style={[styles.toggle_btn, {top: 35.5}]}>
						<FlipToggle 
							value={recordpermit_isOn}
							buttonWidth={40}
							buttonHeight={25}
							buttonRadius={55}
							sliderWidth={20}
							sliderHeight={20}
							sliderRadius={55}
							onLabel={''}
							offLabel={''}
							labelStyle={{ color: 'white' }}
							onToggle={handleToggle_Record}
							buttonOnColor="#4543BA" // ON 상태일 때 버튼의 색상
							buttonOffColor="#B6BEDB" // OFF 상태일 때 버튼의 색상
							sliderOnColor="#ffffff" // ON 상태일 때 슬라이더의 색상
							sliderOffColor="#ffffff" // OFF 상태일 때 슬라이더의 색상
						/>
					</View>
				</View>

				<View style={[styles.line, {top: 70, left: 24, width: '87%'}]} />
				<View style={[{top: 30}]}>
					<Text style={[styles.text3, {top: 53}]}>푸쉬알림</Text>
					<Text style={[styles.permit, {top: 51}]} >{alarmpermit_isOn ? '   허용' : '비허용'}</Text>
					<View style={[styles.toggle_btn, {top:50.5}]}>
					<FlipToggle
						value={alarmpermit_isOn}
							buttonWidth={40}
							buttonHeight={25}
							buttonRadius={55}
							sliderWidth={20}
							sliderHeight={20}
							sliderRadius={55}
						onLabel={''}
						offLabel={''}
						labelStyle={{ color: 'white' }}
						onToggle={handleToggle_Alarm}
						buttonOnColor="#4543BA" // ON 상태일 때 버튼의 색상
						buttonOffColor="#B6BEDB" // OFF 상태일 때 버튼의 색상
						sliderOnColor="#ffffff" // ON 상태일 때 슬라이더의 색상
						sliderOffColor="#ffffff" // OFF 상태일 때 슬라이더의 색상
					/>
					</View>
				</View>
				
				<View style={[styles.line, {top: 95, left: 24, width: '87%'}]} />
				<View style={[{top: 40}]}>
					<Text style={[styles.text3, {top: 68}]}>장치제어</Text>
					<Text style={[styles.permit, {top: 66}]} >{controlpermit_isOn ? '   허용' : '비허용'}</Text>
					<View style={[styles.toggle_btn, {top:65.5}]}>
					
					<FlipToggle
						value={controlpermit_isOn}
							buttonWidth={40}
							buttonHeight={25}
							buttonRadius={55}
							sliderWidth={20}
							sliderHeight={20}
							sliderRadius={55}
						onLabel={''}
						offLabel={''}
						labelStyle={{ color: 'white' }}
						onToggle={handleToggle_Control}
						buttonOnColor="#4543BA" // ON 상태일 때 버튼의 색상
						buttonOffColor="#B6BEDB" // OFF 상태일 때 버튼의 색상
						sliderOnColor="#ffffff" // ON 상태일 때 슬라이더의 색상
						sliderOffColor="#ffffff" // OFF 상태일 때 슬라이더의 색상
					/>
					</View>
				</View>
				<View style={[styles.line, {top: 120, left: 24, width: '87%'}]} />
				
			</View>


        </View>

		</View>
		<TouchableOpacity style={[styles.Component1]} onPress={handleShare}>
				<Text style={styles.공유하기}>공유하기</Text>
		</TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
root: {
	width: '100%',
	backgroundColor:'#FFFFFF',
},

back_arrow: {
    position: 'absolute', left: 10, top: 11,
	width: 20, 
	height: 20,
},

장치공유: {
    position: 'absolute', left: '40%', top: 10,
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: 21.48,
    color: '#222222',
},

centerline: {
	borderColor: '#F5F5F5',
	borderWidth: 2,
},

line: {
	borderColor: '#E0E0E0',
	borderWidth: 0.5,
},

email_id: {
	flexDirection: 'row', 
	borderColor: '#EEEEEE',
	backgroundColor: '#FAFAFA',
	borderWidth: 2,
	left: 24,
	width: '87%', 
	height: 50,
	marginBottom: -10,
	alignItems: 'center',
},

delete: {
    position: 'absolute', left: '88%', top: 13, 

},

text0: {
    position: 'absolute', left:'34%', top:70,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 22,
    lineHeight: 23.48,
    color: '#222222',
},

text1: {
    position: 'absolute',  top: 80,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 18,
	textAlign: 'center',
    lineHeight: 21.48,
    color: '#222222',
},
text2: {
    position: 'absolute', right: 24, top: 175,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16.71,
    color: '#4F4F4F',
},
square_tmp:{
    position: 'absolute', left: '5%', right: '5%', top: 220,
    backgroundColor: '#FFFFFF',                                // 배경색을 투명하게 설정
    height: 44,
    borderWidth: 1,                                              // 테두리 두께 설정
    borderColor: '#D6D9EB',                                        // 테두리 색상 설정
    borderRadius: 1,
},

textinput: {
    position: 'absolute', left: 24, right: 24, top: 90, 
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 17,
	borderWidth: 0.5,
	borderColor: '#D6D9EB',
    color: '#B6BEDB',
	paddingLeft: 10,
},
text3: {
    position: 'absolute',  left: '7%',
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 19.09,
    color: '#4F4F4F',
},

text4: {
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 17,
    color:'#943deb',
	textAlign: 'center',
	alignItems: 'center',
	justifyContent: 'center',
},

permit_grp: {
	top: 140,
},

permit: {
	left: '68%',
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
	color:'#322E7F',
	TextAlign: 'right',
},

Component1: {
    position: 'absolute', top: 715, left: 24, right: 24, bottom:50, height: 44,
    justifyContent: 'center',
    backgroundColor: '#4543BA',
    borderRadius: 2,
},
공유하기: {
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 17,
    textAlign: 'center',
    color: '#FFFFFF',
},

toggle_btn: {
    position: 'absolute', left: '74.5%',
    justifyContent: 'center',
    alignItems: 'center',
	width: 100,
  },
});

export default Page_15200;