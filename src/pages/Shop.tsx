import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonToast
} from '@ionic/react';
import { Preferences } from '@capacitor/preferences';

const CART_KEY = 'myapol_cart';

// Definimos la interfaz para los productos locales
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

// Lista estatica de tus 10 productos con precios en COP
const LOCAL_PRODUCTS: Product[] = [
  { id: 1, title: 'Mouse Black', price: 45000, image: '/products/Mouse_black.jpeg' },
  { id: 2, title: 'Mouse Rosa', price: 48000, image: '/products/Mouse_rosa.jpeg' },
  { id: 3, title: 'Mug Dino', price: 25000, image: '/products/Mug_dino.jpeg' },
  { id: 4, title: 'Audifonos Inteligentes', price: 120000, image: '/products/audifonos_inteligentes.jpeg' },
  { id: 5, title: 'Audifonos Xiaomi', price: 85000, image: '/products/audifonos_xiaomi.jpeg' },
  { id: 6, title: 'Calculadora Casio', price: 65000, image: '/products/calculadora_casio.jpeg' },
  { id: 7, title: 'Gafas Rojas', price: 200000, image: '/products/gafas_rojas.jpeg' },
  { id: 8, title: 'Lampara Rosa', price: 55000, image: '/products/lamapara_rosa.jpeg' },
  { id: 9, title: 'Mouse Onikuma', price: 75000, image: '/products/mouse_onikuma.jpeg' },
  { id: 10, title: 'Speaker', price: 150000, image: '/products/speaker.jpeg' }
];

// Componente de la tienda donde se muestran los productos
const Shop: React.FC = () => {
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>('');

  // Agregamos un producto al carrito y lo guardamos en almacenamiento local
  const addToCart = async (product: Product) => {
    const { value } = await Preferences.get({ key: CART_KEY });
    const cart: Product[] = value ? JSON.parse(value) : [];
    cart.push(product);
    await Preferences.set({ key: CART_KEY, value: JSON.stringify(cart) });
    setToastMsg(product.title + ' agregado al carrito');
    setShowToast(true);
  };

  // Funcion para formatear el precio a pesos colombianos
  const formatPrice = (price: number) => {
    return '$ ' + price.toLocaleString('es-CO');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Tienda</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            {LOCAL_PRODUCTS.map((product) => (
              <IonCol size="6" key={product.id}>
                <IonCard>
                  <IonImg
                    src={product.image}
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                  />
                  <IonCardHeader>
                    <IonCardTitle style={{ fontSize: '13px' }}>
                      {product.title}
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>
                      {formatPrice(product.price)}
                    </p>
                    <IonButton expand="block" size="small" onClick={() => addToCart(product)}>
                      Agregar
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMsg}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Shop;
