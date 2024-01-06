package com.company.netsdk.module;

import android.content.Context;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.view.LayoutInflater;
import android.widget.AdapterView;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import com.company.NetSDK.CB_fSearchDevicesCB;
import com.company.NetSDK.INetSDK;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.company.netsdk.module.DeviceSearchModule;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import javax.annotation.Nullable;
import com.company.NetSDK.DEVICE_NET_INFO_EX;
import com.facebook.react.bridge.Callback;
import java.util.HashSet;
import java.util.Set;
import android.util.Log;

public class DeviceSearchModuleBridge extends ReactContextBaseJavaModule {
    private Set<String> inforSet = new HashSet<>();
    private final int UPDATE_DEVICE_SEARCH_INFOR = 0x10;
    private DeviceSearchModule mDeviceSearchModule;
    private DEVICE_NET_INFO_EX device_net_info_ex;
    private boolean isSearch = false;
    static String SearchedSN = "";

    public DeviceSearchModuleBridge(ReactApplicationContext reactContext) {
        super(reactContext);
        mDeviceSearchModule = new DeviceSearchModule(reactContext);
        device_net_info_ex = new DEVICE_NET_INFO_EX();
    }

    @Override
    public String getName() {
        return "DeviceSearchModule";
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void startSearchDevices() {
        SearchedSN = "";
        CB_fSearchDevicesCB callback = new CB_fSearchDevicesCB() {
            @Override
            public void invoke(DEVICE_NET_INFO_EX device_net_info_ex) {
                String temp =  new String(device_net_info_ex.szDevName).trim() + "\n" +
                        "SN: " + new String(device_net_info_ex.szSerialNo).trim() + "\nIP: "+ new String(device_net_info_ex.szIP).trim();

                // 결과를 로그로 출력
                Log.d("CB_fSearchDevicesCB", "invoke result: " + temp);

                String serialNo = new String(device_net_info_ex.szSerialNo).trim();
                String ipAddr = new String(device_net_info_ex.szIP).trim();
                String deviceType = new String(device_net_info_ex.szDeviceType).trim();

                if(!SearchedSN.equals(serialNo)) {
                    // 결과를 JavaScript로 전달
                    WritableMap params = Arguments.createMap();
                    params.putString("DEVINFO", deviceType + "\nSN: " + serialNo+"\nIP: "+ipAddr);
                    params.putString("DEVTYPE", deviceType);
                    params.putString("IP", ipAddr);
                    sendEvent(getReactApplicationContext(), "onDeviceFound", params);
                    SearchedSN = serialNo;
                }
            }
        };
        // dummy, test용
       //  WritableMap params = Arguments.createMap();
       //  params.putString("DEVINFO", "NVR" + "\nSN: " + "TESTSERIALNO"+"\nIP: "+"192.168.0.253");
       //  params.putString("IP", "192.168.0.253");
       //  sendEvent(getReactApplicationContext(), "onDeviceFound", params);


        long lDevSearchHandle = INetSDK.StartSearchDevices(callback);
    }
}
