package com.securecam;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Log;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.VideoView;

import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.FragmentActivity;

import com.company.PlaySDK.IPlaySDK;
import com.company.PlaySDK.IPlaySDKCallBack;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;

//public class Page_61100 extends AppCompatActivity {
public class Page_61100 extends FragmentActivity {
    private ImageView back_Button;
    private ImageView palypause_Button;
    private static Button play_Button;
    private static Button prev_Button;
    private static Button next_Button;
    private static TextView txt_view;
    private static TextView pic_date_view, pic_date_title_view;
    private static TextView video_len_view, video_len_title_view;
    private static int port =IPlaySDK.PLAYGetFreePort() ;
    private static boolean bPlay = false;
    private static boolean bPause = false;
    private static boolean bTouch = false;

    private static final int FLAG_RECORD_FILE_END = 2;
    private static ArrayList<String> list = new ArrayList<String>();
    //    private static final String TAG = FileBrowserActivity.class.getSimpleName();
    private static final String TAG = "Page_61100";
    VideoView videoView;
    int nPosition;
    ArrayList<String> mFilesPath;

    enum TYPE{
        PICTURE,
        VIDEO,
        UNKNOWN;
    }

    @SuppressLint({"MissingInflatedId", "WrongViewCast"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_page_61100);
        back_Button = findViewById(R.id.back_button);
        prev_Button = findViewById(R.id.prev_button);
        next_Button = findViewById(R.id.next_button);
        palypause_Button = findViewById(R.id.playPauseButton);
        final SurfaceView sv0 = (SurfaceView)findViewById(R.id.browser_video);

        Intent intent = getIntent();
        String position = intent.getData().getQueryParameter("position");
        nPosition = Integer.parseInt(position);
        mFilesPath = getFiles(this);

        if(nPosition == 0) {
            prev_Button.setEnabled(false);
            prev_Button.setCompoundDrawablesRelativeWithIntrinsicBounds(R.drawable.prev_gray, 0, 0, 0);
        }
        if(nPosition == mFilesPath.size()-1) {
            next_Button.setEnabled(false);
            next_Button.setCompoundDrawablesRelativeWithIntrinsicBounds(0, 0, R.drawable.next_gray, 0);
        }

        sv0.setOnTouchListener(new View.OnTouchListener(){
            public boolean onTouch(View v, MotionEvent event) {
                int status = event.getAction();
                if(status == MotionEvent.ACTION_DOWN) {
                    if(!bTouch) {
                        palypause_Button.setImageResource(R.drawable.pause);
                        palypause_Button.setVisibility(View.VISIBLE);
                        bTouch = !bTouch;
                    }
//                    else {
//                        palypause_Button.setVisibility(View.INVISIBLE);
//                        bTouch = !bTouch;
//                    }
                }
                return bTouch;
            }
        });

        back_Button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });

        palypause_Button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!bPause) {
                    IPlaySDK.PLAYPause(port, (short)1);
                    palypause_Button.setImageResource(R.drawable.play);
                    bPause = true;

                } else {
                    IPlaySDK.PLAYPause(port, (short)0);
                    palypause_Button.setImageResource(R.drawable.pause);
                    bPause = false;
                }
            }
        });

        prev_Button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                stopPlayback();
                if(nPosition > 0) {
                    nPosition--;
                }

                if(nPosition == 0) {
                    prev_Button.setEnabled(false);
                    prev_Button.setCompoundDrawablesRelativeWithIntrinsicBounds(R.drawable.prev_gray, 0, 0, 0);
                }
                next_Button.setEnabled(true);
                next_Button.setCompoundDrawablesRelativeWithIntrinsicBounds(0, 0, R.drawable.next, 0);

                try {
                    showFile();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        });

        next_Button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                stopPlayback();
                if(nPosition < mFilesPath.size()-1) {
                    nPosition++;
                }

                if(nPosition == mFilesPath.size()-1) {
                    next_Button.setEnabled(false);
                    next_Button.setCompoundDrawablesRelativeWithIntrinsicBounds(0, 0, R.drawable.next_gray, 0);
                }
                prev_Button.setEnabled(true);
                prev_Button.setCompoundDrawablesRelativeWithIntrinsicBounds(R.drawable.prev, 0, 0, 0);

                try {
                    showFile();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        });
//            FileBrowserActivity.showFile(this, Integer.parseInt(position), FileBrowserActivity.TYPE.VIDEO);
        try {
            showFile();
        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    public static ArrayList<String> getFiles(Activity activity) {
        File externalFilesDir = new File(activity.getExternalFilesDir(null).getAbsolutePath());

        if (externalFilesDir.exists() && externalFilesDir.isDirectory()) {
            File[] files1 = externalFilesDir.listFiles();
            list.clear();
            if (files1 != null) {
                for (File file : files1) {
                    if (!file.isDirectory()) {
                        // list.add(file.getName());
                        list.add(file.getAbsolutePath());
                    }
                }
                Collections.sort(list, Collections.reverseOrder());
            }
        }

        return list;
    }

    private static TYPE getFileType(String name){
        if (name == null || name.equals(""))
            return TYPE.UNKNOWN;
        String suffix = name.substring(name.lastIndexOf(".") + 1);
        if (suffix.equals("dav") || suffix.equals("mp4")) {
            return TYPE.VIDEO;
        }else if (suffix.equals("jpg") || suffix.equals("mpeg4")){
            return TYPE.PICTURE;
        }
        return TYPE.UNKNOWN;
    }

    public void  showFile() throws IOException, InterruptedException {
        final AlertDialog.Builder builder = new AlertDialog.Builder(this);
        String fileNm = mFilesPath.get(nPosition);
        TYPE fileType = getFileType(fileNm);
        String fn_only = fileNm.substring(fileNm.lastIndexOf("/") + 1);

        txt_view = findViewById(R.id.file_name);
//        txt_view.setTypeface(null, Typeface.BOLD);
        txt_view.setText(fn_only);
        txt_view.setLetterSpacing(-0.1f);

        pic_date_view = findViewById(R.id.pic_date);
        pic_date_title_view = findViewById(R.id.pic_date_title);
        video_len_view = findViewById(R.id.video_len);
        video_len_title_view = findViewById(R.id.video_len_title);



        Log.d(TAG,"showFile====================> "+ nPosition + ", " + fileNm);

        if (fileType == TYPE.PICTURE) {
            final SurfaceView sv1 = (SurfaceView)findViewById(R.id.browser_video);
            ImageView iv1 = findViewById(R.id.imageView);
            sv1.setVisibility(View.GONE);

            pic_date_title_view.setText("캡쳐일시 ");
            pic_date_view.setText(fn_only.substring(0,19));
            video_len_view.setText("");
            video_len_title_view.setText("");

            ImageView iv = findViewById(R.id.imageView);
            iv.setVisibility(View.VISIBLE);
            palypause_Button.setVisibility(View.INVISIBLE);

            Uri uri = Uri.parse(fileNm);
            iv.setImageURI(uri);

        }else if (fileType == TYPE.VIDEO){
//            final View view = LayoutInflater.from(activity).inflate(R.layout.activity_page_61100,null);
            final SurfaceView sv = (SurfaceView)findViewById(R.id.browser_video);
            pic_date_title_view.setText("녹화일시 ");
            pic_date_view.setText(fn_only.substring(0,19));

            ImageView iv = findViewById(R.id.imageView);
            iv.setVisibility(View.GONE);
            sv.setVisibility(View.VISIBLE);
            palypause_Button.setVisibility(View.INVISIBLE);
            bTouch = false;
            bPause = false;


//            if (IPlaySDK.PLAYOpenFile(port, fileNm) == 0) {
//                return;
//            } else {
//                int f_len1, f_len2, f_len3;
//                f_len1 = IPlaySDK.PLAYGetFileTime (port);
//
//                f_len2 = IPlaySDK.PLAYGetPlayedTime (port);
//
//                f_len3 = IPlaySDK.PLAYGetPlayedFrames  ( port);
//                // 결과를 출력하거나 활용할 수 있습니다.
//                Log.d(TAG,"Duration====================> "+ f_len1 + " sec");
//
//            }


            builder.setView(sv);
            builder.setOnDismissListener(new DialogInterface.OnDismissListener() {
                @Override
                public void onDismiss(DialogInterface dialog) {
                    stopPlayback();
                    palypause_Button.setVisibility(View.INVISIBLE);
                }
            });

            sv.getHolder().addCallback(new SurfaceHolder.Callback() {
                public void surfaceCreated(SurfaceHolder holder){
                    if(bPlay) {
                        IPlaySDK.PLAYSetDisplayRegion(port, 0, null, holder.getSurface(), 1);
                    }
                }

                public void surfaceChanged(SurfaceHolder holder, int format, int width,int height)	{

                }

                public void surfaceDestroyed(SurfaceHolder holder){
                    if(bPlay) {
                        IPlaySDK.PLAYSetDisplayRegion(port, 0, null, holder.getSurface(), 0);
                    }
                }

            });

            if (!bPlay) {
                bPlay = true;
                playBackEx(sv, fileNm);
            }
        }
    }

    private static void playBackEx(SurfaceView sv,final String file) throws InterruptedException {
        long userData = 0;
        if(IPlaySDK.PLAYSetFileEndCallBack(port,new IPlaySDKCallBack.fpFileEndCBFun(){
            @Override
            public void invoke(int i, long l) {
                Message msg = mHandler.obtainMessage(2);
                msg.what = FLAG_RECORD_FILE_END;
                mHandler.sendMessage(msg);
            }
        },userData) == 0){
            return;
        }

        if (IPlaySDK.PLAYOpenFile(port,file) == 0) {
            return;
        }

        if (IPlaySDK.PLAYSetDecodeThreadNum(port,4) == 0) {
            Log.i(TAG,"PLAYSetDecodeThreadNum failed"+IPlaySDK.PLAYGetLastError(port));
            Log.d("playBackEx", "PLAYSetDecodeThreadNum failed");
            return;
        }
        if (IPlaySDK.PLAYPlay(port,sv.getHolder().getSurface()) == 0) {
            Log.i(TAG,"PLAYPlay failed"+IPlaySDK.PLAYGetLastError(port));
            Log.d("playBackEx", "PLAYPlay failed");
            return;
        } else {
            Thread.sleep(50);
            Log.i(TAG,"IPlaySDK.PLAYPlay ======================> "+ file);
            int play_times = IPlaySDK.PLAYGetFileTime(101);
            String vlu1 = String.format("%3s", String.valueOf(play_times));

            long hours = play_times / 3600;
            long minutes = (play_times % 3600) / 60;
            long seconds = play_times % 60;

            String vlu2 = String.format("%02d시간 %02d분 %02d초", hours, minutes, seconds);


            video_len_view.setText(vlu2);
            video_len_title_view.setText("영상길이 ");
            Log.d(TAG,"비디오길이 ====================> "+ vlu2);
        }
    }

    private static Handler mHandler = new Handler(Looper.getMainLooper()){
        @Override
        public void handleMessage(Message msg){
            switch (msg.what){
                case FLAG_RECORD_FILE_END:
                    stopPlayback();
                    break;
                default:
                    break;
            }
        }
    };

    private static void stopPlayback(){
        IPlaySDK.PLAYRigisterDrawFun(port,0,null,0);
        IPlaySDK.PLAYStop(port);
        IPlaySDK.PLAYCloseFile(port);
        IPlaySDK.PLAYReleasePort(port);
        bPlay = false;
    }
}
