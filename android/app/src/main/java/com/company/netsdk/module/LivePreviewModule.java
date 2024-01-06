package com.company.netsdk.module;

import android.content.Context;
import android.content.res.Resources;
import androidx.appcompat.app.AppCompatActivity;
import android.util.Log;
import android.view.SurfaceView;

import com.company.NetSDK.CB_fRealDataCallBackEx;
import com.company.NetSDK.INetSDK;
import com.company.NetSDK.SDK_RealPlayType;
import com.company.PlaySDK.IPlaySDK;
//import com.company.netsdk.R;
//import com.company.netsdk.activity.NetSDKApplication; //리액트 네이티브는 MainApplication.java로 대체
//import com.company.netsdk.common.ToolKits;
import com.facebook.react.bridge.ReactApplicationContext;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * Created by 29779 on 2017/4/8.
 */
public class LivePreviewModule {
    private static final String TAG = LivePreviewModule.class.getSimpleName();
    private final int STREAM_BUF_SIZE = 1024*1024*2;
    private final int RAW_AUDIO_VIDEO_MIX_DATA = 0; ///原始音视频混合数据;  ///Raw audio and video mixing data.
    long mRealHandle = 0;
    static Context mContext;
    Resources res;
    int mPlayPort = 0;
    int mCurVolume = -1;
    //NetSDKApplication sdkApp;
    boolean isRecording = false;
    boolean isOpenSound = true;
    boolean isDelayPlay = false;
    Map<Integer,Integer> streamTypeMap = new HashMap<Integer,Integer>();

    /// for preview date callback
    private CB_fRealDataCallBackEx mRealDataCallBackEx;


    public LivePreviewModule(Context context){
        this.mContext = context;
        res = mContext.getResources();
        mPlayPort = IPlaySDK.PLAYGetFreePort();
        isOpenSound = true;
        isDelayPlay = false;
      //  sdkApp = ((NetSDKApplication)((AppCompatActivity)mContext).getApplication());
        initMap();
    }

    ///码流类型的hash
    private void initMap(){
        streamTypeMap.put(0,SDK_RealPlayType.SDK_RType_Realplay_0);
        streamTypeMap.put(1,SDK_RealPlayType.SDK_RType_Realplay_1);
    }
        ///开始预览视频
        public void startPlay(int channel,int streamType,final SurfaceView view){
            Log.d(TAG,"StreamTpye: "+streamTypeMap.get(streamType));

            boolean isOpened = IPlaySDK.PLAYOpenStream(mPlayPort,null,0,STREAM_BUF_SIZE) == 0 ? false:true;
            if(!isOpened) {
                Log.d(TAG,"OpenStream Failed");
            }

            boolean isPlayin = IPlaySDK.PLAYPlay(mPlayPort,view) == 0 ? false : true;

            if (!isPlayin) {
                Log.d(TAG,"PLAYPlay Failed");
                IPlaySDK.PLAYCloseStream(mPlayPort);
            }

            IPLoginModule ipLoginModule = IPLoginModule.getInstance();  // 싱글톤 인스턴스 가져옴
            long loginHandle = ipLoginModule.getLoginHandle();          // 로그인 핸들 값 가져옴
            //mRealHandle = INetSDK.RealPlayEx(sdkApp.getLoginHandle(),channel,streamTypeMap.get(streamType));
            Log.d("LivePreview", "mLoginHandle:"+ loginHandle);
            mRealHandle = INetSDK.RealPlayEx(loginHandle,channel,streamTypeMap.get(streamType));
            Log.d("LivePreview", "mRealHandle:"+ mRealHandle);
            if (mRealHandle == 0){
                //   ToolKits.writeErrorLog("RealPlayEx failed!");
                return;
            }

            if (mRealHandle!=0){
            mRealDataCallBackEx = new CB_fRealDataCallBackEx() {
                @Override
                public void invoke(long rHandle, int dataType, byte[] buffer, int bufSize, int param) {
//                    Log.v(TAG,"dataType:"+dataType+"; bufSize:"+bufSize+"; param:"+param);
                    if (RAW_AUDIO_VIDEO_MIX_DATA == dataType){
//                        Log.i(TAG,"dataType == 0");
                        IPlaySDK.PLAYInputData(mPlayPort,buffer,buffer.length);
                    }
                }
            };
            INetSDK.SetRealDataCallBackEx(mRealHandle, mRealDataCallBackEx, 1);
        }
    }

    ///停止预览视频
    public void stopRealPlay(){
        if(mRealHandle == 0) {
            return;
        }

        try{
            IPlaySDK.PLAYStop(mPlayPort);
            if (isOpenSound) {
                IPlaySDK.PLAYStopSoundShare(mPlayPort);
            }
            IPlaySDK.PLAYCloseStream(mPlayPort);
            INetSDK.StopRealPlayEx(mRealHandle);
            IPlaySDK.PLAYRefreshPlay(mPlayPort);
            if (isRecording) {
                INetSDK.StopSaveRealData(mRealHandle);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        mRealHandle = 0;
        isRecording = false;
    }

    ///初始化视频窗口
    public void initSurfaceView(final SurfaceView sv){
        if (sv == null)
            return;
        IPlaySDK.InitSurface(mPlayPort,sv);
    }

    public boolean isRealPlaying() {
        return mRealHandle != 0;
    }

    public synchronized static String createInnerAppFile(String suffix){
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String time = format.format(new Date());
        String file = mContext.getExternalFilesDir(null).getAbsolutePath()+"/"+ time.replace(":","-").replace(" ", "_") +
                "."+suffix;
        return file;
    }
}
