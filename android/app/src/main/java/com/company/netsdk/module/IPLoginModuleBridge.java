package com.company.netsdk.module;

import com.company.NetSDK.FinalVar;
import com.company.NetSDK.INetSDK;
import com.company.NetSDK.SDKDEV_VERSION_INFO;
import com.company.netsdk.common.ToolKits;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.util.Log;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nullable;

public class IPLoginModuleBridge extends ReactContextBaseJavaModule {

    public IPLoginModuleBridge(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "IPLoginModule";
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
    @ReactMethod
    public void login(String address, String port, String username, String password, Promise promise) {
        IPLoginModule ipLoginModule = IPLoginModule.getInstance();
        boolean loginResult = ipLoginModule.login(address, port, username, password);


        SDKDEV_VERSION_INFO version = new SDKDEV_VERSION_INFO();
        boolean bRet = INetSDK.QueryDevState(ipLoginModule.getLoginHandle(), FinalVar.SDK_DEVSTATE_SOFTWARE, version, 5000);
        if(bRet) {
            ToolKits.writeLog("QueryVersion Succeed!");
            ToolKits.writeLog("장치유형：" + new String(version.szDevType).trim());
            ToolKits.writeLog("HW버전：" + new String(version.szHardwareVersion).trim());
            ToolKits.writeLog("SW버전：" + new String(version.szSoftWareVersion).trim());
            ToolKits.writeLog("SN：" + new String(version.szDevSerialNo).trim());
        } else {
            ToolKits.writeErrorLog("QueryVersion Failed!" );
        }

        ipLoginModule.getDeviceInfo();


        if (loginResult) {
            Log.d("IP login", "IPlogin 성공");
         //   promise.resolve(true);
            promise.resolve(new String(version.szDevSerialNo).trim());
//            promise.resolve(new String(version.szDevSerialNo).trim());
        } else {
            Log.d("IP login", "IPlogin 실패");
            promise.reject("LOGIN_FAILED", "로그인에 실패했습니다.");
        }
    }


    @ReactMethod
    public void logout() {
        IPLoginModule ipLoginModule = IPLoginModule.getInstance();
        ipLoginModule.logout();
    }

    // Add more methods if required to interact with other functions in IPLoginModule
    public void QueryDeviceSoftWare(long __LoginHandle) {
        SDKDEV_VERSION_INFO version = new SDKDEV_VERSION_INFO();
        boolean bRet = INetSDK.QueryDevState(__LoginHandle, FinalVar.SDK_DEVSTATE_SOFTWARE, version, 5000);
        if(bRet) {
            ToolKits.writeLog("QueryVersion Succeed!");
            ToolKits.writeLog("장치유형：" + new String(version.szDevType).trim());
            ToolKits.writeLog("HW버전：" + new String(version.szHardwareVersion).trim());
            ToolKits.writeLog("SW버전：" + new String(version.szSoftWareVersion).trim());
            ToolKits.writeLog("SN：" + new String(version.szDevSerialNo).trim());

            WritableMap params = Arguments.createMap();
            params.putString("SN", new String(version.szDevSerialNo).trim());
            sendEvent(getReactApplicationContext(), "SERIALNO", params);
        } else {
            ToolKits.writeErrorLog("QueryVersion Failed!" );
        }
    }
}