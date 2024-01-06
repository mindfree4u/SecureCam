package com.securecam;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import org.devio.rn.splashscreen.SplashScreen;
import com.company.netsdk.common.NetSDKLib;
import android.view.View;
import android.content.Intent;
import androidx.appcompat.app.AppCompatActivity;
import android.widget.Button;

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);       //splash 보이기
    super.onCreate(savedInstanceState);

    new Thread(new Runnable() {
      @Override
      public void run() {
        NetSDKLib.getInstance().init();
      }
    }).start();
    NetSDKLib.getInstance().TestopenLog();
    //setupView();

  }

  @Override
  protected void onDestroy() {
    // while exiting the application, please make sure to invoke cleanup.
    NetSDKLib.getInstance().cleanup();
    super.onDestroy();
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "SecureCam";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
            this,
            getMainComponentName(),
            // If you opted-in for the New Architecture, we enable the Fabric Renderer.
            DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
            // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
            DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
    );
  }
}
