import * as Cesium from 'cesium';

/**
 * Camera presets for notable locations.
 * Phase 1 default: fly to Austin, TX on load.
 */
export const CAMERA_PRESETS = {
  austin: {
    destination: Cesium.Cartesian3.fromDegrees(-97.7431, 30.2672, 800),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-35),
      roll: 0.0,
    },
  },
  sf: {
    destination: Cesium.Cartesian3.fromDegrees(-122.4194, 37.7749, 1000),
    orientation: {
      heading: Cesium.Math.toRadians(30),
      pitch: Cesium.Math.toRadians(-30),
      roll: 0.0,
    },
  },
  nyc: {
    destination: Cesium.Cartesian3.fromDegrees(-73.9857, 40.7484, 1200),
    orientation: {
      heading: Cesium.Math.toRadians(-20),
      pitch: Cesium.Math.toRadians(-30),
      roll: 0.0,
    },
  },
};

/**
 * Fly the camera to a preset location with a smooth animation.
 */
export function flyToPreset(viewer, presetName, duration = 3.0) {
  const preset = CAMERA_PRESETS[presetName];
  if (!preset) return;

  viewer.camera.flyTo({
    destination: preset.destination,
    orientation: preset.orientation,
    duration,
    easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
  });
}

function cinematicFlyIn(viewer, lon, lat, heightM = 700) {
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(lon, lat, 25000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0.0,
    },
  });

  setTimeout(() => {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, heightM),
      orientation: {
        heading: Cesium.Math.toRadians(15),
        pitch: Cesium.Math.toRadians(-30),
        roll: 0.0,
      },
      duration: 4.0,
      easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
    });
  }, 500);
}

/**
 * Set camera to Austin on load with a cinematic fly-in.
 */
export function flyToAustin(viewer) {
  cinematicFlyIn(viewer, -97.7431, 30.2672);
}

/**
 * Set camera to central London — where the live TfL JamCams are.
 */
export function flyToLondon(viewer) {
  cinematicFlyIn(viewer, -0.1278, 51.5074);
}

/**
 * Set camera over Southend-on-Sea (A127 / Victoria Avenue corridor).
 */
export function flyToSouthend(viewer) {
  cinematicFlyIn(viewer, 0.7077, 51.5455, 1600);
}
