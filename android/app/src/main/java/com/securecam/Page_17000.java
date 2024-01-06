package com.securecam;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import androidx.appcompat.app.AppCompatActivity;
import android.view.SurfaceView;
import android.view.SurfaceHolder;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.TextView;
import android.widget.ImageView;
import com.company.NetSDK.CB_fDownLoadPosCallBack;
import com.company.NetSDK.NET_TIME;
import com.company.PlaySDK.Constants;
import com.company.netsdk.module.PlayBackModule;
import android.widget.LinearLayout;
import androidx.appcompat.app.AlertDialog;
import android.content.DialogInterface;
import com.securecam.R;
import com.company.PlaySDK.IPlaySDK;
import android.util.Log;
import android.view.LayoutInflater;
import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.widget.DatePicker;
import android.widget.TimePicker;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

public class Page_17000 extends AppCompatActivity {
    private SurfaceView combinedSurfaceView = null;
    SurfaceView mRealViews[] = new SurfaceView[29];
    LinearLayout layouts[] = new LinearLayout[9];
    PlayBackModule mPlayBackModules[] = new PlayBackModule[16];
    int R_id_layouts[] = new int[9];
    int R_id_rviews[] = new int[29];

    private Button mBtnShowFour, BtnPlay, BtnSnapShot, BtnMute;

    private TextView mPlayBackTimeTv, mCurrentOSDTime;
    private Calendar calendar;
    private int ViewNum = 0, StreamType = 0;
    long currentProgress = -1;
    private final int UPDATE_PLAYBACK_PROGRESS = 0x25;
    private boolean isPlaying = false;
    private boolean isMute = false;
    NET_TIME mPlayBackTime = new NET_TIME();

    Handler mHandler = new Handler(Looper.getMainLooper()) {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                default:
                    break;
            }
        }
    };


    protected void RealView_Gone() {
        for(int i = 0; i < 29; i++) {
            mRealViews[i].setVisibility(View.GONE);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_page_17000);

        TextView textView = findViewById(R.id.text_view);
        ImageView backButton = findViewById(R.id.back_button);

        initResource_playback();
        combinedSurfaceView = findViewById(R.id.play_back_view);

        initPlayBackTime();
        mPlayBackTimeTv = findViewById(R.id.playback_date);
        mPlayBackTimeTv.setText(new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date()));
        BtnPlay = findViewById(R.id.btn_play);
        mBtnShowFour = findViewById(R.id.btn_show_four);
        BtnSnapShot = findViewById(R.id.btn_shapshot);
        BtnMute = findViewById(R.id.btn_soundoff);
        combinedSurfaceView.setVisibility(View.VISIBLE);

        setPlayStatus(false);
        textView.setText("녹화영상");
        stopPlayBack(mPlayBackModules[0]);
        mPlayBackModules[0].setView(combinedSurfaceView);
        ViewNum = 1;

        mPlayBackTimeTv.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showDateTimePicker();
            }
        });

        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });

        BtnPlay.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!isPlaying)
                    startPlaybackPlay();
                else
                    stoplaybackPlay();
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

        BtnSnapShot.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                CapturePic();
            }
        });


        mBtnShowFour.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RealView_Gone();
                if (ViewNum == 1) {
                    combinedSurfaceView.setVisibility(View.GONE);
                    stopPlayBack(mPlayBackModules[0]);

                    layouts[0].setVisibility(View.VISIBLE);
                    layouts[1].setVisibility(View.VISIBLE);

                    for(int i = 0; i < 4; i++) {
                        mRealViews[i].setVisibility(View.VISIBLE);
                        mPlayBackModules[i].setView(mRealViews[i]);
                        playBack(mPlayBackModules[i], i);
                    }

                    mBtnShowFour.setText("4분할");
                    ViewNum = 4;

                } else if (ViewNum == 4) {
                    for(int i = 0; i < 4; i++)
                        stopPlayBack(mPlayBackModules[i]);

                    for(int i = 0; i < 5; i++)
                        layouts[i].setVisibility(i < 2 ? View.GONE: View.VISIBLE);

//                    for(int i = 4; i < 13; i++)    // mRealView5 ~ 13
//                        mRealViews[i].setVisibility(View.VISIBLE);

                    for(int i = 0; i < 9; i++) { // mRealView5 ~ 13
                        mRealViews[i + 4].setVisibility(View.VISIBLE);
                        mPlayBackModules[i].setView(mRealViews[i + 4]);
                        playBack(mPlayBackModules[i], i);
                    }
                    ViewNum = 9;
                    mBtnShowFour.setText("9분할");

                } else if (ViewNum == 9) {
                    for(int i = 0; i < 9; i++)
                        stopPlayBack(mPlayBackModules[i]);

                    for(int i = 2; i < 9; i++)
                        layouts[i].setVisibility(i < 5 ? View.GONE: View.VISIBLE);

                    for(int i = 0; i < 16; i++) {   // mRealView14 ~ 29
                        mRealViews[i + 13].setVisibility(View.VISIBLE);
                        mPlayBackModules[i].setView(mRealViews[i + 13]);
                        playBack(mPlayBackModules[i], i);
                    }
                    ViewNum = 16;
                    mBtnShowFour.setText("16분할");

                } else if (ViewNum == 16) {
                    for(int i = 0; i < 16; i++)
                        stopPlayBack(mPlayBackModules[i]);

                    for(int i = 5; i < 9; i++)
                        layouts[i].setVisibility(View.GONE);

                    combinedSurfaceView.setVisibility(View.VISIBLE);
                    mPlayBackModules[0].setView(combinedSurfaceView);
                    playBack(mPlayBackModules[0],0);
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

        for (int i = 0; i < 16; i++)
            mPlayBackModules[i] = new PlayBackModule(this);
    }

    private void startPlaybackPlay() {
        int nStartIdx = 0;

        if (ViewNum == 1) {
            playBack(mPlayBackModules[0], 0);
        }
        else {
            if (ViewNum == 4)
                nStartIdx = 0;
            else if (ViewNum == 9)
                nStartIdx = 4;
            else if (ViewNum == 16)
                nStartIdx = 13;

            for (int i = 0; i < 9; i++) {     // mRealView5 ~ 13
                playBack(mPlayBackModules[i], i);
            }
        }
        setPlayStatus(true);
    }

    private void stoplaybackPlay () {
        for (int i = 0; i < ViewNum; i++) {     // mRealView5 ~ 13
            stopPlayBack(mPlayBackModules[i]);
        }
        setPlayStatus(false);
    }

    private void CapturePic() {
        for (int i = 0; i < ViewNum; i++)
            mPlayBackModules[i].capture(i);
    }

    private void initPlayBackTime () {
        calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        mPlayBackTime.dwYear = calendar.get(Calendar.YEAR);
        mPlayBackTime.dwMonth = calendar.get(Calendar.MONTH) + 1;
        mPlayBackTime.dwDay = calendar.get(Calendar.DAY_OF_MONTH);
        mPlayBackTime.dwHour = 0;
        mPlayBackTime.dwMinute = 0;
        mPlayBackTime.dwSecond = 0;
    }


    private void showDateTimePicker() {
        int currentYear = calendar.get(Calendar.YEAR);
        int currentMonth = calendar.get(Calendar.MONTH);
        int currentDay = calendar.get(Calendar.DAY_OF_MONTH);

        // Inflate the custom layout
        View dialogView = LayoutInflater.from(this).inflate(R.layout.time_picker_dialog, null);

        // Initialize the DatePicker
        DatePicker datePicker = dialogView.findViewById(R.id.datePicker);
        datePicker.init(currentYear, currentMonth, currentDay, null);

        TimePicker timePicker = dialogView.findViewById(R.id.timePicker);
        timePicker.setIs24HourView(false);

        // Create and show the custom dialog
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setView(dialogView);
        Button positiveButton = dialogView.findViewById(R.id.positiveButton);

        AlertDialog dialog = builder.create();
        dialog.show();

        positiveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Get selected date and time from the DatePicker and TimePicker
                int year = datePicker.getYear();
                int monthOfYear = datePicker.getMonth();
                int dayOfMonth = datePicker.getDayOfMonth();
                int hourOfDay = timePicker.getHour();
                int minute = timePicker.getMinute();

                mPlayBackTime.dwYear = year;
                mPlayBackTime.dwMonth = monthOfYear + 1; // Month starts from 0, so add 1
                mPlayBackTime.dwDay = dayOfMonth;
                mPlayBackTime.dwHour = hourOfDay;
                mPlayBackTime.dwMinute = minute;

                SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
                String formattedDateTime = String.format("%04d-%02d-%02d %02d:%02d",
                        mPlayBackTime.dwYear, mPlayBackTime.dwMonth, mPlayBackTime.dwDay,
                        mPlayBackTime.dwHour, mPlayBackTime.dwMinute);
                mPlayBackTimeTv.setText(formattedDateTime);
                dialog.dismiss();
            }
        });

    }

    private NET_TIME getEndTime () {
        NET_TIME time = new NET_TIME();
        time.dwYear = mPlayBackTime.dwYear;
        time.dwMonth = mPlayBackTime.dwMonth;
        time.dwDay = mPlayBackTime.dwDay;
        time.dwHour = 23;
        time.dwMinute = 59;
        time.dwSecond = 59;
        return time;
    }

    private void playBack (PlayBackModule playBackModule, int Channel) {
        if (!isPlaying) {
            NET_TIME start = mPlayBackTime;
            if (start == null) {
                Log.d("playBack", "Failed to retrieve playback date");
            }
            NET_TIME end = getEndTime();
            setPlayStatus(true);
            playBackModule.startPlayBack(Channel, StreamType, 0, start, end, new PlayBackTaskDone(playBackModule,-1));
        } else {
            stopPlayBack(playBackModule);
        }
    }

    private class PlayBackTaskDone implements PlayBackModule.OnPlayBackTaskDone {
        private PlayBackModule playBackModule;
        private int progress = 0;

        public PlayBackTaskDone(PlayBackModule playBackModule, int progress) {
            this.playBackModule = playBackModule;
            this.progress = progress;
        }

        @Override
        public void onTaskDone( boolean result) {
            if (!result) {
                if (playBackModule.isNoRecord()) {

                } else {

                }
                if (progress != -1) {
                }
            } else {
                setPlayStatus(true);
            }
        }
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

    private void stopPlayBack (PlayBackModule playBackModule) {
        //  mPlayBackModule.stopPlayBack();
        playBackModule.stopPlayBack();
        setPlayStatus(false);

        mHandler.post(new Runnable() {
            @Override
            public void run() {
//                  mCurrentOSDTime.setText("");
            }
        });
    }

    @Override
    protected void onPause() {
        super.onPause();
        onBackPressed();         // 뒤로 가기 동작 수행
        finish();                // 액티비티 종료
    }
}