package com.company.netsdk.module;

import android.content.Context;
import android.content.res.Resources;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

import com.company.NetSDK.AV_CFG_ChannelName;
import com.company.NetSDK.CB_fRealDataCallBackEx;
import com.company.NetSDK.FinalVar;
import com.company.NetSDK.INetSDK;
import com.company.NetSDK.NET_EM_CFG_OPERATE_TYPE;
import com.company.NetSDK.NET_EM_OSD_BLEND_TYPE;
import com.company.NetSDK.NET_OSD_CHANNEL_TITLE;
import com.company.NetSDK.SDK_RealPlayType;
import com.company.NetSDK.NET_DEVICEINFO_Ex;

import com.company.PlaySDK.Constants;
import com.company.PlaySDK.IPlaySDK;
import com.company.PlaySDK.IPlaySDK.CUSTOMRECT;
import com.company.netsdk.common.ToolKits;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.io.File;
import android.os.Environment;
import com.company.netsdk.module.EncodeModule;
import com.securecam.Page_15100;

public class LivePreviewDoubleChannelModule {
    HashMap<Long, Integer> handlersMapPorts = new HashMap<Long, Integer>();
    Map<Integer, Integer> streamTypeMap = new HashMap<Integer, Integer>();
    long playHandle_1 = 0;
    long playHandle_2 = 0;
    public int port;
    boolean isRecording = false;
    public int nFirst_portno = 0;
    private final int STREAM_BUFFER_SIZE = 1024 * 1024 * 2;
    private CB_fRealDataCallBackEx mRealDataCallBackChannelOne;

    NET_DEVICEINFO_Ex deviceInfo = new NET_DEVICEINFO_Ex();
    EncodeModule encodeModule;
    private boolean Resolve = Page_15100.Resolution;

    Resources res;
    Context mContext;

    IPLoginModule ipLoginModule = IPLoginModule.getInstance();  // 싱글톤 인스턴스 가져옴
    long loginHandle = ipLoginModule.getLoginHandle();

    public LivePreviewDoubleChannelModule(Context context) {
        this.mContext = context;
        res = mContext.getResources();
       // encodeModule = new EncodeModule(context);
        encodeModule = new EncodeModule(this.mContext);
        initMap();
    }

    ///码流类型的hash
    private void initMap() {
        streamTypeMap.put(0, SDK_RealPlayType.SDK_RType_Realplay_0);
        streamTypeMap.put(1, SDK_RealPlayType.SDK_RType_Realplay_1);
        if(Resolve)
        encodeModule.updateResolve(0, "1920*1080", true);

        else if(!Resolve)
        encodeModule.updateResolve(0, "1280*720", true);
    }

    public boolean multiPlay_channel1(int chn, int streamType, final SurfaceView view, boolean bFirst) {
        // final int port = IPlaySDK.PLAYGetFreePort();
        port = IPlaySDK.PLAYGetFreePort();

        if (bFirst) {
            nFirst_portno = port;
        }

        initSurfaceView(port, view);
        if (!openStream(view, port)) {
            return false;
        }

        if (IPlaySDK.PLAYSetDelayTime(port, 500/*ms*/, 1000/*ms*/) == 0) {

        }
        playHandle_1 = INetSDK.RealPlayEx(loginHandle, chn, streamTypeMap.get(streamType));

        if (playHandle_1 == 0) {
            return false;
        }
        handlersMapPorts.put(playHandle_1, port);
        mRealDataCallBackChannelOne = new CB_fRealDataCallBackEx() {
            @Override
            public void invoke(long lRealHandle, int dwDataType, byte[] pBuffer, int dwBufSize, int param) {
                if (0 == dwDataType) {
                    IPlaySDK.PLAYInputData(port, pBuffer, pBuffer.length);
                }
            }
        };
        INetSDK.SetRealDataCallBackEx(playHandle_1, mRealDataCallBackChannelOne, 1);

        return true;
    }

    private boolean openStream(final SurfaceView view, final int port) {
        if (IPlaySDK.PLAYOpenStream(port, null, 0, STREAM_BUFFER_SIZE) == 0) {
            return false;
        }
        boolean result = IPlaySDK.PLAYPlay(port, view) == 0 ? false : true;
        if (!result) {
            IPlaySDK.PLAYCloseStream(port);
            return false;
        }
        return true;
    }

    public void release() {
        stopMultiPlay(true);
        handlersMapPorts.clear();
        //       handlersMapPorts = null;
//               mContext = null;
//        ipLoginModule= null;
    }

    public void stopMultiPlay(boolean first) {
        if (first) {
            if (playHandle_1 != 0) {
                INetSDK.StopRealPlayEx(playHandle_1);
                if (handlersMapPorts.containsKey(playHandle_1)) {
                    int port1 = handlersMapPorts.get(playHandle_1);
                    IPlaySDK.PLAYStop(port1);
                    IPlaySDK.PLAYCloseStream(port1);
                }
                handlersMapPorts.remove(playHandle_1);
                playHandle_1 = 0;
            }
        } else {
            if (playHandle_2 != 0) {
                INetSDK.StopRealPlayEx(playHandle_2);
                if (handlersMapPorts.containsKey(playHandle_2)) {
                    int port2 = handlersMapPorts.get(playHandle_2);
                    IPlaySDK.PLAYStop(port2);
                    IPlaySDK.PLAYCloseStream(port2);
                }
                handlersMapPorts.remove(playHandle_2);
                playHandle_2 = 0;
            }
        }
    }

    public boolean capture(int chn) {
        if (playHandle_1 == 0) {
            return false;
        }

        int port = handlersMapPorts.get(playHandle_1);
        String recordFile = createInnerAppFile(chn, "jpg");
        if (IPlaySDK.PLAYCatchPicEx(port, recordFile, Constants.PicFormat_JPEG) == 0) {
            return false;
        }
        return true;
    }

    //라이브영상 녹화 및 저장 시작
    public boolean record(boolean recordFlag, int chn){
        // if (mRealHandle == 0) {
        if (playHandle_1 == 0) {
            return false;
        }

        isRecording = recordFlag;
        if(isRecording){
//            String recordFile = createInnerAppFile(nFirst_portno + chn, chn, "dav");
            String recordFile = createInnerAppFile(chn, "dav");
            if (!INetSDK.SaveRealData(playHandle_1, recordFile)){
                ToolKits.writeErrorLog("record file:"+recordFile);
                return false;
            }
        }else {
            INetSDK.StopSaveRealData(playHandle_1);
        }
        return true;
    }

    // JSH: 파일명에 channelname(port_no) 추가
    public synchronized  String createInnerAppFile(int chn, String suffix){

        NET_OSD_CHANNEL_TITLE stIn = new NET_OSD_CHANNEL_TITLE();
        stIn.emOsdBlendType = NET_EM_OSD_BLEND_TYPE.NET_EM_OSD_BLEND_TYPE_MAIN; // 叠加类型
        String channelname = "";

        if (INetSDK.GetConfig(ipLoginModule.getLoginHandle(), NET_EM_CFG_OPERATE_TYPE.NET_EM_CFG_CHANNELTITLE, chn, stIn, 3000, null)) {
            channelname = getChannelName(chn);
            ToolKits.writeLog(channelname);
        } else {
            ToolKits.writeErrorLog("Get Faile" );
        }

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String time = format.format(new Date());
//        String file = mContext.getExternalFilesDir(null).getAbsolutePath()+"/"+ time.replace(":","-").replace(" ", "_") +
//                "_" + port + "."+suffix;

        String file = mContext.getExternalFilesDir(null).getAbsolutePath()+"/"+ time.replace(":","-").replace(" ", "_") +
                "_" + channelname + "."+suffix;
        return file;
    }

    //라이브영상 녹화 및 저장 끝
    public String getChannelName(int channel) {
        AV_CFG_ChannelName channelTitleName;
        String channelName = null;
        channelTitleName = new AV_CFG_ChannelName();
        if(!ToolKits.GetDevConfig(FinalVar.CFG_CMD_CHANNELTITLE, channelTitleName, ipLoginModule.getLoginHandle(), channel, 2048)) {
            return "";
        }

        channelName = new String(channelTitleName.szName).trim();
        ToolKits.writeLog("channelName:" + new String(channelTitleName.szName).trim());
        return channelName;
    }

   // 영상 녹화 및 저장 시작
    public boolean record(boolean recordFlag) {
        // if (mRealHandle == 0) {
        if (playHandle_1 == 0) {
            return false;
        }

        isRecording = recordFlag;
        if (isRecording) {
            String recordFile = createInnerAppFile("dav");
            if (!INetSDK.SaveRealData(playHandle_1, recordFile)) {
                return false;
            }
        } else {
            INetSDK.StopSaveRealData(playHandle_1);
        }
        return true;
    }

    public synchronized String createInnerAppFile(String suffix) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String time = format.format(new Date());
        String file = mContext.getExternalFilesDir(null).getAbsolutePath() + "/" + time.replace(":", "-").replace(" ", "_") +
                "." + suffix;
        return file;
    }
//영상 녹화 및 저장 끝

    public void initSurfaceView(final int port, final SurfaceView view) {
        view.getHolder().addCallback(new SurfaceHolder.Callback() {
            @Override
            public void surfaceCreated(SurfaceHolder holder) {
                IPlaySDK.InitSurface(port, view);
            }

            @Override
            public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {

            }

            @Override
            public void surfaceDestroyed(SurfaceHolder holder) {
                release();
            }
        });
    }

    //현재 조정값 가져오기
    public boolean GetConfig(int emCfgOpType, int nChannelID, Object cfgData, int nWaitTime, Object reserved) {
        long lLoginID = loginHandle;
        if (INetSDK.GetConfig(lLoginID, emCfgOpType, nChannelID, cfgData, nWaitTime, reserved)) {
            return true;
        } else {
            return false;
        }

    }

    //라이브뷰 조정값 저장
    public boolean SetConfig(int emCfgOpType, int nChannelID, Object cfgData, int nWaitTime, Object restart, Object reserved) {
        long lLoginID = loginHandle;
        if (INetSDK.SetConfig(lLoginID, emCfgOpType, nChannelID, cfgData, nWaitTime, restart, reserved)) {
            return true;
        } else {
            return false;
        }

    }

    //화면확대 (PTZ 카메라 사용시 가능)
    public boolean PTZControl(int nChannelID, int dwPTZCommand, int dwStep, boolean dwStop) {
        long lLoginID = loginHandle;
        if (INetSDK.PTZControl(lLoginID, nChannelID, dwPTZCommand, dwStep, dwStop)) {
            return true;
        }else {
            return false;
        }

    }

}