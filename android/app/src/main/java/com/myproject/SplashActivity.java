package com.vanconcaptain;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import android.view.WindowManager;
import android.view.Window;


import android.os.Build;
import android.os.Bundle;
import android.view.View;


public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {

        try {
  //  Block of code to try
        super.onCreate(savedInstanceState);

        Intent intent = new Intent(this, MainActivity.class);

        // Pass along FCM messages/notifications etc.
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            intent.putExtras(extras);
        }
        startActivity(intent);
        finish();
}
catch(Exception e) {
  //  Block of code to handle errors
  System.out.println(e.getMessage());
}
    }
}