package com.securecam;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import androidx.appcompat.app.AppCompatActivity;
import android.widget.TextView;
import android.widget.ImageView;
import android.widget.Button;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.widget.AdapterView;
import com.company.netsdk.module.EncodeModule;
import com.company.netsdk.common.ToolKits;
import com.company.NetSDK.NET_EM_CFG_OPERATE_TYPE;
import android.util.Log;

import android.content.SharedPreferences;   // JSH


public class Page_15100 extends AppCompatActivity {
    private ImageView backButton;
    private EncodeModule encodeModule;
    public static boolean Resolution = true ;
    private SharedPreferences appData;
    private Integer live_quality;
    private Integer record_quality;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_page_15100);
        backButton = findViewById(R.id.back_button);
        encodeModule = new EncodeModule(this);

        appData = getSharedPreferences("appData", MODE_PRIVATE);


        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });

        live_quality = appData.getInt("LIVE_QUALITY", 0);
        record_quality = appData.getInt("RECORD_QUALITY", 0);

        Spinner liveViewSpinner = findViewById(R.id.live_view_spinner);
        ArrayAdapter<CharSequence> liveViewAdapter = ArrayAdapter.createFromResource(this, R.array.quality_options, android.R.layout.simple_spinner_item);
        liveViewAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        liveViewSpinner.setAdapter(liveViewAdapter);

        liveViewSpinner.setSelection(live_quality);

        Spinner recordingVideoSpinner = findViewById(R.id.recording_video_spinner);
        ArrayAdapter<CharSequence> recordingVideoAdapter = ArrayAdapter.createFromResource(this, R.array.quality_options, android.R.layout.simple_spinner_item);
        recordingVideoAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        recordingVideoSpinner.setAdapter(recordingVideoAdapter);

        recordingVideoSpinner.setSelection(record_quality);

        liveViewSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String liveViewValue = liveViewSpinner.getSelectedItem().toString();
                liveViewResolve(liveViewValue, true);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                // Do nothing
            }
        });

        recordingVideoSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String recordingVideoValue = recordingVideoSpinner.getSelectedItem().toString();
                recordingVideoResolve(recordingVideoValue, true);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                // Do nothing
            }
        });
/*
        encodeModule.setSpinnerDataCallBack(new EncodeModule.SpinnerDataCallback() {
            liveViewSpinner.setText(liveViewValue.get(data.getInt(encodeModule.RESOLUTION_POS)));
        }
*/
    }


    private void liveViewResolve(String text, boolean isMainStream){

        SharedPreferences.Editor editor = appData.edit();

        if("고화질".equals(text)) {
//            Resolution = true;
            ToolKits.set_VideoQaulity(this, "1920*1080", 30, "1024");

            editor.putInt("LIVE_QUALITY", 0);
            editor.apply();

        }
        else if("저화질".equals(text)) {
//            Resolution = false;
            ToolKits.set_VideoQaulity(this, "1280*720", 5, "192");

            editor.putInt("LIVE_QUALITY", 1);
            editor.apply();
        }
    }

    private void recordingVideoResolve(String text, boolean isMainStream){
        SharedPreferences.Editor editor = appData.edit();
        if("고화질".equals(text)) {
//            Resolution = true;
            ToolKits.set_VideoQaulity(this, "1920*1080", 30, "1024");
            editor.putInt("RECORD_QUALITY", 0);
            editor.apply();
        }
        else if("저화질".equals(text)) {
//            Resolution = false;
            ToolKits.set_VideoQaulity(this, "1280*720", 5, "192");
            editor.putInt("RECORD_QUALITY", 1);
            editor.apply();
        }
    }

}

