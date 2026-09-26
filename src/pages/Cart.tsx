import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonImg,
  IonIcon,
  IonToast,
  useIonViewWillEnter
} from '@ionic/react';
import { trash } from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';

const CART_KEY = 'myapol_cart';

// Estructura de datos de un producto en el carrito
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

// Pagina del carrito de compras
const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>('');

  // Cargamos el carrito al iniciar y nos suscribimos a actualizaciones en tiempo real
  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };
    window.addEventListener('cart_updated', handleCartUpdate);

    return () => {
      window.removeEventListener('cart_updated', handleCartUpdate);
    };
  }, []);

  // Recargamos los datos cada vez que el usuario vuelve a esta pestana
  useIonViewWillEnter(() => {
    loadCart();
  });

  // Obtenemos los productos guardados en el almacenamiento local
  const loadCart = async () => {
    const { value } = await Preferences.get({ key: CART_KEY });
    if (value) {
      setCartItems(JSON.parse(value));
    } else {
      setCartItems([]);
    }
  };

  // Eliminamos un producto del carrito por su posicion
  const removeItem = async (index: number) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
    await Preferences.set({ key: CART_KEY, value: JSON.stringify(updated) });
  };

  // Vaciamos todo el carrito
  const clearCart = async () => {
    setCartItems([]);
    await Preferences.remove({ key: CART_KEY });
    setToastMsg('Carrito vaciado');
    setShowToast(true);
  };

  // Sumamos los precios de todos los productos para obtener el total
  const getTotal = () => {
    const sum = cartItems.reduce((acc, item) => acc + item.price, 0);
    return formatPrice(sum);
  };

  // Formateamos el precio en pesos colombianos
  const formatPrice = (price: number) => {
    return '$ ' + price.toLocaleString('es-CO');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Carrito</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--ion-color-step-600)' }}>
            <p>El carrito esta vacio.</p>
            <p>Agrega productos desde la tienda.</p>
          </div>
        ) : (
          <>
            <IonList>
              {cartItems.map((item, index) => (
                <IonItem key={index}>
                  <IonImg
                    src={item.image}
                    slot="start"
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', marginRight: '10px' }}
                  />
                  <IonLabel>
                    <h3 style={{ fontSize: '13px' }}>{item.title}</h3>
                    <p style={{ fontWeight: 'bold' }}>{formatPrice(item.price)}</p>
                  </IonLabel>
                  <IonButton fill="clear" color="danger" slot="end" onClick={() => removeItem(index)}>
                    <IonIcon icon={trash} />
                  </IonButton>
                </IonItem>
              ))}
            </IonList>

            <div style={{ padding: '15px', textAlign: 'center' }}>
              <h3>Total: {getTotal()}</h3>
              <IonButton expand="block" color="danger" onClick={clearCart}>
                Vaciar carrito
              </IonButton>
            </div>
          </>
        )}

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

export default Cart;
