
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { Phone, MessageSquare } from 'lucide-react-native';

interface ControllerProps {
  title: string;
  description?: string;
  commandPrefix?: string;
}

const Controller: React.FC<ControllerProps> = ({ title, description, commandPrefix }) => {
  const [unitNumber, setUnitNumber] = useState('');
  const [password, setPassword] = useState('1234');

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

  // SMS handler
  const handleSendSMS = (command?: string) => {
    if (!unitNumber) {
      Alert.alert('Error', 'Please set the relay unit number in settings');
      return;
    }

    const smsCommand = command || `${password}CC`;
    
    const smsUrl = Platform.select({
      ios: `sms:${unitNumber}&body=${encodeURIComponent(smsCommand)}`,
      android: `sms:${unitNumber}?body=${encodeURIComponent(smsCommand)}`,
      default: `sms:${unitNumber}?body=${encodeURIComponent(smsCommand)}`,
    });
    
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

  // SMS handler
  const handleSendSMS = async (command) => {
    if (!unitNumber) {
      Alert.alert('Error', 'Please set the relay unit number in settings');
      return;
    }

    if (!command) {
      Alert.alert('Error', 'No command specified to send');
      return;
    }

    // Construct SMS URL based on platform
    const smsUrl = Platform.select({
      ios: `sms:${unitNumber}`,
      android: `sms:${unitNumber}?body=${encodeURIComponent(command)}`,
      default: `sms:${unitNumber}?body=${encodeURIComponent(command)}`,
    });

    // iOS workaround: Copy command to clipboard
    if (Platform.OS === 'ios') {
      try {
        await Clipboard.setStringAsync(command);
        Alert.alert('Info', 'Command copied to clipboard. Please paste it in the SMS app.');
      } catch (err) {
        console.error('Clipboard error:', err);
        Alert.alert('Error', 'Could not copy command to clipboard');
        return;
      }
    }

    // Check if SMS is available before opening
    Linking.canOpenURL(smsUrl)
      .then(supported => {
        if (!supported) {
          Alert.alert('Error', 'SMS is not available on this device');
          return;
        }
        return Linking.openURL(smsUrl);
      })
      .catch(err => {
        console.error('SMS sending error:', err);
        Alert.alert('Error', 'Failed to open SMS app');
      });
  };

  // Call handler
  const handleMakeCall = () => {
    if (!unitNumber) {
      Alert.alert('Error', 'Please set the relay unit number in settings');
      return;
    }

    Linking.canOpenURL(`tel:${unitNumber}`)
      .then(supported => {
        if (!supported) {
          Alert.alert('Error', 'Phone calls are not available on this device');
          return;
        }
        return Linking.openURL(`tel:${unitNumber}`);
      })
      .catch(err => {
        Alert.alert('Error', 'Unable to initiate call');
        console.error('An error occurred', err);
      });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {description && (
        <Text style={styles.cardSubtitle}>{description}</Text>
      )}

      <View style={styles.controlsRow}>
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={() => handleSendSMS(commandPrefix ? `${password}${commandPrefix}` : undefined)}
        >
          <MessageSquare size={24} color="#333" />
          <Text style={styles.buttonText}>Send SMS</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={handleMakeCall}
        >
          <Phone size={24} color="#333" />
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  controlButton: {
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    width: '45%',
  },
  buttonText: {
    marginTop: 8,
    fontWeight: '500',
  },
});

export default Controller;
