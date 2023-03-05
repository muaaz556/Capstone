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

// THIS IS USING LINEAR ACCELERATION: https://developer.android.com/guide/topics/sensors/sensors_motion
public class AccelerometerSensorModule extends ReactContextBaseJavaModule implements SensorEventListener {

    // variables
    public static final String NAME = "AccelerometerSensorModule";
    private final SensorManager mSensorManager;
    private final Sensor mSensorAcceleration;
    private final ReactApplicationContext mReactContext;
    private long currentTimeStamp = 0;

    // constructor
    public AccelerometerSensorModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        mSensorManager = (SensorManager) mReactContext.getSystemService(mReactContext.SENSOR_SERVICE);
        // Here is where you set the type of sensor
        mSensorAcceleration = mSensorManager.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION);
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
                        .emit("AccelerometerModule", params);
            }
        } catch (RuntimeException e) {
            Log.e("ERROR", "error in sending event");
        }
    }

    @Override
    public void onSensorChanged(SensorEvent event) {

        if (event.timestamp - currentTimeStamp < Long.valueOf(1000000000)) {
            return;
        }
        currentTimeStamp = event.timestamp;

        double scale = Math.pow(10, 2);

        WritableMap sensorMap = Arguments.createMap();

        sensorMap.putDouble("x", event.values[0]);
        sensorMap.putDouble("y", event.values[1]);
        sensorMap.putDouble("z", event.values[2]);

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
        mSensorManager.registerListener(this, mSensorAcceleration, 1000000);
    }

    @ReactMethod
    public void stopAccelerationSensor() {
        if (mSensorAcceleration == null) {
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