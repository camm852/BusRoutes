import React from 'react';
import { LatLngLiteral } from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import MyLocationMarker from './MyLocationMarker';
import { IBusStop, IMapProps, IRoute } from '../vite-env';
import 'leaflet/dist/leaflet.css';
import RouteLocationLogo from './RouteLocationLogo';

export default function Map(props: IMapProps): JSX.Element {
  const { position, setMarkerInformation, marker, data } = props;

  function ChangeView({ center, zoom }: { center: LatLngLiteral; zoom: number }): null {
    const myMap = useMap();
    myMap.setView(center, zoom);
    return null;
  }


  if (position === undefined) return <div />;
  return (
    <MapContainer
      center={
        position.lat === 0
          ? !marker.state
            ? { lat: 4.149325989359928, lng: -73.62952112417426 }
            : { lat: marker.lat, lng: marker.lng }
          : marker.state
          ? { lat: marker.lat, lng: marker.lng }
          : position
      }
      zoom={position.lat === 0 ? (!marker.state ? 14 : 15) : marker.state ? 15 : 15}
      scrollWheelZoom
      style={{
        width: '100%',
        height: '100%',
        outline: 'none',
        borderRadius: '15px',
        zIndex: '0'
      }}
    >
      <ChangeView
        center={
          position.lat === 0
            ? !marker.state
              ? { lat: 4.149325989359928, lng: -73.62952112417426 }
              : { lat: marker.lat, lng: marker.lng }
            : marker.state
            ? { lat: marker.lat, lng: marker.lng }
            : position
        }
        zoom={position.lat === 0 ? (!marker.state ? 14 : 15) : marker.state ? 15 : 15}
      />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {position.lat !== 0 && <MyLocationMarker position={position} />}
      {data &&
        Array.isArray(data) &&
        data.length > 0 &&
        data.map((route: IRoute, i: number) =>
          route.busStops?.map((busStop) => (
            <Marker
              key={i}
              position={{ lat: busStop.lat, lng: busStop.lng }}
              icon={RouteLocationLogo}
              eventHandlers={{
                click: () =>
                  setMarkerInformation({
                    state: true,
                    busStopName: busStop.name,
                    hour: route.hour,
                    lat: busStop.lat,
                    lng: busStop.lng
                  })
              }}
            >
              {/* <Popup>{busStop.name}</Popup> */}
            </Marker>
          ))
        )}
      {/* {data &&
        typeof data === 'object' &&
        data.busStops.map((busStop: IBusStop, i: number) => (
          <Marker
            key={i}
            position={{ lat: busStop.lat, lng: busStop.lng }}
            icon={RouteLocationLogo}
            eventHandlers={{
              click: () =>
                setMarkerInformation({
                  state: true,
                  busStopName: busStop.name,
                  hour: data.hour,
                  lat: busStop.lat,
                  lng: busStop.lng
                })
            }}
          >
          </Marker>
        ))} */}
    </MapContainer>
  );
}

Map.defaultProps = {
  position: [0, 0]
};
