package com.capstone;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class SensorEventModule extends ReactContextBaseJavaModule /*implements SensorEventListener*/ {

    //variables
    public static final String NAME = "SensorEventModule";
    private final SensorManager mSensorManager;
    private final Sensor mSensorLight;
    private final ReactApplicationContext mReactContext;

    //constructor
    public SensorEventModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        mSensorManager = (SensorManager) mReactContext.getSystemService(mReactContext.SENSOR_SERVICE);
        mSensorLight = mSensorManager.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    // static final float NS2S = 1.0f / 1000000000.0f;
    // float[] last_values = null;
    // float[] velocity = null;
    // float[] position = null;
    // long last_timestamp = 0;

    // private void sendEvent(@NonNull WritableMap params) {
    //     try {
    //         if (mReactContext != null) {
    //             mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
    //                     .emit("LightSensor", params);
    //         }
    //     } catch (RuntimeException e) {
    //         Log.d("ERROR", "error in sending event");
    //     }
    // }
    
    // @Override
    // public void onSensorChanged(SensorEvent event) {
    //     if(last_values != null){
    //         float dt = (event.timestamp - last_timestamp) * NS2S;
    
    //         for(int index = 0; index < 3;++index){
    //             velocity[index] += (event.values[index] + last_values[index])/2 * dt;
    //             position[index] += velocity[index] * dt;
    //         }
    //     }
    //     else{
    //         last_values = new float[3];
    //         velocity = new float[3];
    //         position = new float[3];
    //         velocity[0] = velocity[1] = velocity[2] = 0f;
    //         position[0] = position[1] = position[2] = 0f;
    //     }
    //     System.arraycopy(event.values, 0, last_values, 0, 3);
    //     last_timestamp = event.timestamp;
    // }

    @ReactMethod
    public void printTemp() {
        Log.i("SensorEventModule", "shitttttttttttttttttttttttttttttttttttttttttt1111111111111tttttttttttttttt");

        
        // System.out.println(7);
        return;
    }

    
}