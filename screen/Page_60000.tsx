import React, { useState, useEffect } from 'react';
import { View, Text, NativeModules, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Dialog from "react-native-dialog";
import Footer from './Footer';


const Page_60000 = ({ navigation }) => {
const [selectedIconIndex, setSelectedIconIndex] = useState(5);
const [files, setFiles] = useState([]);                                  //FlieBrowerActivity.java 에서 가져온 녹화목록 저장용
const [itemsToRemove, setItemsToRemove] = useState([]);

const { FileBrowserModule } = NativeModules;

useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    setSelectedIconIndex(5);
  });

  return unsubscribe;
}, [navigation]);

useFocusEffect(
  React.useCallback(() => {
    // 화면이 포커스를 얻었을 때 데이터를 다시 불러오는 함수 호출
    fetchFiles();
  }, [])
);

const fetchFiles = async () => {
    try {
      const fileList = await FileBrowserModule.getFiles();
      setFiles(fileList);
    } catch (error) {
      console.error(error);
    }
};

const removeItem = async (index) => {
FileBrowserModule.deleteFile(files[index])
                              .then(response => {
                                console.log(response); // 파일 삭제 성공
                              })
                              .catch(error => {
                                console.error(error); // 파일 삭제 실패 또는 오류
                              });

          const updatedFiles = [...files];
          updatedFiles.splice(index, 1);
          setFiles(updatedFiles);

};

const ViewPlayback = (index) => () => {
    let position = index;
    Linking.openURL(`company://Page_61100?position=${position}`);
};

const handleLogout = () => {
          Alert.alert(
              '로그아웃 하시겠습니까?',
              '로그아웃 시 모든 푸시를 받지 못합니다.',
              [
                { text: '예', onPress: () => navigation.navigate('Intro_10000') },
                { text: '아니오', onPress: () => {} },
              ]
            );
       };

const [addVisible, setAddVisible] = useState(false); 
const [delVisible, setDelVisible] = useState(false); 
const [idxVisible, setIdxVisible] = useState(0);

const handle_logout = () => {
    setAddVisible(true);                              
  };

const handle_delete = () => {
    setDelVisible(false); 
	removeItem(idxVisible);	
	console.log("Index ==> ", idxVisible)
  };
  
const handle_idx = (index) => {
    setIdxVisible(index); 
    setDelVisible(true); 	
  };
  
  return (
    <>
	
	
	<View style={styles.root}>
		<View >
			<View>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Image style={styles.back_arrow} source={require('../images/arrow.png')}/>
					<Text style={styles.마이페이지}>마이페이지</Text>
					<View style={[styles.line, {top: 45, width: '100%', borderWidth: 0.5}]} />
				</TouchableOpacity>
			</View>
			
			<Text style={styles.title}>내 파일</Text>
			<View style={[styles.line1, {top:5, borderWidth: 0.5}]} />
			<ScrollView>
				<View   style={[{ height:360}]}>
					{files.slice(0, 9).map((file, index) => (
						<View >
							<View key={index} style={{ flexDirection: 'row',  justifyContent: 'space-between', top: 15 + index * 0.01}}>
								<Image style={[styles.back_arrow, {left:24, top:8}]} source={require('../images/my_file.png')}/>
								<TouchableOpacity onPress={ViewPlayback(index)} style={{left:35 }}>
									<Text style={styles.fileText}> {file} </Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => handle_idx(index)} style={{right:30}}>
								<Image style={[styles.back_arrow, {left:-10, top:8}]} source={require('../images/file_delete.png')}/>
								</TouchableOpacity>
							</View>
							<View style={[styles.line1, {top:5}]} />
						</View>

					 ))}
				</View>
			</ScrollView>

			<View style={[{ }]}>
				<View style={styles.button}>
					<TouchableOpacity  onPress={() => navigation.navigate('Page_61000')} style={{top:10}}>
						<Text style={styles.text3}>파일 더보기</Text>
					</TouchableOpacity>
				</View>
				
				<View style={[styles.line, {top: 25, width: '100%'}]} />
				
				<Text style={styles.text2}>로그아웃</Text>
				<TouchableOpacity onPress={handle_logout} style={[styles.image1, {top:86}]}>
					<Image source={require('../images/arrow2.png')} style={{ left:12}}/>
				</TouchableOpacity>
				
				<View style={[styles.line1, {top:58}]} />
				<Text style={[styles.text2, {top: 133}]}>회원탈퇴</Text>
				<TouchableOpacity onPress={() => navigation.navigate('Page_62000')} style={[styles.image1,{top:140}]}>
					<Image source={require('../images/arrow2.png')} style={{ left:12 }}/>
				</TouchableOpacity>
				
				
				<Dialog.Container visible={addVisible} contentStyle={styles.dialogContent}>
									
				 <Dialog.Title style={{left: '45%', height: 60}}>
					<View style ={{alignItems: 'center'}}>
						<Image source={require('../images/exclaim.png')} style={[{width: 30, height: 30}]} />
					</View>
				 </Dialog.Title>
				 <Dialog.Description style={{top:-25, left: 30, fontSize: 18, fontWeight: 800}} >로그아웃 하시겠습니까?</Dialog.Description>
				 <Dialog.Description style={{top:-35, left: 0, fontSize: 15, fontWeight: 400}} >로그아웃시 모든 푸시를 받지 못합니다.</Dialog.Description>
					<View style={styles.yes_no_btn}>
						<View style={styles.no_btn}>
							<TouchableOpacity onPress={() => setAddVisible(false)} >
								<Text style={styles.text1}>아니요</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.yes_btn}>
							<TouchableOpacity onPress={() => navigation.navigate('Intro_10000')} >
								<Text style={styles.text1}>예</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Dialog.Container>
				
				<Dialog.Container visible={delVisible} contentStyle={styles.dialogContent}>
									
				 <Dialog.Title style={{left: '45%', height: 60}}>
					<View style ={{alignItems: 'center'}}>
						<Image source={require('../images/exclaim.png')} style={[{width: 30, height: 30}]} />
					</View>
				 </Dialog.Title>
				 <Dialog.Description style={{top:-25, left: 10, fontSize: 16, fontWeight: 700}} >파일을 정말 삭제하시겠습니까?</Dialog.Description>
				 <Dialog.Description style={{top:-35, left: 9, fontSize: 15, fontWeight: 400}} >삭제된 파일은 복구할 수 없습니다.</Dialog.Description>
					<View style={styles.yes_no_btn}>
						<View style={styles.no_btn}>
							<TouchableOpacity onPress={() => setDelVisible(false)} >
								<Text style={styles.text1}>아니요</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.yes_btn}>
							<TouchableOpacity onPress={() => handle_delete()} >
								<Text style={styles.text1}>예</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Dialog.Container>




				<View style={[styles.line1, {top:90}]} />
			</View>
        </View>
    </View>
    <Footer navigation={navigation} selectedIconIndex={selectedIconIndex} setSelectedIconIndex={setSelectedIconIndex} />
    </>
  );
};

const styles = StyleSheet.create({
root: {
	width: '100%', 
	height: 800,
	flex:1,
	flexDirection: 'column',
	backgroundColor: '#FFFFFF',
},

back_arrow: {
    position: 'absolute', left: 10, top: 11,
	width: 20, 
	height: 20,
},

마이페이지: {
    position: 'absolute', left: '38%', top: 11,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: 23,
	textAlign: 'center',
    color: '#222222',
},

dialogContent: {
    borderRadius: 25, // 외곽선을 둥글게 만들기 위한 스타일
	height: 210,
    overflow: 'hidden', // border-radius와 함께 사용하여 둥근 형태를 유지
},

yes_no_btn: {
	flexDirection: 'row',
	flex: 1,
	top: -30,
	marginTop: 10,
	marginBottom: -10,
},

no_btn: {
	flex: 0.5,
	height:40,
	backgroundColor: '#808DD0',
	alignItems: 'center',
	justifyContent: 'center',
	borderColor: '#EDEDED',
	borderWidth: 1,
	borderRadius: 20,
	textColor: '#FFFFFF',
},

yes_btn: {
	flex: 0.5,
	alignItems: 'center',
	backgroundColor: '#322E7F',
	justifyContent: 'center',
	height:40,
	borderWidth: 1,
	borderRadius: 20,
	textColor: '#FFFFFF',
},

line: {
	borderColor: '#E0E0E0',
	backgroundColor: '#E0E0E0',
	borderWidth: 1,
	width: '100%',
},


line1: {
	borderColor: '#E0E0E0',
	backgroundColor: '#E0E0E0',
	borderWidth: 0.5,
	left: 24,
	width: '87%',
	marginTop: 20
},

button: {
	borderColor: '#808DD0',
	backgroundColor: '#FFFFFF',
	borderWidth: 1,
	width: '87%',
	height: 40,
	left: 24,
},

title: {
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    color: '#222222',
	marginTop: 70,
	left: 24,
	fontSize: 18,
	fontWeight: 700,
 },

My: {
    justifyContent: 'center', top: 21.1,
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
    color: '#000000',
},
text1: {
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 23,
    color: '#FFFFFF',
},

text2: {
    position: 'absolute', left: 24, top:80,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 23,
    textColor: '#322E7F',
},

text3: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 17,
    color: '#4543BA',
	textAlign: 'center',
},
fileText: {
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
	top:5, 
	left:10,
	bottom:10,
	marginBottom: 10,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 23,
    color: '#4F4F4F',
},

image1: {
    position: 'absolute', left: '87%', top: 557,
},
});

export default Page_60000;
