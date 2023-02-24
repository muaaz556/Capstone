package com.capstone;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.util.Log;

import androidx.annotation.NonNull;
import java.text.DecimalFormat;
import java.text.NumberFormat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;


// THIS IS USING TYPE_GYROSCOPE: https://developer.android.com/guide/topics/sensors/sensors_motion
public class GyroscopeSensorModule extends ReactContextBaseJavaModule implements SensorEventListener {

    //variables
    public static final String NAME = "GyroscopeSensorModule";
    private final SensorManager mSensorManager;
    private final Sensor mSensorGyroscope;
    private final ReactApplicationContext mReactContext;

    //constructor
    public GyroscopeSensorModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        mSensorManager = (SensorManager) mReactContext.getSystemService(mReactContext.SENSOR_SERVICE);
        //Here is where you set the type of sensor 
        mSensorGyroscope = mSensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    private void sendEvent(@NonNull WritableMap params) {
        try {
            if (mReactContext != null) {
                mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("GyroscopeModule", params);
            }
        } catch (RuntimeException e) {
            Log.e("ERROR", "error in sending event");
        }
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        WritableMap sensorMap = Arguments.createMap();


        sensorMap.putDouble("rotationX", event.values[0]);

        sensorMap.putDouble("rotationY", event.values[1]);

        sensorMap.putDouble("rotationZ", event.values[2]);

        sendEvent(sensorMap);
    }

    @Override
    public final void onAccuracyChanged(Sensor sensor, int accuracy) {
    }

    @ReactMethod
    public void startGyroscopeSensor() {
        if (mSensorGyroscope == null) {
            return;
        }
        mSensorManager.registerListener(this, mSensorGyroscope, SensorManager.SENSOR_DELAY_NORMAL);
    }

    @ReactMethod
    public void stopGyroscopeSensor() {
        if (mSensorGyroscope == null) {
            return;
        }
        mSensorManager.unregisterListener(this);
    }

    @ReactMethod
    public String printTemp() {
        return "temp";
    }

    @ReactMethod
   public void addListener(String eventName) {
     // Keep: Required for RN built in Event Emitter Calls.
   }
   @ReactMethod
   public void removeListeners(Integer count) {
     // Keep: Required for RN built in Event Emitter Calls.
   }

}