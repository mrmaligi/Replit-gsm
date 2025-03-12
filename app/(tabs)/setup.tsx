
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, Users, Lock, Sliders } from 'lucide-react-native';

export default function SetupPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Setup</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>GSM Relay Setup Guide</Text>
          <Text style={styles.introText}>
            Follow these steps to configure your GSM relay unit for operation.
            Complete all steps for full functionality.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.stepCard}
          onPress={() => router.push('/step1')}
        >
          <View style={styles.stepIconContainer}>
            <Settings size={28} color="#00bfff" />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 1: Register Admin</Text>
            <Text style={styles.stepDescription}>
              Register your phone as admin to control the relay unit
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.stepCard}
          onPress={() => router.push('/step2')}
        >
          <View style={styles.stepIconContainer}>
            <Lock size={28} color="#00bfff" />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 2: Change Password</Text>
            <Text style={styles.stepDescription}>
              Change the default password for security
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.stepCard}
          onPress={() => router.push('/step3')}
        >
          <View style={styles.stepIconContainer}>
            <Users size={28} color="#00bfff" />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 3: Authorized Users</Text>
            <Text style={styles.stepDescription}>
              Add users who can control the relay
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.stepCard}
          onPress={() => router.push('/step4')}
        >
          <View style={styles.stepIconContainer}>
            <Sliders size={28} color="#00bfff" />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 4: Relay Settings</Text>
            <Text style={styles.stepDescription}>
              Configure relay behavior and access control
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.additionalCard}
          onPress={() => router.push('/authorized-users')}
        >
          <Text style={styles.additionalTitle}>Advanced User Management</Text>
          <Text style={styles.additionalDescription}>
            Add, modify, and remove authorized users directly
          </Text>
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
  introCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  introText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  stepCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e6f7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
  },
  additionalCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  additionalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  additionalDescription: {
    fontSize: 14,
    color: '#666',
  },
});
