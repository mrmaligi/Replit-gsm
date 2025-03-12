import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './components/Header';

export default function Step1Page() {
  const router = useRouter();
  const [unitNumber, setUnitNumber] = useState('');
  const [password, setPassword] = useState('1234');
  const [adminNumber, setAdminNumber] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedUnitNumber = await AsyncStorage.getItem('unitNumber');
      const savedPassword = await AsyncStorage.getItem('password');
      const savedAdminNumber = await AsyncStorage.getItem('adminNumber');

      if (savedUnitNumber) setUnitNumber(savedUnitNumber);
      if (savedPassword) setPassword(savedPassword);
      if (savedAdminNumber) setAdminNumber(savedAdminNumber);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveToLocalStorage = async () => {
    try {
      await AsyncStorage.setItem('adminNumber', adminNumber);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // SMS Commands
  const sendSMS = (command) => {
    if (!unitNumber) {
      alert('Please set the unit telephone number in settings first');
      return;
    }

    // Force different approach based on platform
    if (Platform.OS === 'android') {
      // Direct intent on Android
      Linking.openURL(`sms:${unitNumber}?body=${encodeURIComponent(command)}`)
        .catch(err => {
          console.error('SMS sending error:', err);
          alert('Error sending SMS. Please make sure SMS app is installed.');
        });
    } else {
      // iOS handling with clipboard fallback
      Linking.openURL(`sms:${unitNumber}`)
        .then(async () => {
          try {
            // iOS needs manual pasting, so copy to clipboard
            await Clipboard.setStringAsync(command);
            alert('Please paste the command in the SMS app');
          } catch (err) {
            console.error('Clipboard error:', err);
            alert('Error copying to clipboard. Please manually type the command.');
          }
        })
        .catch(err => {
          console.error('SMS sending error:', err);
          alert('Error sending SMS. Please make sure SMS app is installed.');
        });
    }
  };

  // Register Admin Number
  const registerAdmin = () => {
    if (!adminNumber) {
      alert('Please enter an admin phone number');
      return;
    }
    sendSMS(`${password}TEL00${adminNumber}#`);
    saveToLocalStorage();
  };

  return (
    <View style={styles.container}>
      <Header title="Step 1: Register Admin" showBack backTo="/setup" />
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Register Admin Number</Text>
          <Text style={styles.cardSubtitle}>
            We have to register the Admin number to the relay. This number will have full control over the device.
          </Text>

          <Text style={styles.inputLabel}>Admin Phone Number</Text>
          <TextInput
            style={styles.input}
            value={adminNumber}
            onChangeText={setAdminNumber}
            placeholder="Example: 0469843459"
            keyboardType="phone-pad"
          />
          <Text style={styles.inputHint}>Format: Your country code + phone number</Text>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={registerAdmin}
          >
            <Text style={styles.primaryButtonText}>Send Registration SMS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  inputHint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#00bfff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
});
