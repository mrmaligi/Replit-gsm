
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsPage() {
  const router = useRouter();
  const [unitNumber, setUnitNumber] = useState('');
  const [unitName, setUnitName] = useState('');
  const [password, setPassword] = useState('1234');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedUnitNumber = await AsyncStorage.getItem('unitNumber');
      const savedUnitName = await AsyncStorage.getItem('unitName');
      const savedPassword = await AsyncStorage.getItem('password');

      if (savedUnitNumber) setUnitNumber(savedUnitNumber);
      if (savedUnitName) setUnitName(savedUnitName);
      if (savedPassword) setPassword(savedPassword);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveUnitSettings = async () => {
    if (!unitNumber) {
      Alert.alert('Error', 'Please enter the relay unit number');
      return;
    }

    try {
      await AsyncStorage.setItem('unitNumber', unitNumber);
      await AsyncStorage.setItem('unitName', unitName);
      await AsyncStorage.setItem('password', password);
      Alert.alert('Success', 'Unit settings saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Relay Unit Configuration</Text>
          <Text style={styles.cardSubtitle}>
            Enter the phone number and details for your GSM relay unit.
          </Text>

          <Text style={styles.inputLabel}>Unit Name (optional)</Text>
          <TextInput
            style={styles.input}
            value={unitName}
            onChangeText={setUnitName}
            placeholder="My Gate Relay"
          />

          <Text style={styles.inputLabel}>Unit Phone Number</Text>
          <TextInput
            style={styles.input}
            value={unitNumber}
            onChangeText={setUnitNumber}
            placeholder="Example: +1234567890"
            keyboardType="phone-pad"
          />
          <Text style={styles.inputHint}>Enter the full phone number with country code</Text>

          <Text style={styles.inputLabel}>Relay Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Default: 1234"
            keyboardType="number-pad"
            maxLength={4}
          />
          <Text style={styles.inputHint}>
            The default password is 1234 unless you've changed it
          </Text>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={saveUnitSettings}
          >
            <Text style={styles.primaryButtonText}>Save Settings</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Setup Wizard</Text>
        <Text style={styles.sectionSubtitle}>
          Use the step-by-step setup wizard to configure your GSM relay
        </Text>

        <TouchableOpacity 
          style={styles.navigationButton}
          onPress={() => router.push('/step1')}
        >
          <Text style={styles.navigationButtonText}>Step 1: Register Admin</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navigationButton}
          onPress={() => router.push('/step2')}
        >
          <Text style={styles.navigationButtonText}>Step 2: Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navigationButton}
          onPress={() => router.push('/step3')}
        >
          <Text style={styles.navigationButtonText}>Step 3: Authorized Users</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navigationButton}
          onPress={() => router.push('/step4')}
        >
          <Text style={styles.navigationButtonText}>Step 4: Relay Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
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
    marginBottom: 24,
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
  primaryButton: {
    backgroundColor: '#00bfff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  navigationButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  navigationButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
