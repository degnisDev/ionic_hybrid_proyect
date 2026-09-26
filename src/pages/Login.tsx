import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonToast,
  IonCard,
  IonCardContent
} from '@ionic/react';
import { Preferences } from '@capacitor/preferences';
import { useNavigate } from 'react-router-dom';

// Pagina de inicio de sesion
const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('degnisdev@gmail.com');
  const [password, setPassword] = useState<string>('12345');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const navigate = useNavigate();

  // Validamos las credenciales y guardamos el token en el almacenamiento local
  const handleLogin = async () => {
    try {
      if (email === 'degnisdev@gmail.com' && password === '12345') {
        await fetch('https://reqres.in/api/users?page=1');

        await Preferences.set({
          key: 'jwt_token',
          value: 'jwt-dummy-token-degnisdev-12345',
        });

        navigate('/tabs/gallery');
      } else {
        setToastMessage('Credenciales incorrectas');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Error de red al intentar iniciar sesion');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>myApol Gallery - Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
          <IonCard>
            <IonCardContent>
              <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Bienvenido</h2>

              <IonItem>
                <IonLabel position="floating">Correo electronico</IonLabel>
                <IonInput
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                  type="email"
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Contrasena</IonLabel>
                <IonInput
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                  type="password"
                />
              </IonItem>

              <IonButton expand="block" onClick={handleLogin} className="ion-margin-top">
                Ingresar
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
