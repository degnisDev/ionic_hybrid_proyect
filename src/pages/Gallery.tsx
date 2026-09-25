import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonButton,
  IonButtons
} from '@ionic/react';
import { camera, logOut } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';
import { useNavigate } from 'react-router-dom';

const PHOTOS_PREF_KEY = 'myapol_photos';

// Creamos el componente de Galería para capturar fotografías y gestionarlas en la vista
const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadSavedPhotos();
  }, []);

  const loadSavedPhotos = async () => {
    // Leemos las imágenes guardadas en el almacenamiento local del dispositivo
    const { value } = await Preferences.get({ key: PHOTOS_PREF_KEY });
    if (value) {
      setPhotos(JSON.parse(value));
    }
  };

  const takePhoto = async () => {
    try {
      // Capturamos la foto utilizando la cámara nativa mediante Capacitor
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 100
      });

      if (photo.dataUrl) {
        const newPhotos = [photo.dataUrl, ...photos];
        setPhotos(newPhotos);

        // Guardamos la lista actualizada de fotos en el almacenamiento local
        await Preferences.set({
          key: PHOTOS_PREF_KEY,
          value: JSON.stringify(newPhotos)
        });
      }
    } catch (e) {
      console.error('Error al tomar foto o el usuario canceló', e);
    }
  };

  const handleLogout = async () => {
    await Preferences.remove({ key: 'jwt_token' });
    navigate('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Catálogo Fotográfico</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon icon={logOut} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

        {photos.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--ion-color-step-600)' }}>
            <p>No hay fotos en la galería.</p>
            <p>Presiona el botón para agregar productos.</p>
          </div>
        ) : (
          <IonGrid>
            <IonRow>
              {photos.map((photo, index) => (
                <IonCol size="6" key={index}>
                  <div style={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    backgroundColor: 'var(--ion-color-step-100)'
                  }}>
                    <IonImg src={photo} style={{ height: '150px', objectFit: 'cover' }} />
                  </div>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={takePhoto}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Gallery;
