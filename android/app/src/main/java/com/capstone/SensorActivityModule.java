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

public class SensorActivityModule extends ReactContextBaseJavaModule implements SensorEventListener {

    public static final String NAME = "SensorActivityModule";
    private SensorManager mSensorManager;
    private Sensor mAccelerometer;
    private Sensor mGyroscope;
    private Sensor mMagnetometer;
    private final ReactApplicationContext mReactContext;

    private float[] mGravity = new float[3];
    private float[] mGyroscopic = new float[3];
    private float[] mGeomagnetic = new float[3];
    private float[] mOrientation = new float[3];
    private float[] mRotationMatrix = new float[9];

    private float azimuth;
    private float pitch;
    private float roll;

    private long currentTimeStampAccel = 0;
    private long currentTimeStampGyro = 0;
    private long currentTimeStampMagnet = 0;

    public SensorActivityModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        mSensorManager = (SensorManager) mReactContext.getSystemService(mReactContext.SENSOR_SERVICE);

        mAccelerometer = mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        mGyroscope = mSensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE);
        mMagnetometer = mSensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);
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
                        .emit("SensorActivityModule", params);
            }
        } catch (RuntimeException e) {
            Log.e("ERROR", "error in sending event");
        }
    }

    @ReactMethod
    public void startSensors() {
        if (mAccelerometer != null) {
            mSensorManager.registerListener(this, mAccelerometer, 1000000);
        }

        if (mGyroscope != null) {
            // mSensorManager.registerListener(this, mGyroscope,
            // SensorManager.SENSOR_DELAY_NORMAL);
            mSensorManager.registerListener(this, mGyroscope, 1000000);
        }

        if (mMagnetometer != null) {
            mSensorManager.registerListener(this, mMagnetometer, 1000000);
        }
    }

    @ReactMethod
    public void stopSensors() {
        if (mAccelerometer != null || mGyroscope != null || mMagnetometer != null) {
            mSensorManager.unregisterListener(this);
        }
    }

    @Override
    public void onSensorChanged(SensorEvent event) {

        switch (event.sensor.getType()) {
            case Sensor.TYPE_ACCELEROMETER:
                if (event.timestamp - currentTimeStampAccel < Long.valueOf(1000000000)) {
                    return;
                }
                currentTimeStampAccel = event.timestamp;

                System.arraycopy(event.values, 0, mGravity, 0, 3);

                // sensorMap.putDouble("aX", event.values[0]);
                // sensorMap.putDouble("aY", event.values[1]);
                // sensorMap.putDouble("aZ", event.values[2]);

                break;

            case Sensor.TYPE_GYROSCOPE:
                if (event.timestamp - currentTimeStampGyro < Long.valueOf(1000000000)) {
                    return;
                }
                currentTimeStampGyro = event.timestamp;

                System.arraycopy(event.values, 0, mGyroscopic, 0, 3);

                // sensorMap.putDouble("gX", event.values[0]);
                // sensorMap.putDouble("gY", event.values[1]);
                // sensorMap.putDouble("gZ", event.values[2]);

                break;

            case Sensor.TYPE_MAGNETIC_FIELD:
                if (event.timestamp - currentTimeStampMagnet < Long.valueOf(1000000000)) {
                    return;
                }
                currentTimeStampMagnet = event.timestamp;

                System.arraycopy(event.values, 0, mGeomagnetic, 0, 3);

                // sensorMap.putDouble("mX", event.values[0]);
                // sensorMap.putDouble("mY", event.values[1]);
                // sensorMap.putDouble("mZ", event.values[2]);

                break;

        }

        WritableMap sensorMap = Arguments.createMap();

        // Compute the rotation matrix
        boolean success = SensorManager.getRotationMatrix(mRotationMatrix, null, mGravity, mGeomagnetic);

        if (success) {
            // Compute the orientation
            SensorManager.getOrientation(mRotationMatrix, mOrientation);

            float deltaT = 1.0f / 60.0f;
            azimuth += mGyroscopic[2] * deltaT;
            pitch -= mGyroscopic[1] * deltaT;
            roll += mGyroscopic[0] * deltaT;

            azimuth = (float) Math.toDegrees(mOrientation[0]) + azimuth;
            pitch = (float) Math.toDegrees(mOrientation[1]) + pitch;
            roll = (float) Math.toDegrees(mOrientation[2]) + roll;

            // Ensure the values stay within [0,360]
            azimuth = (azimuth + 360) % 360;
            pitch = (pitch + 360) % 360;
            roll = (roll + 360) % 360;

            // Log the orientation
            // Log.d("SensorActivity", "Azimuth: " + azimuth + " Pitch: " + pitch + " Roll:
            // " + roll);
            sensorMap.putDouble("azimuth", azimuth);
            sensorMap.putDouble("pitch", pitch);
            sensorMap.putDouble("roll", roll);
            sendEvent(sensorMap);
        }

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

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }

}
