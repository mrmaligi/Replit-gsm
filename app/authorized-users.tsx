import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Linking, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import Header from './components/Header';

export default function AuthorizedUsersPage() {
  const [unitNumber, setUnitNumber] = useState('');
  const [password, setPassword] = useState('1234');
  const [serialNumber, setSerialNumber] = useState('001');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedUnitNumber = await AsyncStorage.getItem('unitNumber');
      const savedPassword = await AsyncStorage.getItem('password');

      if (savedUnitNumber) setUnitNumber(savedUnitNumber);
      if (savedPassword) setPassword(savedPassword);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // SMS Commands with clipboard support for iOS
  const sendSMS = async (command) => {
    if (!unitNumber) {
      Alert.alert('Error', 'Please set the relay phone number in settings');
      return;
    }

    // Construct the SMS URL
    const smsUrl = Platform.select({
      ios: `sms:${unitNumber}`,
      android: `sms:${unitNumber}?body=${encodeURIComponent(command)}`,
      default: `sms:${unitNumber}?body=${encodeURIComponent(command)}`,
    });

    // iOS workaround: Copy command to clipboard
    if (Platform.OS === 'ios') {
      await Clipboard.setStringAsync(command);
      Alert.alert('Info', 'Command copied to clipboard. Please paste it in the SMS app.');
    }

    Linking.canOpenURL(smsUrl)
      .then(supported => {
        if (!supported) {
          Alert.alert('Error', 'SMS is not available on this device');
          return;
        }
        return Linking.openURL(smsUrl);
      })
      .catch(err => console.error('An error occurred', err));
  };

  // Add authorized user
  const addAuthorizedUser = () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    if (!serialNumber || !/^\d{3}$/.test(serialNumber)) {
      Alert.alert('Error', 'Serial number must be 3 digits (001-200)');
      return;
    }

    const serialNum = parseInt(serialNumber);
    if (serialNum < 1 || serialNum > 200) {
      Alert.alert('Error', 'Serial number must be between 001 and 200');
      return;
    }

    // Command format: passwordA[serialnumber]#[phonenumber]#
    sendSMS(`${password}A${serialNumber}#${phoneNumber}#`);
  };

  // Delete authorized user
  const deleteAuthorizedUser = () => {
    if (!serialNumber || !/^\d{3}$/.test(serialNumber)) {
      Alert.alert('Error', 'Serial number must be 3 digits (001-200)');
      return;
    }

    const serialNum = parseInt(serialNumber);
    if (serialNum < 1 || serialNum > 200) {
      Alert.alert('Error', 'Serial number must be between 001 and 200');
      return;
    }

    // Command format: passwordA[serialnumber]##
    sendSMS(`${password}A${serialNumber}##`);
  };

  // Delete all users
  const deleteAllUsers = () => {
    Alert.alert(
      'Confirm Delete All',
      'Are you sure you want to delete all authorized users? This cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete All',
          onPress: () => sendSMS(`${password}AR#`),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Authorized Users" showBack backTo="/setup" />
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add Authorized User</Text>
          <Text style={styles.cardSubtitle}>
            Add a phone number that will be authorized to control the relay unit.
          </Text>

          <Text style={styles.inputLabel}>Serial Number (001-200)</Text>
          <TextInput
            style={styles.input}
            value={serialNumber}
            onChangeText={(text) => {
              // Only allow 3 digits
              const filtered = text.replace(/[^0-9]/g, '').slice(0, 3);
              setSerialNumber(filtered.padStart(3, '0'));
            }}
            placeholder="001"
            keyboardType="number-pad"
            maxLength={3}
          />
          <Text style={styles.inputHint}>Position to store this user (001-200)</Text>

          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Example: 0469843459"
            keyboardType="phone-pad"
          />
          <Text style={styles.inputHint}>Enter without country code or special characters</Text>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={addAuthorizedUser}
          >
            <Text style={styles.primaryButtonText}>Add User</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.secondaryButton, styles.marginTop]}
            onPress={deleteAuthorizedUser}
          >
            <Text style={styles.secondaryButtonText}>Delete User at Position {serialNumber}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.dangerButton, styles.marginTop]}
            onPress={deleteAllUsers}
          >
            <Text style={styles.dangerButtonText}>Delete All Users</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Command Reference</Text>
          <Text style={styles.commandExample}>
            • <Text style={styles.codeText}>{password}A001#phoneNumber#</Text> - Add a user at position 001
          </Text>
          <Text style={styles.commandExample}>
            • <Text style={styles.codeText}>{password}A001##</Text> - Delete user at position 001
          </Text>
          <Text style={styles.commandExample}>
            • <Text style={styles.codeText}>{password}AR#</Text> - Delete all users
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: 'white',
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
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
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
  marginTop: {
    marginTop: 12,
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
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#00bfff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#00bfff',
    fontSize: 16,
    fontWeight: '500',
  },
  dangerButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ff3b30',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '500',
  },
  commandExample: {
    fontSize: 16,
    marginBottom: 8,
  },
  codeText: {
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 4,
  },
});