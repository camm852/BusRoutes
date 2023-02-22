import { LatLngLiteral } from 'leaflet';
import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import Map from '../components/Map';
import Spinner from '../components/Spinner/Spinner';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContex';
import { getRouteByHour } from '../utils/api';
import { TMarkerInformation } from '../vite-env';

const defaultStateMarkerInformation: TMarkerInformation = {
  state: false,
  busStopName: '',
  hour: '',
  lat: 0,
  lng: 0
};

export default function Home() {
  const [position, setPosition] = React.useState<LatLngLiteral>({ lat: 0, lng: 0 });
  const [marker, setMarker] = React.useState<TMarkerInformation>(defaultStateMarkerInformation);
  const [openToast, setOpenToast] = React.useState<boolean>(false);
  const [messageToast, setMessageToast] = React.useState<{ message: string; error: boolean }>({
    message: '',
    error: false
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const now = new Date();
  const hour = now.getHours().toString().padStart(2, '0')
  const nextHour = (hour==='23' ? '00' : (+hour+1).toString()) +':00';

  const sharePosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (myPosition: GeolocationPosition) => {
          setPosition({ lat: myPosition.coords.latitude, lng: myPosition.coords.longitude });
        },
        () => {
          setOpenToast(true);
          setMessageToast({
            message: 'Dale permisos al navegador',
            error: true
          });
          setPosition({ lat: 0, lng: 0 });
        }
      );
    } else {
      setOpenToast(true);
      setMessageToast({
        message: 'No soporta gps',
        error: true
      });
    }
  };

  const { isLoading, isError, data, error, isSuccess } = useQuery({
    queryKey: ['RouteByHour', nextHour],
    queryFn: () => getRouteByHour(nextHour)
  });

  React.useEffect(() => {
    if (isLoading || !isError) return;
    setOpenToast(true);
    setMessageToast({
      message: 'No hay rutas disponibles',
      error: true
    });
  }, [isError, error, isLoading]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Spinner big otherColor />
      </div>
    );
  }

  return (
    <>
      <div className="w-screen h-screen p-3 bg-gradient-to-br from-green-400 to-sky-300 z-10">
        <Map
          position={position}
          setMarkerInformation={setMarker}
          marker={marker}
          data={isSuccess ? data : null}
        />
      </div>

      {/* Hour */}
      <div className="absolute top-10 right-10 z-50 bg-gradient-to-br from-green-400 to-sky-300 p-2 rounded-lg">
        <p className="font-semibold text-sm sm:text-base text-white">
          Proximas rutas a las: {nextHour}
        </p>
      </div>

      {/* Modal click marker */}

      <div
        className={`fixed ${
          marker.state ? 'right-10' : '-right-full'
        }  top-24 w-52 h-36 lg:top-40 lg:w-60 md:h-52 p-1 bg-gradient-to-br  from-green-300 to-sky-300 rounded-lg duration-200`}
      >
        <button
          onClick={() => {
            setMarker(defaultStateMarkerInformation);
          }}
          className="float-right"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 bg-white opacity-90 rounded-full text-green-300"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="mt-1 px-2">
          <p className="text-sm md:text-normal">Pasa a las: {marker.hour}</p>
          <p className="text-sm md:text-normal"> Pasa por: {marker.busStopName}</p>
        </div>
      </div>

      {/* Button My location */}
      <div className="absolute right-10 bottom-28">
        <button
          className="p-3 rounded-full border border-gray-300 bg-gradient-to-br from-green-400 to-sky-300"
          onClick={() => {
            sharePosition();
            setMarker(defaultStateMarkerInformation);
          }}
        >
          <svg
            fill="#fff"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 297 297"
            xmlSpace="preserve"
            className="w-6 h-6"
          >
            <g>
              <path
                d="M218.542,65.321L42.861,135.612c-3.934,1.573-6.466,5.436-6.342,9.671c0.125,4.234,2.88,7.94,6.899,9.28l74.264,24.758
                l24.753,74.286c1.34,4.02,5.046,6.775,9.281,6.901c0.1,0.002,0.199,0.004,0.299,0.004c4.118,0,7.837-2.507,9.373-6.348
                l70.279-175.721c1.499-3.75,0.62-8.033-2.236-10.889C226.577,64.699,222.293,63.82,218.542,65.321z M152.878,221.068l-17.635-52.92
                c-1.004-3.015-3.37-5.382-6.385-6.386l-52.911-17.64L204.17,92.821L152.878,221.068z"
              />
              <path
                d="M148.5,0C66.653,0,0.067,66.616,0.067,148.499C0.067,230.383,66.653,297,148.5,297s148.433-66.617,148.433-148.501
                C296.933,66.616,230.347,0,148.5,0z M148.5,276.808c-70.712,0-128.24-57.56-128.24-128.309c0-70.748,57.528-128.307,128.24-128.307
                s128.24,57.559,128.24,128.307C276.74,219.248,219.212,276.808,148.5,276.808z"
              />
            </g>
          </svg>
        </button>
      </div>

      {/* Button Login */}
      <div className="absolute bottom-14 right-10">
        {!user.name ? (
          <button
            className="p-3 rounded-full border border-gray-300 bg-gradient-to-br from-green-400 to-sky-300 relative"
            onClick={() => {
              navigate('/login');
              // setActiveOptions(!activeOptions);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
          </button>
        ) : (
          <button
            className="p-3 rounded-full border border-gray-300 bg-gradient-to-br from-green-400 to-sky-300 relative"
            onClick={() => {
              navigate('/routes');
              // setActiveOptions(!activeOptions);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-white"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      <div
        className={`fixed  ${
          !openToast ? '-right-full' : 'right-8'
        } bottom-1 transition-all duration-150 ease-in-out z-50`}
      >
        {openToast && (
          <Toast
            openToast={openToast}
            setOpenToast={setOpenToast}
            error={messageToast.error}
            text={messageToast.message}
          />
        )}
      </div>
    </>
  );
}
