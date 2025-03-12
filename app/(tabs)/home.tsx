import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Controller from '../components/Controller';

export default function HomePage() {
  const [unitNumber, setUnitNumber] = useState('');
  const [unitName, setUnitName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedUnitNumber = await AsyncStorage.getItem('unitNumber');
      const savedUnitName = await AsyncStorage.getItem('unitName');

      if (savedUnitNumber) setUnitNumber(savedUnitNumber);
      if (savedUnitName) setUnitName(savedUnitName);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  if (!unitNumber) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Controller</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Relay Units Added</Text>
          <Text style={styles.emptyText}>
            Please go to Settings tab and add your relay unit details first.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Controller</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.unitInfo}>
          <Text style={styles.unitName}>{unitName || 'My Relay'}</Text>
          <Text style={styles.unitNumber}>{unitNumber}</Text>
        </View>

        <Controller 
          title="Activate Relay" 
          description="Press Call to trigger the relay with a call, or SMS to send a command."
        />

        <Controller 
          title="Momentary Activation" 
          description="Activate the relay for its preset latch time."
          commandPrefix="CC"
        />

        <Controller 
          title="Toggle Relay" 
          description="Turn the relay on or off, toggling its current state."
          commandPrefix="DD"
        />

        <Controller 
          title="Check Status" 
          description="Send a query to check the current status of the relay."
          commandPrefix="EE"
        />
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
  },
  unitInfo: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  unitName: {
    fontSize: 20,
    fontWeight: '600',
  },
  unitNumber: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});