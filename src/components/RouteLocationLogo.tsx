import React from 'react';
import L from 'leaflet';
import busLogo from '../assets/autobus.png';

const RouteLocationLogo = L.icon({
  iconUrl: busLogo,
  iconRetinaUrl: busLogo,
  iconAnchor: undefined,
  shadowUrl: undefined,
  shadowSize: undefined,
  iconSize: [30, 30],
  className: 'leaftlet-venue-icon'
});

export default RouteLocationLogo;
