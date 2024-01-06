package com.securecam;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import com.company.netsdk.module.LivePreviewDoubleChannelModule;
import com.company.PlaySDK.IPlaySDK;
import com.company.PlaySDK.Constants;
import java.util.Map;
import java.util.ArrayList;
import java.io.File;
import android.util.Log;
import android.content.Context;
import android.content.res.Resources;
import android.view.SurfaceView;
import android.view.SurfaceHolder;

public class LivePreviewModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private Callback onItemClickCallback;
    private SurfaceView combinedSurfaceView;

    public LivePreviewModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.combinedSurfaceView = new SurfaceView(reactContext);

    }

    @Override
    public String getName() {
        return "LivePreviewModule";
    }

   @ReactMethod
   public void onRecord(boolean recordFlag) {
       byte[] rr = new byte[30];  // array size must large than 24 , because it is used to store 6 int. if not , QueryInfo will return false.
       Integer gf = new Integer(0);
       int port;
       LivePreviewDoubleChannelModule[] mLiveModules = new LivePreviewDoubleChannelModule[16]; // 16개의 모듈을 저장할 배열 생성

       for (int i = 0; i < 16; i++) {
           mLiveModules[i] = new LivePreviewDoubleChannelModule(reactContext);
           mLiveModules[i].multiPlay_channel1(i, 0, combinedSurfaceView, true);
       }

       if(recordFlag) {
           for (int chn = 0; chn < 16; chn++) {
                if (IPlaySDK.PLAYQueryInfo(mLiveModules[chn].nFirst_portno, Constants.PLAY_CMD_GetTime, rr, rr.length, gf) != 0)
                   mLiveModules[chn].record(recordFlag, chn);
           }
       }
       else
    {
            mLiveModules[0].stopMultiPlay(true);
            mLiveModules[0].record(recordFlag, 0);

    }
   }


}