import { LatLngLiteral } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import MyLocationLogo from './MyLocationLogo';

export default function MyLocationMarker(props: { position: LatLngLiteral }) {
  const { position } = props;
  if (position === undefined) return <div />;
  return (
    <Marker position={position} icon={MyLocationLogo}>
      <Popup>
        <p className="font-semibold">Ubicación Actual</p>
      </Popup>
    </Marker>
  );
}
