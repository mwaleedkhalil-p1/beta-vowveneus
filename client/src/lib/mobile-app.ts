import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { PushNotifications } from '@capacitor/push-notifications';
import { Preferences } from '@capacitor/preferences';
import { SplashScreen } from '@capacitor/splash-screen';

export const isMobileApp = () => Capacitor.isNativePlatform();

export async function initializeApp() {
  if (!isMobileApp()) return;

  // Initialize SplashScreen
  await SplashScreen.hide();

  // Request camera permissions
  try {
    await Camera.requestPermissions();
  } catch (error) {
    console.error('Error requesting camera permissions:', error);
  }

  // Request geolocation permissions
  try {
    await Geolocation.requestPermissions();
  } catch (error) {
    console.error('Error requesting geolocation permissions:', error);
  }

  // Initialize push notifications
  try {
    await PushNotifications.requestPermissions();
    await PushNotifications.register();

    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success:', token.value);
      // Store the token for later use
      Preferences.set({ key: 'pushToken', value: token.value });
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration:', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received:', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed:', notification);
    });
  } catch (error) {
    console.error('Error initializing push notifications:', error);
  }
}

// Camera helper functions
export async function takePicture() {
  if (!isMobileApp()) return null;
  
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: 'uri'
    });
    return image;
  } catch (error) {
    console.error('Error taking picture:', error);
    return null;
  }
}

// Geolocation helper functions
export async function getCurrentLocation() {
  if (!isMobileApp()) return null;

  try {
    const position = await Geolocation.getCurrentPosition();
    return position;
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
}

// Storage helper functions
export const storage = {
  async set(key: string, value: any) {
    await Preferences.set({ key, value: JSON.stringify(value) });
  },
  async get(key: string) {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : null;
  },
  async remove(key: string) {
    await Preferences.remove({ key });
  },
  async clear() {
    await Preferences.clear();
  }
};