import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { db, auth } from '../../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

export default function ProfileSetup({ navigation }: any) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Hombre');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateProfile = async () => {
    if (!name || !age || !country) {
      Alert.alert('Error', 'Por favor, rellena todos los campos obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: name,
        age: parseInt(age),
        gender: gender,
        country: country,
        createdAt: new Date()
      });

      setLoading(false);
      Alert.alert('¡Éxito!', 'Perfil creado correctamente.');
      
      if (navigation) {
        navigation.navigate('HomeScreen');
      }
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      Alert.alert('Error al guardar', error.message || 'Inténtalo de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear mi Perfil</Text>
      
      <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} placeholderTextColor="#aaa"/>
      <TextInput style={styles.input} placeholder="Edad" value={age} onChangeText={setAge} keyboardType="numeric" placeholderTextColor="#aaa"/>
      <TextInput style={styles.input} placeholder="País" value={country} onChangeText={setCountry} placeholderTextColor="#aaa"/>

      <TouchableOpacity style={styles.button} onPress={handleCreateProfile} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>→ Crear cuenta y guardar perfil</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, color: '#fff', marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  input: { backgroundColor: '#222', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
