import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const Page_15400 = ({ navigation }) => {
    const route = useRoute();
    const [selectedTimeZone, setSelectedTimeZone] = useState('(UTC+09:00)서울');
    const customTimeZones = [
        '(UTC-12:00)국제 날짜 라인 서부',
        '(UTC-11:00)협정 세계시-11',
        '(UTC-10:00)하와이',
        '(UTC-09:00)알래스카',
        '(UTC-08:00)태평양 표준시(미국 및 캐나다)',
        '(UTC-08:00)바하 캘리포니아',
        '(UTC-07:00)Chihuahua, La Paz, Mazatlan',
        '(UTC-07:00)산지 표준시(미국 및 캐나다)',
        '(UTC-07:00)애리조나',
        '(UTC-06:00)과달라하라, 멕시코 시티, 몬테레이',
        '(UTC-06:00)서스캐처원',
        '(UTC-06:00)중부 표준시(미국 및 캐나다)',
        '(UTC-06:00)중앙 아메리카',
        '(UTC-05:00)보고타, 리마, 키토',
        '(UTC-05:00)동부 표준시(미국 및 캐나다)',
        '(UTC-05:00)인디애나(동부)',
        '(UTC-04:00)Caracas',
        '(UTC-04:00)대서양 표준시(캐나다)',
        '(UTC-04:00)쿠이 아바',
        '(UTC-04:00)조지타운, 라 파스, 마나우스, 산후안',
        '(UTC-04:00)샌디에이고',
        '(UTC-04:00)아순시온',
        '(UTC-03:30)뉴 펀들랜드',
        '(UTC-03:00)브라질리아',
        '(UTC-03:00)부에노스 아이레스',
        '(UTC-03:00)그린란드',
        '(UTC-03:00)카이엔, 포르 탈 레자',
        '(UTC-03:00)몬테 비디오',
        '(UTC-03:00)엘살바도르',
        '(UTC-02:00)협정세계시-02',
        '(UTC-02:00)대서양 중부',
        '(UTC-01:00)카보 베르데 제도',
        '(UTC-01:00)아 조레스',
        '(UTC+00:00)더블린, 에든버러, 리스본,런던',
        '(UTC+00:00)Casablanca',
        '(UTC+00:00)몬로 비아, 레이캬비크',
        '(UTC+00:00)협정 세계시-11',
        '(UTC+01:00)Tripoli',
        '(UTC+01:00)암스테르담, 베를린, 베른,로마,스톡콜롬,비아나',
        '(UTC+01:00)베오그라드, 브래들 라비아, 부다페스트',
        '(UTC+01:00)브뤼셀, 코펜하겐, 마드리드, 파리',
        '(UTC+01:00)사라예보, 스코 페, 바르샤바, 자그레브',
        '(UTC+01:00)Windhoek',
        '(UTC+01:00)서부 중앙 아프리카',
        '(UTC+02:00)베이루트',
        '(UTC+02:00)다마스커스',
        '(UTC+02:00)동유럽',
        '(UTC+02:00)하라레, 프리토리아',
        '(UTC+02:00)헬싱키, Base Shop, 리가, 소피아, 탈린,빌뉴스',
        '(UTC+02:00)카이로',
        '(UTC+02:00)아테네, 부쿠레슈티',
        '(UTC+02:00)예루살렘',
        '(UTC+03:00)이스탄불',
        '(UTC+03:00)오만',
        '(UTC+03:00)바그다드',
        '(UTC+03:00)칼리닌그라드,민스크',
        '(UTC+03:00)쿠웨이트,리야드',
        '(UTC+03:00)나이로비',
        '(UTC+03:00)Tehran',
        '(UTC+04:00)아부다비, 마스코트',
        '(UTC+04:00)Yerevan',
        '(UTC+04:00)바쿠',
        '(UTC+04:00)트빌리시',
        '(UTC+04:00)포트루이스',
        '(UTC+04:00)Moscow,St Petersburg, Volgograd',
        '(UTC+04:30)카불',
        '(UTC+05:00)아스카바드, 카슈가르',
        '(UTC+05:00)이슬라마바드, 카라치',
        '(UTC+05:30)첸나이, 콜카타, 뭄바이, 뉴델리',
        '(UTC+05:30)스리가야보람푸라',
        '(UTC+05:45)카트만두',
        '(UTC+06:00)아스타나',
        '(UTC+06:00)다카',
        '(UTC+06:00)Yekaterinburg',
        '(UTC+06:00)양곤',
        '(UTC+07:00)방콕, 하노이, 자카르타',
        '(UTC+07:00)노보시비르스크',
        '(UTC+08:00)베이징, 충칭, 홍콩,우루무치',
        '(UTC+08:00)쿠알라,룸프르, 싱가포르',
        '(UTC+08:00)Krasnoyarsk',
        '(UTC+08:00)패스',
        '(UTC+08:00)중국 타이페이',
        '(UTC+08:00)울란바토로',
        '(UTC+09:00)오사카, 삿포로, 도쿄',
        '(UTC+09:00)서울',
        '(UTC+09:00)Yakutsk',
        '(UTC+09:30)애들레이드',
        '(UTC+09:30)다윈',
        '(UTC+10:00)브리즈번',
        '(UTC+10:00)호바트',
        '(UTC+10:00)캔버라, 멜버른, 시드니',
        '(UTC+10:00)James Yakutsk',
        '(UTC+11:00)Vladivostok',
        '(UTC+11:00)솔로몬제도, 뉴할레도니아',
        '(UTC+12:00)오클랜드, 웰링턴',
        '(UTC+12:00)피지',
        '(UTC+12:00)Magadan',
        '(UTC+12:00)협정세계시+12',
        '(UTC+13:00)누쿠알로파',
        '(UTC+13:00)사모아제도',
    ];


    return (
    <ScrollView>
        <View style={styles.root}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.vector}>
                <Image source={require('../images/arrow.png')} style={{width: 16.17, height: 19.8}}/>
            </TouchableOpacity>
            <Text style={styles.시간대설정}>시간대 설정</Text>
			<View style={[styles.line, {top: 65, width: '100%'}]} />
            <Text style={[styles.시간대설정,{ position: 'absolute', left: 30, top: 105, color: '#4D4D4D'}]}>시간대 설정</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}  style={{position: 'absolute', left: 300, top: 105}}>
                <Text style={styles.저장}>저장</Text>
            </TouchableOpacity>
            <View style={[styles.시간대설정,{position: 'absolute',left: 25, top:140, width: '90%', flexDirection: 'row'}]}>
                <Picker
                         style={{ width: 310 }}
                         selectedValue={selectedTimeZone}
                         mode="dropdown"
                         onValueChange={(value) => {
                             setSelectedTimeZone(value);
                         }}
                     >
                         {customTimeZones.map((zone, index) => (
                             <Picker.Item key={index} label={zone} value={zone} />
                         ))}
                </Picker>
            </View>


        </View>
    </ScrollView>
    );
};

const styles = StyleSheet.create({
root: {
   position: 'relative',width: '100%', height: 800,
   background: '#FFFFFF',
   justifyContent: 'center',
   alignItems: 'center'
},
vector: {
    position: 'absolute', left: 20, top: 21.1, color: '#FFFFFF',
},
line: {
    position: 'absolute',
	borderColor: '#E0E0E0',
	backgroundColor: '#E0E0E0',
	borderWidth: 1,
	width: '100%',
},

시간대설정: {
    position: 'absolute', top: 21.1,
    fontStyle: 'normal',
    fontWeight: 700,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontSize: 18,
    lineHeight: 23,
    color: '#000000',
},
저장: {
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
    color: '#0075FF'
},
modalContainer: {
     position: 'relative',width: '100%', height: 800,
       background: '#FFFFFF',
       justifyContent: 'center',
       alignItems: 'center'
},
});

export default Page_15400;
