package com.securecam;

import android.os.Bundle;
import android.view.SurfaceView;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.company.NetSDK.NET_EM_CFG_OPERATE_TYPE;
import com.company.NetSDK.NET_VIDEOIN_COLOR_INFO;
import com.company.netsdk.module.LivePreviewDoubleChannelModule;

public class Page_15300 extends AppCompatActivity {
    private SurfaceView combinedSurfaceView;
    private ImageView backButton, FocusMinusBtn, FocusPlusBtn, EnlargementMinusBtn, EnlargementPlusBtn, BrightMinusBtn, BrightPlusBtn, ContrastMinusBtn, ContrastPlusBtn;
    private TextView focus_Txt, enlargement_Txt, brightness_Txt, contrast_Txt;
    private LivePreviewDoubleChannelModule mLiveModule17;
    // private final int STREAM_BUFFER_SIZE = 1024*1024*2;

    int channel;
    static int enlarge_no = 0;
    private int port;

    NET_VIDEOIN_COLOR_INFO  CFG_Video;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_page_15300);
        mLiveModule17 = new LivePreviewDoubleChannelModule(this);
        backButton = findViewById(R.id.back_button);
        FocusMinusBtn = findViewById(R.id.focus_minus_button);
        FocusPlusBtn = findViewById(R.id.focus_plus_button);
        EnlargementMinusBtn = findViewById(R.id.enlargement_minus_button);
        EnlargementPlusBtn = findViewById(R.id.enlargement_plus_button);
        BrightMinusBtn = findViewById(R.id.bright_minus_button);
        BrightPlusBtn = findViewById(R.id.bright_plus_button);
        ContrastMinusBtn = findViewById(R.id.contrast_minus_button);
        ContrastPlusBtn = findViewById(R.id.contrast_plus_button);

        focus_Txt = findViewById(R.id.focus_txt);
        enlargement_Txt = findViewById(R.id.enlargement_txt);
        brightness_Txt = findViewById(R.id.brightness_txt);
        contrast_Txt = findViewById(R.id.contrast_txt);


        CFG_Video   = new NET_VIDEOIN_COLOR_INFO();                   //saturation, brightness, Contrast 조정용

        combinedSurfaceView = findViewById(R.id.combined_surface_view);

        mLiveModule17.GetConfig(NET_EM_CFG_OPERATE_TYPE.NET_EM_CFG_VIDEOIN_COLOR, 0, CFG_Video, 1000, null);

        mLiveModule17.multiPlay_channel1(0, 0, combinedSurfaceView, true);


        CFG_Video.nSaturation = Math.max(0, CFG_Video.nSaturation);
        focus_Txt.setText(String.valueOf(CFG_Video.nSaturation));

        float x = combinedSurfaceView.getScaleX();
        enlargement_Txt.setText("1");

        CFG_Video.nBrightness = Math.max(0, CFG_Video.nBrightness);
        brightness_Txt.setText(String.valueOf(CFG_Video.nBrightness));

        CFG_Video.nContrast = Math.max(0, CFG_Video.nContrast);
        contrast_Txt.setText(String.valueOf(CFG_Video.nContrast));

        EnlargementMinusBtn.setAlpha(0.2f);

        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });

//초점마이너스 버튼 클릭시
        FocusMinusBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //mLiveModule17.FocusControl(0, long dwFocusCommand, double dFocus, double dZoom, null , 500);
                CFG_Video.nSaturation = Math.max(0, CFG_Video.nSaturation - 10);               // 최소값이 0 이하가 되지않게 설정
                mLiveModule17.SetConfig(NET_EM_CFG_OPERATE_TYPE.NET_EM_CFG_VIDEOIN_COLOR, 0, CFG_Video, 400, null, null);
                String vlu = String.format("%3s", String.valueOf(CFG_Video.nSaturation));
                focus_Txt.setText(vlu);
                if( CFG_Video.nSaturation == 0) {
                    FocusMinusBtn.setAlpha(0.4f);
                } else {
                    FocusMinusBtn.setAlpha(1.0f);
                }
                FocusPlusBtn.setAlpha(1.0f);
            }
        });

//초점플러스 버튼 클릭시
        FocusPlusBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                CFG_Video.nSaturation = Math.min(100, CFG_Video.nSaturation + 10); // 최대값이 100 이상 되지않게 설정
                mLiveModule17.SetConfig(NET_EM_CFG_OPERATE_TYPE.NET_EM_CFG_VIDEOIN_COLOR, 0, CFG_Video, 400, null, null);
                focus_Txt.setText(String.valueOf(CFG_Video.nSaturation));
                if( CFG_Video.nSaturation == 100) {
                    FocusPlusBtn.setAlpha(0.4f);
                } else {
                    FocusPlusBtn.setAlpha(1.0f);
                }
                FocusMinusBtn.setAlpha(1.0f);
            }
        });

        EnlargementMinusBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                float x = combinedSurfaceView.getScaleX();
                float y = combinedSurfaceView.getScaleY();

                if (enlarge_no > 1) {
                    combinedSurfaceView.setScaleX((float) (x / 1.2));
                    combinedSurfaceView.setScaleY((float) (y / 1.2));
                    enlarge_no -=1;
                }

                enlargement_Txt.setText(String.valueOf(enlarge_no));

                if( enlarge_no == 1) {
                    EnlargementMinusBtn.setAlpha(0.2f);
                } else {
                    EnlargementMinusBtn.setAlpha(1.0f);
                }
                EnlargementPlusBtn.setAlpha(1.0f);
            }
        });
;
        EnlargementPlusBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                float x = combinedSurfaceView.getScaleX();
                float y = combinedSurfaceView.getScaleY();

                if (enlarge_no < 10) {
                    combinedSurfaceView.setScaleX((float) (x * 1.2));
                    combinedSurfaceView.setScaleY((float) (y * 1.2));
                    enlarge_no +=1;
                }
                enlargement_Txt.setText(String.valueOf(enlarge_no));
                if( enlarge_no == 10) {
                    EnlargementPlusBtn.setAlpha(0.2f);
                } else {
                    EnlargementPlusBtn.setAlpha(1.0f);
                }
                EnlargementMinusBtn.setAlpha(1.0f);
            }
        });

        BrightMinusBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                CFG_Video.nBrightness = Math.max(0, CFG_Video.nBrightness - 10);
                mLiveModule17.SetConfig(NET_EM_CFG_OPERATE_TYPE.NET_EM_CFG_VIDEOIN_COLOR, 0, CFG_Video, 400, null, null);
                brightness_Txt.setText(String.valueOf(CFG_Video.nBrightness));
                if( CFG_Video.nBrightness == 0) {
                    BrightMinusBtn.setAlpha(0.4f);
                } else {
                    BrightMinusBtn.setAlpha(1.0f);
                }
                BrightPlusBtn.setAlpha(1.0f);
            }
        });

        BrightPlusBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                CFG_Video.nBrightness = Math.min(100, CFG_Video.nBrightness + 10);
                mLiveModule17.SetConfig(NET_EM_CFG_OPERATE_TYPE.NET_EM_CFG_VIDEOIN_COLOR, 0, CFG_Video, 400, null, null);
                brightness_Txt.setText(String.valueOf(CFG_Video.nBrightness));
                if( CFG_Video.nBrightness == 100) {
                    BrightPlusBtn.setAlpha(0.4f);
                } else {
                    BrightPlusBtn.setAlpha(1.0f);
                }
                BrightMinusBtn.setAlpha(1.0f);
            }
        });

        ContrastMinusBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                CFG_Video.nContrast = Math.max(0, CFG_Video.nContrast - 10);
                mLiveModule17.SetConfig(NET_EM_CFG_OPERATE_TYPE.NET_EM_CFG_VIDEOIN_COLOR, 0, CFG_Video, 400, null, null);
                contrast_Txt.setText(String.valueOf(CFG_Video.nContrast));
                if( CFG_Video.nBrightness == 0) {
                    ContrastMinusBtn.setAlpha(0.4f);
                } else {
                    ContrastMinusBtn.setAlpha(1.0f);
                }
                ContrastPlusBtn.setAlpha(1.0f);
            }
        });

        ContrastPlusBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                CFG_Video.nContrast = Math.min(100, CFG_Video.nContrast + 10);
                mLiveModule17.SetConfig(NET_EM_CFG_OPERATE_TYPE.NET_EM_CFG_VIDEOIN_COLOR, 0, CFG_Video, 400, null, null);
                contrast_Txt.setText(String.valueOf(CFG_Video.nContrast));
                if( CFG_Video.nBrightness == 100) {
                    ContrastPlusBtn.setAlpha(0.4f);
                } else {
                    ContrastPlusBtn.setAlpha(1.0f);
                }
                ContrastMinusBtn.setAlpha(1.0f);
            }
        });

    }

}
;