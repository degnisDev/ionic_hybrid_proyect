import React from 'react';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet
} from '@ionic/react';
import { Route, Navigate } from 'react-router-dom';
import { camera, storefront, cart } from 'ionicons/icons';
import Gallery from './Gallery';
import Shop from './Shop';
import Cart from './Cart';

// Componente de pestanas para navegar entre las secciones principales de la app
const Tabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route path="/tabs/gallery" element={<Gallery />} />
      <Route path="/tabs/shop" element={<Shop />} />
      <Route path="/tabs/cart" element={<Cart />} />
      <Route path="/tabs" element={<Navigate to="/tabs/gallery" replace />} />
    </IonRouterOutlet>
    <IonTabBar slot="bottom">
      <IonTabButton tab="shop" href="/tabs/shop">
        <IonIcon icon={storefront} />
        <IonLabel>Tienda</IonLabel>
      </IonTabButton>
      <IonTabButton tab="cart" href="/tabs/cart">
        <IonIcon icon={cart} />
        <IonLabel>Carrito</IonLabel>
      </IonTabButton>
      <IonTabButton tab="gallery" href="/tabs/gallery">
        <IonIcon icon={camera} />
        <IonLabel>Galeria</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default Tabs;
