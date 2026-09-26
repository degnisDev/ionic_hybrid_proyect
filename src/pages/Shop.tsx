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

// Estructura de datos de un producto
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

// Catalogo de productos locales con precios en pesos colombianos
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

// Pagina principal de la tienda
const Shop: React.FC = () => {
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>('');
  const [discountProduct, setDiscountProduct] = useState<Product | null>(null);

  // Consultamos la API externa para obtener el producto en descuento
  React.useEffect(() => {
    fetch('https://fakestoreapi.com/products/1')
      .then(res => res.json())
      .then(data => {
        setDiscountProduct({
          id: 999,
          title: data.title,
          price: Math.round(data.price * 4000),
          image: data.image
        });
      })
      .catch(err => console.error('Error al consultar la API', err));
  }, []);

  // Agregamos el producto seleccionado al carrito en almacenamiento local
  const addToCart = async (product: Product) => {
    const { value } = await Preferences.get({ key: CART_KEY });
    const cart: Product[] = value ? JSON.parse(value) : [];
    cart.push(product);
    await Preferences.set({ key: CART_KEY, value: JSON.stringify(cart) });
    setToastMsg(product.title + ' agregado al carrito');
    setShowToast(true);
    window.dispatchEvent(new Event('cart_updated'));
  };

  // Formateamos el precio en pesos colombianos
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

        {/* Producto en descuento obtenido desde la API */}
        {discountProduct && (
          <IonCard style={{ border: '2px solid var(--ion-color-secondary)' }}>
            <IonCardHeader style={{ paddingBottom: '0' }}>
              <IonCardTitle style={{ color: 'var(--ion-color-secondary)', fontSize: '15px', fontWeight: 'bold', textAlign: 'center' }}>
                PRODUCTO CON DESCUENTO !!!
              </IonCardTitle>
            </IonCardHeader>
            <IonImg
              src={discountProduct.image}
              style={{ width: '100%', height: '180px', objectFit: 'contain', padding: '10px' }}
            />
            <IonCardContent style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '5px' }}>{discountProduct.title}</h3>
              <p style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: 'var(--ion-color-danger)' }}>
                {formatPrice(discountProduct.price)}
              </p>
              <IonButton color="secondary" expand="block" onClick={() => addToCart(discountProduct)}>
                Agregar Promocion
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        <h3 style={{ marginLeft: '10px', marginTop: '20px' }}>Catalogo</h3>
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
