import React, { useState, useEffect } from 'react';
import { View, Text, NativeModules, TextInput, Image, TouchableOpacity, Alert, StyleSheet, ScrollView, Linking } from 'react-native';
import Footer from './Footer';

const Page_61000 = ({ navigation}) => {
const [files, setFiles] = useState([]);                                  //FlieBrowerActivity.java 에서 가져온 녹화목록 저장용
const { FileBrowserModule } = NativeModules;
const [itemsToRemove, setItemsToRemove] = useState([]);
const [selectedIconIndex, setSelectedIconIndex] = useState(5);

useEffect(() => {
  const fetchFiles = async () => {
    try {
      const fileList = await FileBrowserModule.getFiles();
      setFiles(fileList);
    } catch (error) {
      console.error(error);
    }
  };
  // 함수 호출
  fetchFiles();
}, []);

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
  return (
    <>

	<View style={styles.root}>

			<View>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Image style={styles.back_arrow} source={require('../images/arrow.png')}/>
					<Text style={styles.내파일}>내 파일</Text>
					<View style={[styles.line, {top: 45, width: '100%'}]} />
				</TouchableOpacity>
			</View>
			
			<Text style={styles.title}>내 파일</Text>
			<View style={[styles.line1, {top:5}]} />

			<ScrollView >
				<ScrollView style={[{ height:1200}]}>
					{files.map((file, index) => (
						<View >
							<View key={index} style={{ flexDirection: 'row',  justifyContent: 'space-between', top: 15 + index * 0.01}}>
								<Image style={[styles.back_arrow, {left:20, top:8}]} source={require('../images/my_file.png')}/>
								<TouchableOpacity onPress={ViewPlayback(index)} style={{left:30 }}>
									<Text style={styles.fileText}> {file} </Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => removeItem(index)} style={{right:30}}>
								<Image style={[styles.back_arrow, {left:-10, top:8}]} source={require('../images/file_delete.png')}/>
								</TouchableOpacity>
							</View>
							<View style={[styles.line1, {top:5}]} />
						</View>

					 ))}
				</ScrollView>
			</ScrollView>


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

내파일: {
    position: 'absolute', left: '37%', top: 11,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: 23,
	textAlign: 'center',
    color: '#000000',
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
	width: '88%',
	left: '6%', 
	marginTop: 20
},

button: {
	borderColor: '#808DD0',
	backgroundColor: '#FFFFFF',
	borderWidth: 1,
	width: '88%',
	height: 40,
	left: '6%',
},

title: {
    fontFamily: 'Work Sans',
    fontStyle: 'normal',

    color: '#322E7F',
	marginTop: 70,
	left: 30,
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
    position: 'absolute', left: '11.12%', top: 100,
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 23,
    color: '#000000',
},

text2: {
    position: 'absolute', left: '6%', top:80,
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 23,
    textColor: '#3227F',
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
    fontFamily: 'Noto Sans KR',
    fontStyle: 'normal',
	top:5, 
	left:10,
	bottom:10,
	marginBottom: 10,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 23,
    color: '#000000',
},

image1: {
    position: 'absolute', left: '85%', top: 557,
},
});

export default Page_61000;
