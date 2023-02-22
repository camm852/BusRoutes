import { LatLng, LatLngLiteral } from 'leaflet';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import Swal from 'sweetalert2';
import { newRoute, updateRoute } from '../utils/api';
import { IBusStop, IFormRoutesProps, IRoute } from '../vite-env';
import Spinner from './Spinner/Spinner';

const defaultStateForm: IRoute = {
  _id: 0,
  name: '',
  busStops: [],
  hour: ''
};

type TStateCoords = LatLngLiteral & {
  name: string;
};

const defaultStateCoords: IBusStop = {
  lat: 0,
  lng: 0,
  name: ''
};

export default function FormRoutes(props: IFormRoutesProps): JSX.Element {
  // const [mountCoords, setMountCoords] = React.useState<number>(0);
  const [coords, setCoords] = React.useState<IBusStop[]>([]);
  const [formNewRoute, setFormNewRoute] = React.useState<IRoute>(defaultStateForm);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<{
    name: boolean;
    hour: boolean;
    busStops:
      | {
          index: number;
          error: boolean;
        }[]
      | boolean;
  }>({
    name: false,
    hour: false,
    busStops: []
  });
  const { route, setOpenModal } = props;

  React.useEffect(() => {
    if (route === null) return;
    setFormNewRoute({
      _id: route?._id ?? 0,
      name: route?.name ?? '',
      hour: route?.hour ?? '',
      busStops: route?.busStops ?? []
    });
    setCoords(route.busStops);
  }, [route]);

  const queryClient = useQueryClient();

  const { mutate: newMutate } = useMutation(newRoute, {
    onSuccess: (data) => {
      Swal.fire('La ruta fue añadida', '', 'success');
      setOpenModal(false);
      setLoading(false);
      queryClient.invalidateQueries('AllRoutes');
    },
    onError: (data) => {
      Swal.fire('Ha ocurrido un error', '', 'error');
      setOpenModal(false);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries('AllRoutes');
    }
  });
  const { mutate: updateMutate } = useMutation(updateRoute, {
    onSuccess: (data) => {
      Swal.fire('Actualizada correctamente', '', 'success');
      setOpenModal(false);
      setLoading(false);
      queryClient.invalidateQueries('AllRoutes');
    },
    onError: (data) => {
      Swal.fire('Ha ocurrido un error', '', 'error');
      setOpenModal(false);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries('AllRoutes');
    }
  });

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormNewRoute({ ...formNewRoute, [e.target.name]: e.target.value });
  };
  const handleAddCoords = () => setCoords([...coords, { ...defaultStateCoords }]);
  const handleChageCoord = (indexElement: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = coords.map((coord: TStateCoords, index: number) => {
      if (index === indexElement) {
        if (e.target.name === 'latitud') {
          coord.lat = +e.target.value;
        } else if (e.target.name === 'longitud') {
          coord.lng = +e.target.value;
        } else {
          coord.name = e.target.value;
        }
      }
      return coord;
    });
    setCoords([...newData]);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!formNewRoute.hour.includes(':') && formNewRoute.hour.length === 2) {
      setFormNewRoute({ ...formNewRoute, hour: `${formNewRoute.hour}:00` });
    }
    if (!formNewRoute.hour.includes(':') && formNewRoute.hour.length === 1) {
      setFormNewRoute({ ...formNewRoute, hour: `0${formNewRoute.hour}:00` });
    }

    const errorsCoords = coords.map((coord, i) => {
      if (!coord.lat || !coord.lng || !coord.name) return { index: i, error: true };
      return { index: i, error: false };
    });

    const containError = errorsCoords.map((coord) => coord.error);

    const errors = {
      name: !formNewRoute.name ?? false,
      hour: !formNewRoute.hour ?? false,
      busStops: coords.length > 0 ? errorsCoords : true
    };

    if (Object.values(errors).includes(true) && typeof errors.busStops === 'boolean') {
      setFormError(errors);
      setLoading(false);
      return;
    }
    if (
      Object.values(errors).includes(true) &&
      typeof errors.busStops === 'object' &&
      containError.includes(true)
    ) {
      setFormError(errors);
      return;
    }
    // setFormNewRoute({ ...formNewRoute, busStops: [...coords] });
    const hour: string = formNewRoute.hour.split(':')[0];
    if (formNewRoute._id === 0) {
      newMutate({ ...formNewRoute, hour: `${hour}:00`, busStops: [...coords] });
    } else {
      updateMutate({ ...formNewRoute, hour: `${hour}:00`, busStops: [...coords] });
    }
  };
  // ,
  return (
    <div className="p-3">
      <h2 className="text-center text-2xl font-semibold">Formulario de adición y actualización</h2>
      <form className="p-2 mt-6" onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-col md:flex-row lg:gap-2   items-center justify-center  w-full">
          <div className="flex lg:flex-row gap-1 items-center">
            <label htmlFor="nameRoutes" className="font-medium">
              Nombre de ruta
            </label>
            <input
              type="text"
              name="name"
              value={formNewRoute.name}
              autoComplete="off"
              placeholder="Ruta maracos"
              className={`p-2 bg-slate-50 rounded-lg outline-none text-md font-normal ${
                formError.name ? 'border border-red-500' : ''
              }`}
              onChange={(e) => handleChangeForm(e)}
            />
          </div>
          <div className="flex lg:flex-row gap-1  items-center relative">
            <label htmlFor="nameRoutes" className="font-medium">
              Hora
            </label>
            <input
              type="text"
              name="hour"
              value={formNewRoute.hour}
              autoComplete="off"
              placeholder="00:00"
              className={`p-2 bg-slate-50 rounded-lg outline-none text-md font-normal ${
                formError.hour ? 'border border-red-500' : ''
              } w-28`}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                const target = e.target as HTMLInputElement;
                if (!/[0-9]/.test(e.key) && !/[:]/.test(e.key)) {
                  e.preventDefault();
                }
                if (/[:]/.test(e.key) && target.value.length < 2) {
                  e.preventDefault();
                }
                if (/[:]/.test(e.key) && target.value.includes(':')) {
                  e.preventDefault();
                }
                if (/[0-9]/.test(e.key) && target.value.length > 4) {
                  e.preventDefault();
                }
                if (
                  /[0-9]/.test(e.key) &&
                  target.value.length === 1 &&
                  +e.key > 4 &&
                  +target.value[0] === 2
                ) {
                  e.preventDefault();
                }
                if (/[0-9]/.test(e.key) && target.value.length === 2) {
                  e.preventDefault();
                  target.value = `${target.value}:00`;
                }
                if (/[0-9]/.test(e.key) && target.value.length === 0 && +e.key > 2) {
                  e.preventDefault();
                }
                if (/[0-9]/.test(e.key) && target.value.length > 3) {
                  const prevValue = target.value.substring(0, 3);
                  target.value = `${prevValue}00`;
                  e.preventDefault();
                }
              }}
              onChange={(e) => handleChangeForm(e)}
            />
          </div>
          <div className="flex  gap-3">
            <button
              type="button"
              onClick={() => handleAddCoords()}
              className="px-2 py-1 flex justify-center text-sm outline-none bg-green-500 text-white rounded-lg font-semibold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                  clipRule="evenodd"
                />
              </svg>
              <p>coordenadas</p>
            </button>
            <button
              type="submit"
              className="px-2 py-1 w-28 text-sm outline-none bg-green-500 text-white rounded-lg font-semibold"
            >
              {loading ? <Spinner /> : formNewRoute._id === 0 ? 'Guardar ruta' : 'Actualizar ruta'}
            </button>
          </div>
        </div>
        <div className="mt-4 flex gap-5 flex-wrap justify-center md:justify-start h-full">
          {coords.length === 0 && typeof formError.busStops === 'boolean' && formError.busStops && (
            <span className="text-red-500 text-center">
              Tienes que elegir al menos una coordenada
            </span>
          )}
          {coords.length > 0 &&
            coords.map((coord: TStateCoords, i) => (
              <div className="flex flex-col gap-2 p-3 shadow-lg rounded-lg shadow-gray-100" key={i}>
                <h3 className="text-center font-medium">Coordenada {i + 1}</h3>
                <div className="flex gap-2">
                  <input
                    value={coords[i].lat}
                    type="text"
                    placeholder="Latitud"
                    name="latitud"
                    autoComplete="off"
                    className="bg-slate-50 rounded-lg p-2 w-24 outline-none"
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      const target = e.target as HTMLInputElement;
                      if (!/[0-9]/.test(e.key) && !/[.]/.test(e.key) && !/[-]/.test(e.key)) {
                        e.preventDefault();
                      }
                      if (/[-]/.test(e.key) && target.value.length !== 0) {
                        e.preventDefault();
                      }
                      if (/[.]/.test(e.key) && target.value.length < 2) {
                        e.preventDefault();
                      }
                      if (/[.]/.test(e.key) && target.value.includes('.')) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => handleChageCoord(i, e)}
                  />
                  <input
                    value={coords[i].lng}
                    type="text"
                    placeholder="Longitud"
                    name="longitud"
                    autoComplete="off"
                    className="bg-slate-50 rounded-lg p-2 w-24 outline-none"
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      const target = e.target as HTMLInputElement;
                      if (!/[0-9]/.test(e.key) && !/[.]/.test(e.key) && !/[-]/.test(e.key)) {
                        e.preventDefault();
                      }
                      if (/[-]/.test(e.key) && target.value.length !== 0) {
                        e.preventDefault();
                      }
                      if (/[.]/.test(e.key) && target.value.length < 2) {
                        e.preventDefault();
                      }
                      if (/[.]/.test(e.key) && target.value.includes('.')) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => handleChageCoord(i, e)}
                  />
                </div>
                <input
                  type="text"
                  name="nameCoord"
                  value={coords[i].name}
                  autoComplete="off"
                  className="bg-slate-50 rounded-lg p-2 outline-none"
                  placeholder="Paradero"
                  onChange={(e) => handleChageCoord(i, e)}
                />
                {typeof formError.busStops === 'object' && formError.busStops[i]?.error && (
                  <span className="text-red-500">Faltan campos</span>
                )}
              </div>
            ))}
        </div>
      </form>
    </div>
  );
}
