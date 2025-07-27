import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Simulación de autenticación
const AuthContext = React.createContext();

// Pantalla de Login
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = React.useContext(AuthContext);

  const handleLogin = () => {
    // Validación básica
    if (email && password) {
      // Determinar tipo de usuario basado en email
      let userType = 'paciente';
      if (email.includes('admin')) userType = 'admin';
      else if (email.includes('doctor')) userType = 'doctor';
      
      signIn({ email, userType });
    } else {
      Alert.alert('Error', 'Por favor ingresa email y contraseña');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asistencia Prehospitalaria</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Dashboard del Administrador
function AdminDashboard() {
  return (
    <View style={styles.dashboard}>
      <Text style={styles.welcomeText}>Panel de Administrador</Text>
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#FF6B6B' }]}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Emergencias Activas</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#4ECDC4' }]}>
          <Text style={styles.statNumber}>23</Text>
          <Text style={styles.statLabel}>Pacientes Total</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#45B7D1' }]}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Doctores Activos</Text>
        </View>
      </View>
    </View>
  );
}

// Dashboard del Doctor
function DoctorDashboard() {
  const [emergencias, setEmergencias] = useState([
    { id: 1, tipo: 'Cardiovascular', paciente: 'Juan Pérez', estado: 'Crítica' },
    { id: 2, tipo: 'Trauma', paciente: 'María González', estado: 'Estable' }
  ]);

  return (
    <View style={styles.dashboard}>
      <Text style={styles.welcomeText}>Panel Médico</Text>
      <TouchableOpacity style={styles.newEmergencyButton}>
        <Text style={styles.buttonText}>+ Nueva Emergencia</Text>
      </TouchableOpacity>
      
      <Text style={styles.sectionTitle}>Emergencias Activas</Text>
      {emergencias.map(emergencia => (
        <View key={emergencia.id} style={styles.emergencyCard}>
          <Text style={styles.emergencyType}>{emergencia.tipo}</Text>
          <Text style={styles.patientName}>{emergencia.paciente}</Text>
          <Text style={[styles.status, 
            emergencia.estado === 'Crítica' ? styles.critical : styles.stable]}>
            {emergencia.estado}
          </Text>
        </View>
      ))}
    </View>
  );
}

// Dashboard del Paciente
function PatientDashboard() {
  const pacienteData = {
    nombre: 'Juan Pérez',
    edad: 45,
    tipoSangre: 'O+',
    alergias: ['Penicilina', 'Mariscos'],
    medicamentos: ['Aspirina 100mg', 'Lisinopril 10mg']
  };

  return (
    <View style={styles.dashboard}>
      <Text style={styles.welcomeText}>Mi Información Médica</Text>
      
      <View style={styles.patientCard}>
        <Text style={styles.patientName}>{pacienteData.nombre}</Text>
        <Text style={styles.patientInfo}>Edad: {pacienteData.edad} años</Text>
        <Text style={styles.patientInfo}>Tipo de Sangre: {pacienteData.tipoSangre}</Text>
        
        <Text style={styles.sectionTitle}>Alergias:</Text>
        {pacienteData.alergias.map((alergia, index) => (
          <Text key={index} style={styles.allergyItem}>• {alergia}</Text>
        ))}
        
        <Text style={styles.sectionTitle}>Medicamentos:</Text>
        {pacienteData.medicamentos.map((medicamento, index) => (
          <Text key={index} style={styles.medicationItem}>• {medicamento}</Text>
        ))}
      </View>
    </View>
  );
}

// Navegación por tabs
function AppTabs({ userType }) {
  if (userType === 'admin') {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Dashboard') iconName = 'dashboard';
            else if (route.name === 'Usuarios') iconName = 'people';
            else if (route.name === 'Reportes') iconName = 'assessment';
            
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={AdminDashboard} />
        <Tab.Screen name="Usuarios" component={() => <Text>Gestión de Usuarios</Text>} />
        <Tab.Screen name="Reportes" component={() => <Text>Reportes y Estadísticas</Text>} />
      </Tab.Navigator>
    );
  } else if (userType === 'doctor') {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Dashboard') iconName = 'dashboard';
            else if (route.name === 'Pacientes') iconName = 'people';
            else if (route.name === 'Emergencias') iconName = 'local-hospital';
            
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={DoctorDashboard} />
        <Tab.Screen name="Pacientes" component={() => <Text>Lista de Pacientes</Text>} />
        <Tab.Screen name="Emergencias" component={() => <Text>Gestión de Emergencias</Text>} />
      </Tab.Navigator>
    );
  } else {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'MiInfo') iconName = 'person';
            else if (route.name === 'Historial') iconName = 'history';
            
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="MiInfo" component={PatientDashboard} />
        <Tab.Screen name="Historial" component={() => <Text>Historial Médico</Text>} />
      </Tab.Navigator>
    );
  }
}

// Componente principal
export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            userType: action.userType,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            userType: action.userType,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            userType: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      userType: null,
    }
  );

  React.useEffect(() => {
    // Simular verificación de token guardado
    const bootstrapAsync = async () => {
      let userToken = null;
      let userType = null;
      
      // Aquí verificarías si hay una sesión guardada
      dispatch({ type: 'RESTORE_TOKEN', token: userToken, userType: userType });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token', userType: data.userType });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token', userType: data.userType });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.userToken == null ? (
            <Stack.Screen 
              name="SignIn" 
              component={LoginScreen} 
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen 
              name="Home" 
              options={{ headerShown: false }}
            >
              {() => <AppTabs userType={state.userType} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 40,
  },
  form: {
    width: '100%',
    maxWidth: 300,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loginButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dashboard: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statCard: {
    width: '30%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
  newEmergencyButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    marginTop: 15,
  },
  emergencyCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  emergencyType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  critical: {
    color: '#e74c3c',
  },
  stable: {
    color: '#27ae60',
  },
  patientCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
  },
  patientInfo: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  allergyItem: {
    fontSize: 14,
    color: '#e74c3c',
    marginBottom: 3,
  },
  medicationItem: {
    fontSize: 14,
    color: '#27ae60',
    marginBottom: 3,
  },
});