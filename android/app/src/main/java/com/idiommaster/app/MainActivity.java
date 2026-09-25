package com.idiommaster.app;

import android.os.Bundle;
import android.view.View;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // ดันเฉพาะขอบบนลงมาตามความสูงของ Status Bar จริง (24-32dp) เพื่อไม่ให้บังนาฬิกา
        // ขอบล่างปล่อยเป็น 0 เพื่อให้เต็มจอ กว้างขวาง ไม่อึดอัด ไม่เกิดแถบขาวด้านล่าง
        View decorView = getWindow().getDecorView();
        ViewCompat.setOnApplyWindowInsetsListener(decorView, (v, insets) -> {
            int statusBarHeight = insets.getInsets(WindowInsetsCompat.Type.statusBars()).top;
            v.setPadding(0, statusBarHeight, 0, 0);
            return insets;
        });
    }
}
