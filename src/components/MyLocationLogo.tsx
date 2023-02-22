import L from 'leaflet';
import location from '../assets/mylocation.svg';

const MyLocationLogo = L.icon({
  iconUrl: location,
  iconRetinaUrl: location,
  iconAnchor: undefined,
  shadowUrl: undefined,
  shadowSize: undefined,
  iconSize: [35, 35],
  className: 'leaftlet-venue-icon'
});

export default MyLocationLogo;
