package com.securecam;

import android.app.Dialog;
import android.app.Activity;
import android.os.Environment;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import com.company.PlaySDK.IPlaySDK;
import com.company.PlaySDK.IPlaySDKCallBack;
import com.securecam.R;
//import com.company.netsdk.common.ToolKits;

import android.util.Log;
import java.io.File;
import java.util.ArrayList;
import java.util.Collections;

/**
 * Created by 36141 on 2017/5/22.
 */
public class FileBrowserActivity extends AppCompatActivity implements AdapterView.OnItemClickListener{
    private static final String TAG = FileBrowserActivity.class.getSimpleName();
    private static final int FLAG_RECORD_FILE_END = 2;
    private static ArrayList<String> mFilesPath = new ArrayList<String>();
    private static ArrayList<String> list = new ArrayList<String>();
    ListView mFileList;
    private static int port =IPlaySDK.PLAYGetFreePort() ;
    private static boolean bPlay = false;

    ///enumeration file tpes
    ///文件类型的枚举
    enum TYPE{
        PICTURE,
        VIDEO,
        UNKNOWN;
    }

    @Override
    public void onCreate(Bundle savedInstance){
        super.onCreate(savedInstance);
        setContentView(R.layout.activity_file_browser);
        // setTitle(R.string.function_list_files_browser);

        // 添加返回键
        //  androidx.appcompat.app.ActionBar actionBar = getSupportActionBar();
        //  if(actionBar != null) {
        //      actionBar.setHomeButtonEnabled(false);
        //      actionBar.setDisplayHomeAsUpEnabled(true);

        //     setupView();
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

    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        TextView tv = (TextView)view.findViewById(R.id.line1);
        String filename = tv.getText().toString();
        //  showFile(position,getFileType(filename));
    }


    ///determine the file tpe
    ///判断文件类型
    public static TYPE getFileType(String name){
        if (name == null || name.equals(""))
            return TYPE.UNKNOWN;
//        String suffix = name.substring(name.indexOf(".")+1,name.length());
        String suffix = name.substring(name.lastIndexOf(".") + 1);
        Log.d("FileBrowserActivity", "getFileType: " + name + "  " + suffix);
        if (suffix.equals("dav")){
            return TYPE.VIDEO;
        }else if (suffix.equals("jpg") || suffix.equals("mpeg4")){
            return TYPE.PICTURE;
        }
        return TYPE.UNKNOWN;
    }

    public static void  showFile(Activity activity, int position,TYPE fileType) {
        final AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        ArrayList<String> mFilesPath = FileBrowserActivity.getFiles(activity);
        Log.d("FileBrowserActivity(showFile)", position + " " + mFilesPath);
        Collections.sort(mFilesPath, Collections.reverseOrder());
        String fileNm = mFilesPath.get(position);
        fileType = getFileType(fileNm);

        if (fileType == TYPE.PICTURE) {
            Log.d("FileBrowserActivity", "파일타입: PICTURE: " + position + " " +fileNm);
            Bitmap bmp = BitmapFactory.decodeFile(fileNm);
            ImageView iv = new ImageView(activity);
            ViewGroup.LayoutParams layoutParams = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            iv.setLayoutParams(layoutParams);
            iv.setImageBitmap(bmp);
            iv.setScaleType(ImageView.ScaleType.CENTER);
            iv.setAdjustViewBounds(true);
            builder.setView(iv);
            Dialog dialog = builder.create();
            Window window = dialog.getWindow();
            WindowManager.LayoutParams params = window.getAttributes();
            params.dimAmount = 0f;
            window.setAttributes(params);
            dialog.show();


        }else if (fileType == TYPE.VIDEO){
            Log.d("FileBrowserActivity", "파일타입: VIDEO: " + position + " " + fileNm);
            final View view = LayoutInflater.from(activity).inflate(R.layout.browser_video_dialog,null);
            final SurfaceView sv = (SurfaceView)view.findViewById(R.id.browser_video);
            builder.setView(view);
            builder.setOnDismissListener(new DialogInterface.OnDismissListener() {
                @Override
                public void onDismiss(DialogInterface dialog) {
                    stopPlayback();
                }
            });
            Dialog dialog = builder.create();
            Window window = dialog.getWindow();
            WindowManager.LayoutParams params = window.getAttributes();
            params.dimAmount = 0f;
            window.setAttributes(params);
            dialog.show();

            if (!bPlay) {
                bPlay = true;
                // 파일 재생
                playBackEx(sv, fileNm);
                Log.d("playBackEx(fileNm)", fileNm);
            }

            sv.getHolder().addCallback(new SurfaceHolder.Callback() {
                public void surfaceCreated(SurfaceHolder holder){
                    if(bPlay) {
                        IPlaySDK.PLAYSetDisplayRegion(port, 0, null, holder.getSurface(), 1);
                    }
                }

                public void surfaceChanged(SurfaceHolder holder, int format, int width,
                                           int height)	{
                }

                public void surfaceDestroyed(SurfaceHolder holder){
                    if(bPlay) {
                        IPlaySDK.PLAYSetDisplayRegion(port, 0, null, holder.getSurface(), 0);
                    }
                }
            });
//            if (!bPlay) {
//                bPlay = true;
//
//                ArrayList<String> fileList = getFiles(activity);
//                Collections.sort(fileList, Collections.reverseOrder());
//
//                if (fileList != null && fileList.size() > position) {
//               // if (fileList != null ) {
//                    String filePath = fileList.get(position); // 파일 경로 얻기
//                    Log.d("playBackEx", filePath);
//                    // 파일 재생
//                    playBackEx(sv, filePath);
//                } else {
//                    Log.d("playBackEx", "File not found");
//                }
//            }

        }

    }

    private static void playBackEx(SurfaceView sv,final String file){
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
        }
        if (IPlaySDK.PLAYPlaySound(port) == 0) {
            Log.i(TAG,"PLAYPlaySound failed"+IPlaySDK.PLAYGetLastError(port));
            Log.d("playBackEx", "PLAYPlaySound failed");
            return;
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
        IPlaySDK.PLAYStopSound();
        IPlaySDK.PLAYCleanScreen(port,0,0,0,1,0);
        IPlaySDK.PLAYStop(port);
        IPlaySDK.PLAYCloseFile(port);
        bPlay = false;
    }
}
