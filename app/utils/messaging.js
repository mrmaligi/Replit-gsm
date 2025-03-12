
import * as SMS from 'expo-sms';
import * as Clipboard from 'expo-clipboard';
import { Linking, Platform, Alert } from 'react-native';

/**
 * Utility function to handle sending SMS across different platforms
 * @param {string} phoneNumber - The phone number to send SMS to
 * @param {string} message - The message content
 * @returns {Promise<void>}
 */
export const sendSMSCommand = async (phoneNumber, message) => {
  if (!phoneNumber) {
    Alert.alert('Error', 'No phone number specified');
    return;
  }

  if (!message) {
    Alert.alert('Error', 'No message content specified');
    return;
  }

  // First check if SMS is available using expo-sms
  const isAvailable = await SMS.isAvailableAsync();
  
  if (isAvailable) {
    // Use expo-sms if available
    try {
      const { result } = await SMS.sendSMSAsync([phoneNumber], message);
      if (result === 'sent') {
        console.log('SMS sent successfully');
      } else {
        console.log('SMS sending was canceled or failed');
      }
    } catch (error) {
      console.error('Error sending SMS with expo-sms:', error);
      fallbackSMSMethod(phoneNumber, message);
    }
  } else {
    // Fall back to Linking method
    fallbackSMSMethod(phoneNumber, message);
  }
};

/**
 * Fallback method using Linking API when expo-sms is not available
 * @param {string} phoneNumber 
 * @param {string} message 
 */
const fallbackSMSMethod = async (phoneNumber, message) => {
  // Create SMS URL based on platform
  const smsUrl = Platform.select({
    ios: `sms:${phoneNumber}`,
    android: `sms:${phoneNumber}?body=${encodeURIComponent(message)}`,
    default: `sms:${phoneNumber}?body=${encodeURIComponent(message)}`,
  });

  // For iOS, copy message to clipboard since we can't prefill
  if (Platform.OS === 'ios') {
    try {
      await Clipboard.setStringAsync(message);
      Alert.alert('Info', 'Command copied to clipboard. Please paste it in the SMS app.');
    } catch (err) {
      console.error('Clipboard error:', err);
    }
  }

  // Try to open SMS app
  try {
    const canOpen = await Linking.canOpenURL(smsUrl);
    if (!canOpen) {
      Alert.alert('Error', 'SMS is not available on this device');
      return;
    }
    await Linking.openURL(smsUrl);
  } catch (error) {
    console.error('Error opening SMS app:', error);
    Alert.alert('Error', 'Failed to open SMS app. Your device may not support sending SMS.');
  }
};

/**
 * Utility function to make a phone call
 * @param {string} phoneNumber - The phone number to call
 * @returns {Promise<void>}
 */
export const makePhoneCall = async (phoneNumber) => {
  if (!phoneNumber) {
    Alert.alert('Error', 'No phone number specified');
    return;
  }

  const telUrl = `tel:${phoneNumber}`;
  
  try {
    const canOpen = await Linking.canOpenURL(telUrl);
    if (!canOpen) {
      Alert.alert('Error', 'Phone calls are not available on this device');
      return;
    }
    await Linking.openURL(telUrl);
  } catch (error) {
    console.error('Error making phone call:', error);
    Alert.alert('Error', 'Failed to initiate call. Your device may not support phone calls.');
  }
};
