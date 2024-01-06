package com.securecam;

import android.content.res.Resources;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import com.company.NetSDK.CB_fSearchDevicesCB;
import com.company.NetSDK.DEVICE_NET_INFO_EX;
import com.company.netsdk.module.DeviceSearchModule;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by 32940 on 2018/6/29.
 */
public class DeviceSearchActivity extends AppCompatActivity {
            private  boolean mSearchFlag = false;
            final Set<String> inforSet = new HashSet<String>();
            Resources res;
            private final int UPDATE_DEVICE_SEARCH_INFOR = 0x10;

            private ListView mInforLv;
            //    private Button mSearchDeviceBtn;
            private ImageView backButton;
            private ArrayList<String> items = new ArrayList<String>();
            private DeviceSearchModule mDeviceSearchModule;
            int nImgidx=0;


            Handler mHandler = new Handler(){
                @Override
                public void handleMessage(Message msg){
                    switch (msg.what){
                        case UPDATE_DEVICE_SEARCH_INFOR:   /// 장치 검색 결과가 목록에 표시됩니다.
                            Log.i("SearchDevMessage","infor:"+(String)msg.obj);
                            String szTmp = (String)msg.obj;
                            ((InforAdapter)mInforLv.getAdapter()).insertInfor((String)msg.obj);
                            break;
                        default:
                            break;
                    }
                }
            };

            private CB_fSearchDevicesCB callback = new  CB_fSearchDevicesCB(){

                @Override
                public void invoke(DEVICE_NET_INFO_EX device_net_info_ex) {
                    String temp =  new String(device_net_info_ex.szDevName).trim() + "\n" +
                            "SN: " + new String(device_net_info_ex.szSerialNo).trim() + "\nIP: "+ new String(device_net_info_ex.szIP).trim();

//            String temp = "IP 주소 : " + new String(device_net_info_ex.szIP).trim() + "\n" +
//                    "장치 SN : " + new String(device_net_info_ex.szSerialNo).trim() + "\n" +
//                    "장치유형 : " + new String(device_net_info_ex.szDeviceType).trim() + ":" + device_net_info_ex.nPort + ":" + new String(device_net_info_ex.szDevName).trim();

                    ///Search Device，Filter repeated
                    ///기기 검색 기능, 중복 필터링
//            boolean aa = inforSet.contains(temp);
//            boolean bb = new String(device_net_info_ex.szIP).trim().contains("/");

                    if(!inforSet.contains(temp) && !new String(device_net_info_ex.szIP).trim().contains("/")){
                        inforSet.add(temp);
                        Message msg1 = mHandler.obtainMessage(UPDATE_DEVICE_SEARCH_INFOR);
                        msg1.obj = temp;
                        mHandler.sendMessage(msg1);
                    }

                }
            };

            @Override
            protected void onCreate(Bundle savedInstanceState) {
                super.onCreate(savedInstanceState);
                setContentView(R.layout.activity_devicesearch);
                setTitle("장치검색");

                res = this.getResources();
                mDeviceSearchModule = new DeviceSearchModule(this);

                // 리턴키추가
                ActionBar actionBar = getSupportActionBar();
                if(actionBar != null) {
                    actionBar.setHomeButtonEnabled(false);
                    actionBar.setDisplayHomeAsUpEnabled(true);
                }

                mInforLv = (ListView)findViewById(R.id.device_search_list);
                mInforLv.setAdapter(new InforAdapter());

//        mSearchDeviceBtn = (Button)findViewById(R.id.device_search_button);
//        mSearchDeviceBtn.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                if(!mSearchFlag) {
                    ((InforAdapter)mInforLv.getAdapter()).clean();
                    inforSet.clear();
                    mDeviceSearchModule.startSearchDevices(callback);

//                    mSearchDeviceBtn.setText("장치검색 정지");
//                    mSearchFlag = true;
//                }
//                else {
//                    mDeviceSearchModule.stopSearchDevices();
//                    mSearchDeviceBtn.setText("장치검색 시작");
//                    mSearchFlag = false;
//                    nImgidx = 0;
//                }
//            }
//        });

//        setupView();


        backButton = findViewById(R.id.back_button);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });

        ListView listview = (ListView) findViewById(R.id.device_search_list);
        final InforAdapter adapter = new InforAdapter();

        adapter.insertInfor("NVR\nSN:8K0B6F8PAZ48BD2\nIP:192.168.0.253");


        listview.setOnItemClickListener(new AdapterView.OnItemClickListener() {

            @Override
            public void onItemClick(AdapterView<?> arg0, View v, int position,
                                    long id) {
                String tmp = (String) adapter.getItem(position);



                return;
            }
        });

        listview.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {

            @Override
            public boolean onItemLongClick(AdapterView<?> arg0, View arg1,
                                           int position, long arg3) {
                String tmp = (String) adapter.getItem(position).toString();
                return true;
            }

        });

    }

//    private void setupView(){
//        mInforLv = (ListView)findViewById(R.id.device_search_list);
//        mInforLv.setAdapter(new InforAdapter());
//
//        mSearchDeviceBtn = (Button)findViewById(R.id.device_search_button);
//        mSearchDeviceBtn.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                if(!mSearchFlag) {
//                    ((InforAdapter)mInforLv.getAdapter()).clean();
//                    inforSet.clear();
//                    mDeviceSearchModule.startSearchDevices(callback);
//                    mSearchDeviceBtn.setText("장치검색 정지");
//                    mSearchFlag = true;
//                } else {
//                    mDeviceSearchModule.stopSearchDevices();
//                    mSearchDeviceBtn.setText("장치검색 시작");
//                    mSearchFlag = false;
//                    nImgidx = 0;
//                }
//            }
//        });
//    }

    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return super.onSupportNavigateUp();
    }

    private class InforAdapter extends BaseAdapter {
//        private ArrayList<String> items = new ArrayList<String>();
        private LayoutInflater layoutInflater;
//        private List items=new ArrayList<>();

        public InforAdapter(){
            if (items == null)
                items = new ArrayList<String>();
        }
        public void insertInfor(String  i){
            String[] szDevInfo = i.split("\n");
            if (szDevInfo[0].equals(""))  // Device Name이 없는 경우
                return;

            for(int idx = 0; idx < items.size(); idx ++) {
                String[] szTmp = items.get(idx).split("\n");
                if (szTmp[1].equals(szDevInfo[1]))  // 중복 검색(SN 비교)
                    return;
            }
            items.add(i);
            this.notifyDataSetChanged();
            mInforLv.setSelection(items.size()-1);
            nImgidx = items.size()-1;
        }
        public void clean(){
            items.clear();
            this.notifyDataSetChanged();
        }
        @Override
        public int getCount() {
            return items.size();
        }

        @Override
        public Object getItem(int position) {
//            String[] szTmp = this.items.get(position).split("\n");
            String szTmp = items.get(position);
            return szTmp;
        }

        @Override
        public long getItemId(int position) {
            return 0;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            LayoutInflater inflater=LayoutInflater.from(parent.getContext());
            //메모리에 아이템 하나 인플레이팅
            View itemView=inflater.inflate(R.layout.list_item,parent,false);
            //뷰 찾기
            TextView deviceView=itemView.findViewById(R.id.text);
            ImageView imageView=itemView.findViewById(R.id.img);
            //뷰 교체

            int nSz = items.size();
            deviceView.setText(items.get(nImgidx));
//            ImageView image = (ImageView) findViewById(R.id.img);
//            image.setImageResource(R.drawable.android);


            imageView.setImageResource(R.drawable.ic_device);

            return itemView;


//            if(temp == null) {
//                temp = new TextView(DeviceSearchActivity.this);
//                AbsListView.LayoutParams params = new AbsListView.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
//                temp.setLayoutParams(params);
//                temp.setTextColor(Color.BLACK);
//            }
//            temp.setText(items.get(position));
//            return temp;
        }
    };

    @Override
    protected void onDestroy(){
        ((InforAdapter)mInforLv.getAdapter()).clean();
        inforSet.clear();
        mDeviceSearchModule.stopSearchDevices();
        mDeviceSearchModule = null;
        nImgidx = 0;
        super.onDestroy();
    }
}
