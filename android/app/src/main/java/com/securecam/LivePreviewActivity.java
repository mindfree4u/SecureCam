// view, layout, livemodule 간소화
// multirecord 기능 구현
// snapshot 기능 구현(라이브, 녹화영상에 대해 multi 처리)

package com.securecam;

import android.annotation.SuppressLint;
import android.app.Activity;

import android.os.Bundle;
import android.view.Gravity;
import android.view.SurfaceView;
import android.view.SurfaceHolder;
import android.view.View;

import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.ImageView;
import com.company.PlaySDK.Constants;
import com.company.netsdk.common.ToolKits;
import com.company.netsdk.module.IPLoginModule;
import com.company.netsdk.module.LivePreviewDoubleChannelModule;
import android.widget.LinearLayout;
import android.util.Log;

import androidx.appcompat.app.AlertDialog;
import androidx.core.content.ContextCompat;

import com.company.PlaySDK.IPlaySDK;

public class LivePreviewActivity extends Activity implements SurfaceHolder.Callback {
    private SurfaceView combinedSurfaceView;
    SurfaceView mRealViews[] = new SurfaceView[29];
    LinearLayout layouts[] = new LinearLayout[9];
    int R_id_layouts[] = new int[9];
    int R_id_rviews[] = new int[29];
    LivePreviewDoubleChannelModule mLiveModules[] = new LivePreviewDoubleChannelModule[16];

    private Button mBtnShowFour, BtnPlay, BtnRec, BtnSnapShot, BtnMute;
    private int ViewNum = 0;
    private boolean isPlaying = false;                         //전체재생 버튼 상태
    private boolean isRecord = false;
    private boolean  isMute = false;
    private final int STREAM_BUFFER_SIZE = 1024*1024*2;

    @SuppressLint("CutPasteId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_live_preview);

        TextView textView = findViewById(R.id.text_view);
        ImageView backButton = findViewById(R.id.back_button);

        BtnPlay = findViewById(R.id.btn_play);
        mBtnShowFour = findViewById(R.id.btn_show_four);
        BtnRec = findViewById(R.id.btn_Rec);
        BtnSnapShot = findViewById(R.id.btn_shapshot);
        BtnMute = findViewById(R.id.btn_soundoff);

        initResource_playback();

        combinedSurfaceView = findViewById(R.id.combined_surface_view);
        combinedSurfaceView.setVisibility(View.GONE);
        mLiveModules[0].multiPlay_channel1(0, 0, combinedSurfaceView, true);
        combinedSurfaceView.setVisibility(View.VISIBLE);
        setPlayStatus (false);
        ViewNum = 1;
        textView.setText("라이브뷰");

        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });

        BtnSnapShot.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                CapturePic();
            }
        });

        BtnRec.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                isRecord = !isRecord;
                onRecord(v, isRecord);
            }
        });

        BtnPlay.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isPlaying == false)
                    startMultiPlay(ViewNum);
                else                                             //전체중지 버튼 클릭 시
                    stopMultiPlay(ViewNum);
            }
        });

        BtnMute.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isMute == false) {
                    BtnMute.setText("음재생");
                    IPlaySDK.PLAYStopSound();
                }
                else {
                    BtnMute.setText("음소거");
                    IPlaySDK.PLAYPlaySound(-1);
                }
                isMute = !isMute;
            }
        });

        mBtnShowFour.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                RealView_Gone();
                if (ViewNum == 1) {
                    ViewNum = 4;
                    mBtnShowFour.setText("4분할");
                    combinedSurfaceView.setVisibility(View.GONE);
                    layouts[0].setVisibility(View.VISIBLE);
                    layouts[1].setVisibility(View.VISIBLE);

                    for(int i = 0; i < 4; i++) {
                        mRealViews[i].setVisibility(View.VISIBLE);
                        mLiveModules[i].multiPlay_channel1(i, 0, mRealViews[i], i == 0 ? true : false);
                    }

                    setPlayStatus (true);


                }
                else if (ViewNum == 4) {
                    ViewNum = 9;
                    mBtnShowFour.setText("9분할");
                    for(int i = 0; i < 5; i++)
                        layouts[i].setVisibility(i < 2 ? View.GONE: View.VISIBLE);

                    for(int i = 0; i < 9; i++) {    // mRealView5 ~ 13
                        mRealViews[i + 4].setVisibility(View.VISIBLE);
                        mLiveModules[i].multiPlay_channel1(i, 0, mRealViews[i + 4], i == 0 ? true : false);
                    }

                    setPlayStatus (true);


                }
                else if (ViewNum == 9) {
                    for(int i = 2; i < 9; i++)
                        layouts[i].setVisibility(i < 5 ? View.GONE: View.VISIBLE);

                    for(int i = 0; i < 16; i++) {   // mRealView14 ~ 29
                        mRealViews[i + 13].setVisibility(View.VISIBLE);
                        mLiveModules[i].multiPlay_channel1(i, 0, mRealViews[i + 13], i == 0 ? true : false);
                    }

                    setPlayStatus (true);
                    ViewNum = 16;
                    mBtnShowFour.setText("16분할");
                }
                else if(ViewNum == 16) {
                    for(int i = 5; i < 9; i++)
                        layouts[i].setVisibility(View.GONE);

                    combinedSurfaceView.setVisibility(View.VISIBLE);
                    mLiveModules[0].multiPlay_channel1(0, 0, combinedSurfaceView, true);

                    setPlayStatus (true);
                    ViewNum = 1;
                    mBtnShowFour.setText("1분할");
                }
            }
        });
    }

    private void initResource_playback() {
        for (int i = 0; i < 9; i++) {
            R_id_layouts[i] = this.getResources().getIdentifier("layout" + (i + 1), "id", this.getPackageName());
            layouts[i] = findViewById(R_id_layouts[i]);
            layouts[i].setVisibility(View.GONE);
        }

        for (int i = 0; i < 29; i++) {
            R_id_rviews[i] = this.getResources().getIdentifier("real_view_" + (i + 1), "id", this.getPackageName());
            mRealViews[i] = findViewById(R_id_rviews[i]);
        }

        for(int i = 0; i < 16; i++)
            mLiveModules[i] = new LivePreviewDoubleChannelModule(LivePreviewActivity.this);
    }

    private void startMultiPlay ( int ViewNum) {
        int nStartIdx = 0;

        if (ViewNum == 1) {
            mLiveModules[0].multiPlay_channel1(0, 0, combinedSurfaceView, true);
        }
        else {
            if (ViewNum == 4)
                nStartIdx = 0;
            else if (ViewNum == 9)
                nStartIdx = 4;
            else if (ViewNum == 16)
                nStartIdx = 13;

            for (int i = 0; i < ViewNum; i++) {
                mLiveModules[i].multiPlay_channel1(i, 0, mRealViews[i + nStartIdx], true);
            }
        }
        setPlayStatus(true);
    }

    private void stopMultiPlay ( int ViewNum) {
        for (int i = 0; i < ViewNum; i++) {
            mLiveModules[i].stopMultiPlay(true);
        }
        setPlayStatus(false);
    }

    private void setPlayStatus ( boolean bPlay){
        isPlaying = bPlay;
        if (isPlaying) {
            BtnPlay.setText("전체중지");
            BtnPlay.setCompoundDrawablesWithIntrinsicBounds(0, R.drawable.stop_all, 0, 0);
        }
        else {
            BtnPlay.setText("전체재생");
            BtnPlay.setCompoundDrawablesWithIntrinsicBounds(0, R.drawable.play_all, 0, 0);
        }
    }

    // 스냅샷 : JSH
    private void CapturePic() {
        for (int i = 0; i < ViewNum; i++)
            mLiveModules[i].capture(i);
    }

    // 영상녹화 (multi: JSH)
    private void onRecord(View v, boolean recordFlag){
        int port = mLiveModules[0].nFirst_portno;
        byte[] rr = new byte[24];  // array size must large than 24 , because it is used to store 6 int. if not , QueryInfo will return false.
        Integer gf = new Integer(0);

        if(recordFlag){
            if (mLiveModules != null) {
                for(int chn = 0; chn < ViewNum; chn++) {
                    if (IPlaySDK.PLAYQueryInfo(port + chn, Constants.PLAY_CMD_GetTime, rr, rr.length, gf) != 0)
                        mLiveModules[chn].record(recordFlag, chn);

                }
            }
            BtnRec.setText("녹화중지");
        }
        else {
            BtnRec.setText("영상녹화");
        }
    }

    protected void RealView_Gone() {
        for(int i = 0; i < 29; i++) {
            mRealViews[i].setVisibility(View.GONE);
        }
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
    }

    @Override
    public void onBackPressed() {
        finish();
    }
}