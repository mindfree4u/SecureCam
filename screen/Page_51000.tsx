import React, { useState, useContext }from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { SaltContext, LoginIdContext} from '../App';

const Page_51000 = ({ navigation }) => {
    const route = useRoute();
    const { email, eqpmnt_info_sn, shr_mbr_sn } = route.params;
    const saltContext = useContext(SaltContext);
    const salt_vl = saltContext.salt;
    const loginIdContext = useContext(LoginIdContext);
    const [share, setShare] = useState('');
    let eqpmnt_shr_yn='';

const handleShare =(res) => {
        const eqpmnt_shr_yn = res === 'accept' ? 'Y' : 'N';
        setShare(eqpmnt_shr_yn);

        //기기공유수락여부 API 시작
        const MshareResponsedata = {
            salt_vl: salt_vl,
            shr_mbr_sn: shr_mbr_sn,
            eqpmnt_info_sn: eqpmnt_info_sn,
            eqpmnt_shr_yn: eqpmnt_shr_yn,
        };
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
    <ScrollView>
    <View style={styles.root}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.vector}>
                <Image source={require('../images/arrow.png')} style={{width: 16.17, height: 19.8}}/>
            </TouchableOpacity>
            <Text style={styles.text1}>{email}님이 장치공유   {'\n'}요청을 보냈습니다.{'\n'}{'\n'}수락하시겠습니까?</Text>
            <View style={{ height: 80 }} />
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.Component1} onPress={() => handleShare('reject')}>
                <Text style={styles.거절}>거절</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Component2} onPress={() => handleShare('accept')}>
                <Text style={styles.거절}>수락</Text>
            </TouchableOpacity>
            </View>
    </View>
    </ScrollView>

    </>
  );
};

const styles = StyleSheet.create({
root: {
    position: 'relative',width: '100%', height: '100%',
    background: '#FFFFFF',

},
vector: {
    position: 'absolute', left: 20, top: 21.1, color: '#FFFFFF',
},
text1: {
    fontFamily: 'Noto Sans KR', left: '11.11%',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 23,
    color: '#4D4D4D',
    marginTop: '25%',
},
buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '10%', // 여백 조절
    marginBottom: '10%', // 버튼과 내용 사이 여백
  },

  Component1: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 5,
    flex: 1, // 동일한 공간을 차지하도록 설정
    marginRight: '5%', // 버튼 간 여백
  },

  Component2: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 5,
    flex: 1, // 동일한 공간을 차지하도록 설정
    marginLeft: '5%', // 버튼 간 여백
  },
거절: {
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    color: '#FFFFFF',
},

});

export default Page_51000;
