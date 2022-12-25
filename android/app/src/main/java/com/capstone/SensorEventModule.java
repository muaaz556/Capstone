package com.capstone;

import java.text.DecimalFormat;
import java.text.NumberFormat;

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
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;


public class SensorEventModule extends ReactContextBaseJavaModule implements SensorEventListener {

    //variables
    public static final String NAME = "SensorEventModule";
    private final SensorManager mSensorManager;
    private final Sensor mSensorAcceleration;
    private final ReactApplicationContext mReactContext;

    //constructor
    public SensorEventModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        mSensorManager = (SensorManager) mReactContext.getSystemService(mReactContext.SENSOR_SERVICE);
        mSensorAcceleration = mSensorManager.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    static final double NS2S = 1.0 / 1000000000.0;
    double[] last_values = null;
    double[] acceleration = null;
    double[] velocity = null;
    double[] position = null;
    long last_timestamp = 0;
    double scale = Math.pow(10, 2);

    private void sendEvent(@NonNull WritableMap params) {
        try {
            if (mReactContext != null) {
                mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("SensorModule", params);
            }
        } catch (RuntimeException e) {
            Log.e("ERROR", "error in sending event");
        }
    }
    
    @Override
    public void onSensorChanged(SensorEvent event) {


        if(last_values != null){
            double dt = (event.timestamp - last_timestamp) * NS2S;
    
            
            for(int index = 0; index < 3;++index){
                // acceleration[index] = (Math.round(event.values[index] * scale)) / scale;
                acceleration[index] = event.values[index];
                velocity[index] += (acceleration[index] + last_values[index])/2 * dt ;
                position[index] += velocity[index] * dt;
            }
            
            Log.i("SensorEventModule", "2");
        }
        else{
            last_values = new double[3];
            velocity = new double[3];
            position = new double[3];
            acceleration = new double[3];
            velocity[0] = velocity[1] = velocity[2] = 0;
            position[0] = position[1] = position[2] = 0;
        }
        // this is the issue (event.values is float[] I am guessing and its copying into double[])
        // System.arraycopy(event.values, 0, last_values, 0, 3);
        for (int i = 0; i < 3; i++) {
            last_values[i] = event.values[i];
        }
        last_timestamp = event.timestamp;

        WritableMap sensorMap = Arguments.createMap();
        
        // sensorMap.putDouble("positionsX", position[0]);
        // sensorMap.putDouble("velocityX", velocity[0]);
        sensorMap.putDouble("accelerationsX", acceleration[0]);

        // sensorMap.putDouble("positionsY", position[1]);
        // sensorMap.putDouble("velocityY", velocity[1]);
        sensorMap.putDouble("accelerationsY", acceleration[1]);

        // sensorMap.putDouble("positionsZ", position[2]);
        // sensorMap.putDouble("velocityZ", velocity[2]);
        sensorMap.putDouble("accelerationsZ", acceleration[2]);

        sendEvent(sensorMap);
    }

    @Override
    public final void onAccuracyChanged(Sensor sensor, int accuracy) {
    }

    @ReactMethod
    public void startAccelerationSensor() {
        if (mSensorAcceleration == null) {
            return;
        }
        mSensorManager.registerListener(this, mSensorAcceleration, SensorManager.SENSOR_DELAY_NORMAL);
    }

    @ReactMethod
    public void stopAccelerationSensor() {
        if (mSensorAcceleration == null) {
            return;
        }
        mSensorManager.unregisterListener(this);
    }

    
}