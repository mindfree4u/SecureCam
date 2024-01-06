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

//import com.securecam.FileBrowserActivity;
//import android.app.Activity;
import java.util.Collections;
import java.util.Map;
import java.util.ArrayList;
import java.io.File;

public class FileBrowserModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private Callback onItemClickCallback;

    public FileBrowserModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "FileBrowserModule";
    }

    @ReactMethod
    public void getFiles(final Promise promise) {
        ArrayList<String> files = new ArrayList<String>();
        File[] files1 = new File(reactContext.getExternalFilesDir(null).getAbsolutePath()).listFiles();

        if (files1 != null) {
            for (File file : files1) {
                if (!file.isDirectory()) {
                    files.add(file.getName());
                }
            }
            Collections.sort(files, Collections.reverseOrder());
        }

        WritableArray writableArray = Arguments.createArray();
        for (String file : files) {
            writableArray.pushString(file);
        }
        promise.resolve(writableArray);
    }


    @ReactMethod
    public void deleteFile(String filename, final Promise promise) {
        try {
            File directory = reactContext.getExternalFilesDir(null);
            File[] files = directory.listFiles();

            if (files != null) {
                for (File file : files) {
                    if (file.isFile() && file.getName().equals(filename)) {
                        if (file.delete()) {
                            promise.resolve("File deleted successfully");
                            return; // 파일 삭제 성공하면 함수 종료
                        }
                    }
                }
            }

            // 파일을 찾지 못한 경우 또는 삭제 실패한 경우
            promise.reject("DELETE_ERROR", "Failed to delete the file");
        } catch (Exception e) {
            promise.reject("DELETE_ERROR", e.getMessage());
        }
    }
}