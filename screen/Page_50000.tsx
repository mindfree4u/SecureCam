import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import Dialog from "react-native-dialog";
import Footer from './Footer';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { SaltContext } from '../App';

const Page_50000 = ({ navigation }) => {
    const [selectedIconIndex, setSelectedIconIndex] = useState(4);
    const route = useRoute();
    const saltContext = useContext(SaltContext);
    const salt_vl = saltContext.salt;
    const [email, setEmail] = useState([]);
	const [eml, setEml] = useState('');
    const [eqpmntInfoSn, setEqpmntInfoSn] = useState([]);
    const [shrMbrSn, setShrMbrSn] = useState([]);
    const [eqpmntShrYn, setEqpmntShrYn] = useState([]);
    const [shareTime, setShareTime] = useState([]);
    const date = new Date(shareTime);
    const formattedDate = shareTime.map(time => {
        const date = new Date(time);
        let formatted = date.toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\./g, '/');
        return formatted.slice(0, -1);  // 마지막 /문자를 제거
    });

    //화면업데이트
    useFocusEffect(
    React.useCallback(() => {
    GetMessage();
      }, [])
    );

    //화면시작시 메세지 가져오기 시작
    const GetMessage = async () => {
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
            setEmail(response.data.map(item => item.eml_addr));
            setShareTime(response.data.map(item => item.eqpmnt_shr_req_tm));
            setShrMbrSn(response.data.map(item => item.shr_mbr_sn));
            setEqpmntInfoSn(response.data.map(item => item.eqpmnt_info_sn));
            setEqpmntShrYn(response.data.map(item => item.eqpmnt_shr_yn));
         })
         };
         //기기공유목록 API 끝
    //화면시작시 메세지 가져오기 끝

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          setSelectedIconIndex(4);
        });

        return unsubscribe;
      }, [navigation]);

    const handleTextPress = async(index, eml) => {
//        const item = email[index];
		setEml(eml);
		setAddVisible(true); 
//        navigation.navigate('Page_51000', {email: item, eqpmnt_info_sn: eqpmntInfoSn[index], shr_mbr_sn: shrMbrSn[index]});
    };

	const [addVisible, setAddVisible] = useState(false); 



	const [share, setShare] = useState('');
	let eqpmnt_shr_yn='';
		
	const handleShare =(res, index) => {
			const eqpmnt_shr_yn = res === 'accept' ? 'Y' : 'N';
			setShare(eqpmnt_shr_yn);

			//기기공유수락여부 API 시작
			const MshareResponsedata = {
				salt_vl: salt_vl,
				shr_mbr_sn: shrMbrSn[index],
				eqpmnt_info_sn: eqpmntInfoSn[index],
				eqpmnt_shr_yn: eqpmnt_shr_yn,
			};
			
			setAddVisible(false); 
					
			const MshareResponseurl = 'http://seeguard.ggulb.net/MshareResponse';

			// Axios를 사용하여 GET 요청 보내기
			axios
			.get(MshareResponseurl, { params: MshareResponsedata })
			.then((response) => {
				console.log('기기공유수락 응답 데이터:', response.data);
			})
			.catch((error) => {
				console.error('기기공유수락 오류 발생:', error);
			});
			//기기공유수락여부 API 끝
			navigation.navigate('Page_50000');
	};



  return (
    <>
	
	<View style={styles.root}>
	<View >
		<View>
			<TouchableOpacity onPress={() => navigation.goBack()}>
				<Image style={styles.back_arrow} source={require('../images/arrow.png')}/>
				<Text style={styles.알림}>알림</Text>
				<View style={[styles.line, {top: 45, width: '100%'}]} />
			</TouchableOpacity>
		</View>
	
        <FlatList style={{ marginTop: 45, }} data={email} keyExtractor={(item, index) => index.toString()}

		renderItem={({ item, index }) => (
		 <View style={{ marginTop: 6, }}>


			<TouchableOpacity onPress={() => handleTextPress(index, email[index])}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<View style={[{flexDirection:'column'}]}>
						<Text style={styles.text1}>'{item}' 님이</Text>
						<Text style={styles.text2}>장치공유 요청을 보냈습니다.</Text>
					</View>
					<Text style={ [styles.text3, {color: '#4F4F4F' }] }>{formattedDate[index]}</Text>
					{eqpmntShrYn[index] ? <Image source={require('../images/share_dot.png')} style={{top: 22, marginLeft: '17%' }} /> : <Image source={require('../images/new.png')} style={{ top: 20, marginLeft: '16%' }} />}
				</View>
			</TouchableOpacity>


			<Dialog.Container visible={addVisible} contentStyle={styles.dialogContent}>
								
				<Dialog.Title style={{left: '45%', height: 60}}>
					<View style ={{alignItems: 'center'}}>
						<Image source={require('../images/exclaim.png')} style={[]} />
					</View>
				</Dialog.Title>
				<Dialog.Description style={{top:-30, fontSize: 18, fontWeight: 800, textAlign: 'center', alignItems: 'center'}} >
					<Text style={[styles.text0]}>'{eml}'님이{'\n'}</Text>
					<Text style={[styles.text0, {top: -5}]}>장치공유 요청을 보냈습니다.</Text>
				</Dialog.Description>
				
				<Dialog.Description style={{top:-35, fontSize: 16, fontWeight: 400, textAlign: 'center', alignItems: 'center'}} >
					<Text style={[styles.text0, {fontWeight: 700}]}>수락하시겠습니까?</Text>
				</Dialog.Description>

				<View style={styles.yes_no_btn}>

					<TouchableOpacity onPress={() => handleShare('accept', index)} >
						<View style={styles.no_btn}>
							<Text style={styles.btn_txt}>수락</Text>
						</View>
					</TouchableOpacity>


					<TouchableOpacity onPress={() => handleShare('reject', index)} >
						<View style={styles.yes_btn}>
							<Text style={styles.btn_txt}>거절</Text>
						</View>
					</TouchableOpacity>

				</View>
			</Dialog.Container>

			
			
			
			
			
			<View style={[styles.line1, {top:7, left: 25, width: '86%'}]}/>
	
		 </View>
		 
        )}
        />
		
		<View style={[styles.line1 ,{top: -3, left: 25, width: '86%'}]}/>
        </View>
    </View>
    <Footer navigation={navigation} selectedIconIndex={selectedIconIndex} setSelectedIconIndex={setSelectedIconIndex} />
    </>
  );
};

const styles = StyleSheet.create({
root: {
	width: '100%', 

	flex:1,
	flexDirection: 'column',
	backgroundColor: '#FFFFFF',
},

back_arrow: {
    position: 'absolute', left: 10, top: 11,
	width: 20, 
	height: 20,
},

알림: {
    position: 'absolute', left: '46%', top: 11,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: 23,
	textAlign: 'center',
    color: '#000000',
},

dialogContent: {
	width: '90%',
    borderRadius: 20, // 외곽선을 둥글게 만들기 위한 스타일
	height: 235,
    overflow: 'hidden', // border-radius와 함께 사용하여 둥근 형태를 유지
},

yes_no_btn: {
	flexDirection: 'row',
	flex: 1,
	top: -50,
	marginTop: 20,
	marginBottom: -50,
	justifyContent: 'space-between',
},

no_btn: {
	left: '11%', 
	width: 120,
	height: 40,
	backgroundColor: '#808DD0',
	alignItems: 'center',
	justifyContent: 'center',
	borderColor: '#EDEDED',
	borderWidth: 2,
	borderRadius: 20,
	textColor: '#FFFFFF',
},

yes_btn: {
	right: '11%', 
	width: 120,
	height: 40,
	alignItems: 'center',
	backgroundColor: '#322E7F',
	justifyContent: 'center',
	borderRadius: 20,
	textColor: '#FFFFFF',
},

btn_txt: {
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 23,
    color: '#FFFFFF',
},

line: {
	borderColor: '#E0E0E0',
	backgroundColor: '#E0E0E0',
	borderWidth: 0.5,
	width: '100%',

},

line1: {
	top:5,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 12,
},

text0: {
    fontFamily: 'Pretendard', 
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 25,
    color: '#222222',
    marginTop: 10,

},

text1: {
    fontFamily: 'Pretendard', left: 25,
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 25,
    color: '#4F4F4F',
    marginTop: 10,
},

text2: {
    fontFamily: 'Pretendard', left: 25,
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 25,
    color: '#4F4F4F',
    top: 4,
},

text3: {
    fontFamily: 'Noto Sans KR', 
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 12,
    lineHeight: 25,
    color: '#4F4F4F',
    marginTop: -18,
	left: '110%',
},
});

export default Page_50000;
