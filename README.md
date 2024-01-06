# React-native 
**Android studio 설치 및 설정** <br>
1.사용자환경변수 추가 <br>
변수이름 : ANDROID_HOME  <br>
변수값 : C:\~~~~\AppData\Local\Android\Sdk    (안드로이드 SDK 위치지정) <br>

2.Platform Settings > SDKs로 들어와서 JDK home path를 아래내용으로 수정 <br>
내 PC > 우클릭 속성 > 고급 시스템 설정 > 환경변수 > JAVA_HOME에 설정된 값으로 JDK home path를 설정<br>

<br>
최초 1회 설정 : 컴맨드창에서 
              adb devices 
              로 디바이스 이름 확인 후, 아래 명령어 입력 필요. <br>
              adb -s 디바이스 이름 reverse tcp:8081 tcp:8081
<br><br>

 1. **cmd창에서 다운로드한 프로젝트 폴더로 이동**
 2. **cmd창에서 npm install 입력 후 실행**
 3. **cmd창에서 npm start 입력 후 실행 (안될 경우 package-lock.json 파일 삭제)**
 4. **cmd창에서 react-native run-android 입력 후 실행 (cdm창을 다시 열거나 ctr+c 입력 후 실행)**
"# SecureCam" 
