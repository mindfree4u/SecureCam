import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView, NativeModules, Linking, Modal, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundTimer from 'react-native-background-timer';
import { SaltContext } from '../App';
import axios from 'axios';

const Page_15000 = ({ navigation}) => {
  const route = useRoute();
  const { address, nickname, port } = route.params;                  //Page_10000에서 받음
  const [addVisible, setAddVisible] = useState(false);               //녹화 스케줄창 보이기 상태
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [startMinute, setStartMinute] = useState(0);
  const [endMinute, setEndMinute] = useState(0);
  const [startMeridiem, setStartMeridiem] = useState('AM');
  const [endMeridiem, setEndMeridiem] = useState('AM');
  const [scheduleData, setScheduleData] = useState([]);                 //선택된 녹화일정 저장용
  const { LivePreviewModule } = NativeModules;
  const saltContext = useContext(SaltContext);
  const salt = saltContext.salt;

const getData = async (nickname) => {
  try {
      const keys = await AsyncStorage.getAllKeys();
      const matchingKey = keys.find((key) => key.startsWith('savedData_') && key.includes(nickname));
      if (matchingKey) {
      const dataJSON = await AsyncStorage.getItem(matchingKey);
        if (dataJSON) {
          const data = JSON.parse(dataJSON);
if (data && data.schedule) {
          setScheduleData(data.schedule);
          console.log(data.schedule);
        } else {
          console.log('Data or schedule not found in the retrieved data');
        }
      } else {
        console.log('DataJSON is empty');
      }
    } else {
      console.log('Matching key not found');
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  getData(nickname); // 컴포넌트가 마운트될 때 데이터를 비동기적으로 불러옴
}, []);

const handleschedule = async() => {
  const selectedStartDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      startMeridiem === 'PM' ? startTime + 12 : startTime,            // 시작 시간을 24시간 형식으로 변환
      startMinute
    );

  const selectedEndDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      endMeridiem === 'PM' ? endTime + 12 : endTime,
      endMinute
    );

  if (selectedDate < currentDate &&  selectedStartDateTime < currentDate)        // 현재 시간과 비교
    alert('현재 시간 이후로 선택해주세요.');
  else if (selectedEndDateTime <= selectedStartDateTime)
    alert('종료 시간은 시작 시간보다 이후여야 합니다.');
  else {
    setAddVisible(false);
    // 선택한 날짜와 시간을 scheduleData에 추가
    const formattedStartHour = String(selectedStartDateTime.getHours()).padStart(2, '0');
    const formattedEndHour = String(selectedEndDateTime.getHours()).padStart(2, '0');
    const formattedDateTime = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()} ${formattedStartHour}:${startMinute} - ${formattedEndHour}:${endMinute}`;

    const keys = await AsyncStorage.getAllKeys();
    const matchingKey = keys.find((key) => key.startsWith('savedData_') && key.includes(nickname));

      const dataJSON = await AsyncStorage.getItem(matchingKey);
          const data = JSON.parse(dataJSON);

            const newData = [...scheduleData, formattedDateTime];
            setScheduleData(newData);

            const newDataToSave = data.schedule ? [...data.schedule, formattedDateTime] : [formattedDateTime];
            data.schedule = newDataToSave;
            await AsyncStorage.setItem(matchingKey, JSON.stringify(data));



// 스케줄 녹화 타이머 시작
    const selectedStartTime = new Date(`${selectedStartDateTime.getFullYear()}-${selectedStartDateTime.getMonth() + 1}-${selectedStartDateTime.getDate()} ${formattedStartHour}:${startMinute}`);
    const selectedEndTime = new Date(`${selectedEndDateTime.getFullYear()}-${selectedEndDateTime.getMonth() + 1}-${selectedEndDateTime.getDate()} ${formattedEndHour}:${endMinute}`);

    const timeDifferenceStart = selectedStartTime.getTime() - new Date().getTime();
    const timeDifferenceEnd = selectedEndTime.getTime() - new Date().getTime();

      if (timeDifferenceStart > 0) {
          BackgroundTimer.setTimeout(() => {
             LivePreviewModule.onRecord(true);
          }, timeDifferenceStart);
      }

      if (timeDifferenceEnd > 0) {
          BackgroundTimer.setTimeout(() => {
             LivePreviewModule.onRecord(false);
             removeItemByEndTime(selectedEndTime.getTime());
          }, timeDifferenceEnd);
      }

      const removeItemByEndTime = async (endTime) => {
        try {
          const updatedScheduleData = scheduleData.filter(schedule => {
            const { selectedEndDateTime } = schedule;
            const selectedEndTime = new Date(formattedDateTime);
            return selectedEndTime.getTime() !== endTime;
          });
          setScheduleData(updatedScheduleData);

        const newDataToSave = [...updatedScheduleData];
        data.schedule = newDataToSave;

          await AsyncStorage.setItem(matchingKey, JSON.stringify(data));
          console.log('schedule 삭제 완료');
        } catch (error) {
          console.error('schedule 삭제 실패: ', error);
        }
        };
// 스케줄 녹화 타이머 끝

     }
   };


const getCurrentYearAndMonth = () => {
    const year = currentDate.getFullYear(); // 현재 년도 가져오기
    const month = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줘야 합니다.

    return `${year}년 ${month}월`;
  };

const removeItem = async (index) => {
  try {
  Alert.alert(
        '녹화스케줄을 삭제하시겠습니까?',
        '',
        [
          { text: '취소', onPress: () => {

          }},
          { text: '삭제', onPress: async () => {

            // 선택한 아이템을 scheduleData 배열에서 제거
            const updatedScheduleData = [...scheduleData];
            updatedScheduleData.splice(index, 1);
            setScheduleData(updatedScheduleData);

            // AsyncStorage에서도 해당 데이터를 삭제
            const keys = await AsyncStorage.getAllKeys();
            const matchingKey = keys.find((key) => key.startsWith('savedData_') && key.includes(nickname));
            if (matchingKey) {
              // 데이터를 가져와서 파싱
              const dataString = await AsyncStorage.getItem(matchingKey);
              if (dataString) {
                const data = JSON.parse(dataString);

                // schedule에서 1개 아이템 삭제
                data.schedule.splice(index, 1);

                // 업데이트된 데이터를 AsyncStorage에 다시 저장
                await AsyncStorage.setItem(matchingKey, JSON.stringify(data));
                console.log('schedule 삭제 완료');
              }
            } else {
              console.log('매칭되는 key를 찾을 수 없음');
            }
          }},
        ]
      );
  } catch (error) {
    console.error('schedule 삭제 실패: ', error);
  }
};

const handleDelete = async() => {

      Alert.alert(
        '장치를 삭제하시겠습니까? 한번 삭제하면 복구할 수 없습니다.',
        '',
        [
          { text: '취소', onPress: () => {

          }},
          { text: '삭제', onPress: async() => {

             const key = `savedData_${nickname}`;


             const url = 'http://seeguard.ggulb.net/MdeviceDel';
             const Listurl = 'http://seeguard.ggulb.net/MdeviceList';

          try {
          // 해당 키에 대한 데이터 삭제
             await AsyncStorage.removeItem(key);
             console.log(`데이터 삭제 성공: ${key}`);

          // 기기정보 List 요청
             const Listdata = { salt_vl: salt };
             const listResponse = await axios.get(Listurl, { params: Listdata });

             console.log('List 응답 데이터:', listResponse.data);

          // eqpmnt_nm가 nickname과 일치하는 데이터 찾기
             const matchingData = listResponse.data.find(item => item.eqpmnt_nm === nickname);

             if (matchingData) {
                 eqpmntInfoSn = matchingData.eqpmnt_info_sn;

          // 기기정보 삭제 요청
             const deleteData = { eqpmnt_info_sn: eqpmntInfoSn, salt_vl: salt };
             const deleteResponse = await axios.get(url, { params: deleteData });

             console.log('삭제 응답 데이터:', deleteResponse.data);

             if (deleteResponse.data.rtnCode === '1') {
                   navigation.navigate('Page_10000');
                 }
               } else {
                 console.error('List 응답 데이터에 유효한 eqpmnt_info_sn이 없습니다.');
               }
             } catch (error) {
               console.error(`데이터 삭제 실패: ${error}`);
             }
          }},
        ]
      );

};

  return (
      <View style={styles.root}>
	<View >
		<View style={styles.intro}>
			<TouchableOpacity onPress={() => navigation.navigate('Page_13200')}>
				<Image style={styles.back_arrow} source={require('../images/arrow.png')}/>
				<Text style={styles.상세설정}>상세설정</Text>
				<View style={[styles.topline, {top: 45, width: '100%'}]} />
			</TouchableOpacity>
		</View>
					
			
		<View style = {[styles.device_box]}>
			<Image source={require('../images/NVR.png')} style={styles.deviceimg}/>
			<View >
				<Text style={[styles.text2, {left: 120, top:20}]}>장치명</Text>
				<Text style={[styles.text2, {left: 200, top:20}]}>NVR</Text>
				<Text style={[styles.text2, {left: 120, top:45}]}>IP/도메인</Text>
				<Text style={[styles.text2, {left: 200, top:45}]}>{address}</Text>
				<Text style={[styles.text2, {left: 120, top:70}]}>Port</Text>
				<Text style={[styles.text2, {left: 200, top:70}]}>{port}</Text>
				<Text style={[styles.text2, {left: 120, top:95}]}>닉네임</Text>
				<Text style={[styles.text2, {left: 200, top:95}]}>{nickname}</Text>
			</View>
		</View>
		
		<View style={[styles.topline, {top: 180, borderWidth:  1}]} />
		<Text style={styles.text3}>영상재생 설정</Text>
		<TouchableOpacity onPress={() => Linking.openURL('company://Page_15100')} style={[styles.image1]}>
			<Image source={require('../images/arrow2.png')} style={{ top: -15}}/>
		</TouchableOpacity>
		<View style={[styles.line, {top: 240}]} />
					
		<Text style={[styles.text3, {top:262}]}>장치공유</Text>
		<TouchableOpacity onPress={() => navigation.navigate('Page_15200')} style={[styles.image1, {top:280}]}>
			<Image source={require('../images/arrow2.png')} style={{top: -15}}/>
		</TouchableOpacity>
		<View style={[styles.line, {top: 300}]} />			
		
		<Text style={[styles.text3, {top:322}]}>일반설정</Text>
		<View style={styles.box}>
			<Text style={[styles.text4, {top:16}]}>시간대</Text>
			<TouchableOpacity  onPress={() => navigation.navigate('Page_15400')} style={[styles.image1, {left: 285, top:0}]}>
				<Image source={require('../images/arrow2.png')} style={{ top: 15 }}/>
			</TouchableOpacity>
			<Text style={[styles.text4, {top:51, color: '#4F4F4F', fontWeight: 400,}]}>업데이트 정보</Text>
			<Text style={[styles.text4, {top:50, left: '79%', color: '#4F4F4F', fontWeight: 400,}]}>Ver 1.0</Text>
		</View>
{/*  <Text style={[styles.text3, {top:490}]}>녹화일정</Text>

            <TouchableOpacity style={[styles.Rectangle1, {position: 'absolute', right:'12%', top:490}]} onPress={() => setAddVisible(true)}>
                <Text style={styles.text4}>스케줄 추가</Text>
            </TouchableOpacity>

  <View style={[styles.text2, { position: 'absolute', top: 550, left:'12%'}]}>
        <FlatList
                data={scheduleData}
                keyExtractor={(item, index) => index.toString()}         // 고유한 키로 인덱스를 사용
                renderItem={({ item, index }) => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginRight: 10 }}>
                    <Text >{item}</Text>
                    <TouchableOpacity onPress={() => removeItem(index)}>
                        <Text>                                  X</Text>
                    </TouchableOpacity>
                </View>
                            )}
                extraData={scheduleData}
        />
  </View>
*/}
			<View style={[styles.line, {top: 370}]} />	
            <Text style={[styles.text3, {top:486}]}>라이브뷰 영상조정</Text>
            <TouchableOpacity onPress={()=> Linking.openURL('company://Page_15300')} style={[styles.image1, {top: 486}]}>
                <Image source={require('../images/arrow2.png')} style={{  }}/>
            </TouchableOpacity>
			<View style={[styles.line, {top: 430}]} />

            <TouchableOpacity  style={styles.Component1}  onPress={() => (handleDelete())}>
                <Text style={styles.text5}>장치삭제</Text>
            </TouchableOpacity>
			
			



            <Modal visible={addVisible} animationType="slide">
                <ScrollView>
                    <View style={styles.modalContainer}>
                        <View style={{width: '95%', height:600, maxWidth: 600}}>
                        <View style={{ position: 'absolute', top: 20, flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => setAddVisible(false)} style={styles.Close}>
                            <Image source={require('../images/Close.png')} style={{width: 14, height: 14}}/>
                        </TouchableOpacity>
                        <Text style={[styles.text3, {top:20, marginLeft: 150}]}>녹화 스케줄
                        {'\n'}{'\n'}{'\n'}</Text>
                        </View>
                            <Text style={[styles.text4, {left:20, top:100}]}>장치명</Text>
                            <Text style={[styles.text4, {left: 100, top:100}]}>NVR</Text>
                            <Text style={[styles.text4, {left:20, top:130}]}>닉네임</Text>
                            <Text style={[styles.text4, {left: 100, top:130}]}>{nickname}</Text>
                            <Text style={[styles.text4, {left:20, top:200}]}>날짜</Text>

                            <View style={{left:90, top:180, flexDirection: 'row', alignItems: 'center'}}>
                                <Picker
                                    style={{ width: 110 }}
                                    selectedValue={selectedDate.getFullYear()} // 년도 선택
                                    onValueChange={(itemValue) => {
                                    const newDate = new Date(selectedDate);
                                    newDate.setFullYear(itemValue);
                                    setSelectedDate(newDate);
                                    }}
                                    mode="dropdown">
                                    {[...Array(5).keys()].map((_, i) => (
                                                <Picker.Item key={i} label={`${i + new Date().getFullYear()}`} value={i + new Date().getFullYear()} /> // 올해부터 5년 동안의 년도 표시
                                         ))}
                                </Picker>
                                <Picker
                                    style={{ width: 85 }}
                                    selectedValue={selectedDate.getMonth()} // 월 선택
                                    onValueChange={(itemValue) => {
                                        const newDate = new Date(selectedDate);
                                        newDate.setMonth(itemValue);
                                        setSelectedDate(newDate);
                                    }}
                                    mode="dropdown">
                                   {[...Array(12).keys()].map((_, i) => (
                                               <Picker.Item key={i} label={`${i + 1}`} value={i} /> // 월 표시
                                           ))}
                                </Picker>
                                <Picker
                                    style={{ width: 85 }}
                                    selectedValue={selectedDate.getDate()} // 일(day) 선택
                                    onValueChange={(itemValue) => {
                                        const newDate = new Date(selectedDate);
                                        newDate.setDate(itemValue);
                                        setSelectedDate(newDate);
                                    }}
                                    mode="dropdown">
                                    {[...Array(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate()).keys()].map((_, i) => (
                                                <Picker.Item key={i} label={`${i + 1}`} value={i + 1} /> // 일(day) 표시
                                            ))}
                                </Picker>
                            </View>


                            <Text style={[styles.text4, {left:20, top:280}]}>시작시간</Text>
                            <View style={{left:100, top:205, flexDirection: 'row', alignItems: 'center'}}>
                                <Picker style={{ width: 95 }}
                                    selectedValue={startMeridiem}
                                    onValueChange={(itemValue) => setStartMeridiem(itemValue)}
                                    mode="dropdown"
                                    >
                                    <Picker.Item label="AM" value="AM" />
                                    <Picker.Item label="PM" value="PM" />
                                </Picker>
                                <Picker
                                    style={{ width: 85 }}
                                    selectedValue={startTime} // 시작시간 선택
                                    onValueChange={(itemValue) => setStartTime(itemValue)}
                                    mode="dropdown"
                                >
                                    {[...Array(12).keys()].map((_, i) => (
                                        <Picker.Item key={i} label={`${i}`} value={i} /> // 시간(hour)만 표시
                                    ))}
                                </Picker>
                                <Picker
                                        style={{ width: 85 }}
                                        selectedValue={startMinute} // 시작 분 선택
                                        onValueChange={(itemValue) => setStartMinute(itemValue)}
                                        mode="dropdown"
                                    >
                                        {[...Array(12).keys()].map((_, i) => (
                                            <Picker.Item key={i} label={`${i*5}`} value={i*5} /> // 분(minute) 표시, 5분 간격
                                        ))}
                                </Picker>
                            </View>

                            <Text style={[styles.text4, {left:20, top:330}]}>종료시간</Text>
                            <View style={{left:100, top:205, flexDirection: 'row', alignItems: 'center'}}>
                                <Picker style={{ width: 95 }}
                                    selectedValue={endMeridiem}
                                    onValueChange={(itemValue) => setEndMeridiem(itemValue)}
                                    mode="dropdown"
                                    >
                                <Picker.Item label="AM" value="AM" />
                                <Picker.Item label="PM" value="PM" />
                                </Picker>
                                <Picker
                                    style={{ width: 85 }}
                                    selectedValue={endTime} // 종료시간 선택
                                    onValueChange={(itemValue) => setEndTime(itemValue)}
                                    mode="dropdown"
                                >
                                    {[...Array(12).keys()].map((_, i) => (
                                        <Picker.Item key={i} label={`${i}`} value={i} /> // 시간(hour)만 표시
                                    ))}
                                </Picker>
                                <Picker
                                        style={{ width: 85 }}
                                        selectedValue={endMinute} // 종료 분 선택
                                        onValueChange={(itemValue) => setEndMinute(itemValue)}
                                        mode="dropdown"
                                    >
                                        {[...Array(12).keys()].map((_, i) => (
                                            <Picker.Item key={i} label={`${i*5}`} value={i*5} /> // 분(minute) 표시, 5분 간격
                                        ))}
                                </Picker>

                            </View>

                            <TouchableOpacity style={[styles.Rectangle1,{ left:50, top:280, width: 130 }]} onPress={handleschedule}>
                                <Text style={styles.text4}>스케줄 추가</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </Modal>

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

box: {
	top: 353,  left: 24,
	height: 90,
	width: '86%',
	backgroundColor: '#FAFAFA',
	borderColor: '#EEEEEE',
	borderWidth: 1,
	borderRadius: 4,
},

device_box: {
    position: 'absolute', left: '1%', top: 48, width: '98%' , height: 148,
	flexDirection: 'row', 
	backgroundColor: '#FFFFFF',
	borderColor: '#FFFFFF',
	borderWidth: 0,
},

deviceimg: {
    position: 'absolute', left: '3%', top: 20, width: 100 , height: 100,
},


상세설정: {
    position: 'absolute', left: '40%', top: 10,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: 21.48,
    color: '#222222',
},

topline: {
	borderColor: '#E0E0E0',
	borderWidth: 0.5,
	width: '100%',
},

line: {
	borderColor: '#E0E0E0',
	backgroundColor: '#E0E0E0',
	borderWidth: 0.5,
	left: 24,
	width: '86%',
},

text2: {
    position: 'absolute',
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 15,
    color: '#4D4D4D',
},

text3: {
    position: 'absolute', left: 24, top: 203,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 19.09,
    color: '#322E7F',
},

text4: {
    position: 'absolute', left: 15,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 17,
    color: '#4F4F4F',
},

text5: {
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 16.71,
    color: '#4543BA',
	top: 9,
},

Component1: {
    position: 'absolute', left: 24, width: '87%', top: 580, height: 40,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
	borderColor: '#808DD0',
	borderWidth: 1,
    borderRadius: 2,
},


Rectangle1:{
    width: 110, height: 30,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
    marginLeft: 75,
    backgroundColor: '#E0DDBA',
    borderRadius: 5,
},

image1: {
    position: 'absolute', left: '89%', top: 220,
},

modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},

Close: {
    position: 'absolute', left:23, top: 24, color: '#FFFFFF',
},

});

export default Page_15000;