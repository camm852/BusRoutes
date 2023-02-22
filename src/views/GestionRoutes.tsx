import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Transition, Dialog } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IPropsModal, IRoute } from '../vite-env';
import Spinner from '../components/Spinner/Spinner';
import Toast from '../components/Toast';
import { deleteRoute, getRoutes } from '../utils/api';
import FormRoutes from '../components/FormRoutes';
import { useAuth } from '../context/AuthContex';

function ModalForm({ isOpenModal, setIsOpenModal, children }: IPropsModal) {
  return (
    <Transition appear show={isOpenModal} as={React.Fragment}>
      <Dialog as="div" className="relative z-20" onClose={() => setIsOpenModal(false)}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveTo="opacity-0"
          leaveFrom="opacity-100"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl h-96 overflow-y-auto scrollbar-thin scrollbar-track-slate-200 scrollbar-thumb-slate-400   transform overflow-hidden rounded-lg bg-white  text-left align-middle shadow-xl transition-all">
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

const initialState: IRoute = {
  _id: 0,
  name: '',
  busStops: [],
  hour: ''
};

export default function GestionRoutes(): JSX.Element {
  const [openToast, setOpenToast] = React.useState<boolean>(false);
  const [messageToast, setMessageToast] = React.useState<{
    error: boolean;
    message: string;
  }>({
    error: false,
    message: ''
  });
  const [paginator, setPaginator] = React.useState<{
    previous: string | null;
    next: string | null;
  }>({
    previous: null,
    next: null
  });
  const [editRoute, setEditRoute] = React.useState<IRoute | null>(null);
  const [totalRoutes, setTotalRoutes] = React.useState<number>(0);
  const [countRoutes, setCountRoutes] = React.useState<number[]>([]);
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);

  const navigate = useNavigate();
  const { page } = useParams();

  React.useEffect(() => {
    if (totalRoutes === 0) return;

    const count: number[] = [...Array(Math.ceil(totalRoutes / 10)).keys()].map((x, i) => i + 1);

    setCountRoutes(count);
  }, [totalRoutes]);

  React.useEffect(() => {
    if (page === '0' || page === null) navigate('/routes/1');
  }, [navigate, page]);

  const { logout } = useAuth();

  const queryClient = useQueryClient();

  const {
    mutate,
    isLoading: LoadingMutate,
    isSuccess
  } = useMutation(deleteRoute, {
    onSuccess: (data) => {
      Swal.fire('Eliminado correctamente', '', 'success');
    },
    onError: () => {
      Swal.fire('No se pudo eliminar', '', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries('AllRoutes');
    }
  });

  const handleDelete = (id: number) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'p-2 rounded-md text-white bg-sky-500',
        cancelButton: 'p-2 rounded-md text-white bg-red-500 m-2'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: '¿Estas segur@?',
        // text: 'Los cambios no se podran revertir',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          mutate(id);
          if (isSuccess) {
            Swal.fire('La ruta fue eliminada', '', 'success');
          }
        }
      });
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: ['AllRoutes'],
    queryFn: getRoutes
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Spinner big otherColor />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={`fixed   right-8
       bottom-1 transition-all duration-150 ease-in-out z-50`}
      >
        <Toast openToast setOpenToast={setOpenToast} error text="Ha ocurrido un error" />
      </div>
    );
  }

  return (
    <>
      <ModalForm isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal}>
        <FormRoutes route={editRoute} setOpenModal={setIsOpenModal} />
      </ModalForm>
      <div className="p-10 bg-slate-50 h-screen">
        <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md mt-10">
          <div className="relative flex bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr  from-green-400 to-sky-500 text-white shadow-sky-300 shadow-md  -mt-6 mb-8 p-6">
            <div className="flex-1">
              <p className="text-sm md:text-xl font-semibold">Rutas Almacenadas</p>
            </div>
            <div>
              <button
                className="flex flex-row flex-nowrap gap-2"
                onClick={() => {
                  setIsOpenModal(true);
                  setEditRoute(null);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p>Agregar</p>
              </button>
            </div>
          </div>
          <div className="p-6 overflow-x-auto px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <p className="block antialiased font-sans text-[11px] font-bold uppercase">
                      Nombre
                    </p>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <p className="block antialiased font-sans text-[11px] font-bold uppercase">
                      Coordenadas
                    </p>
                  </th>

                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <p className="block antialiased font-sans text-[11px] font-bold uppercase">
                      Hora
                    </p>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <p className="block antialiased font-sans text-[11px] font-bold uppercase" />
                  </th>
                </tr>
              </thead>
              <tbody className="w-full">
                {data &&
                  data.map((route: IRoute) => (
                    <tr key={route._id}>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <p className="font-medium">{route.name}</p>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <div className="block antialiased font-sans text-xs font-semibold text-gray-600">
                          {route.busStops.length > 0 &&
                            route.busStops.map((coords, i) => (
                              <div className="grid mb-2 lg:grid-cols-3" key={i}>
                                <p className="col-span-1 font-bold flex flex-nowrap gap-2">
                                  Lat: <span className="font-normal">{coords.lat}</span>
                                </p>
                                <p className="col-span-1 font-bold flex flex-nowrap gap-2">
                                  Lng: <span className="font-normal">{coords.lng}</span>
                                </p>
                                <p className="col-span-1 font-bold flex flex-nowrap gap-2">
                                  Paradero: <span className="font-normal">{coords.name}</span>
                                </p>
                              </div>
                            ))}
                        </div>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <p className="block antialiased font-sans text-sm font-bold">
                          {route.hour}
                        </p>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <div className="flex flex-nowrap gap-2">
                          <button
                            className=" bg-sky-500 p-1 rounded md"
                            onClick={() => {
                              setEditRoute(route);
                              setIsOpenModal(true);
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
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>
                          </button>
                          <button
                            className=" bg-red-500 p-1 rounded md"
                            onClick={() => handleDelete(route._id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6 text-white"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
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
        <div className="fixed flex flex-col md:flex-row gap-4 bottom-5 left-11 transition-all duration-150 ease-in-out z-50">
          <button
            className="p-2 flex flex-nowrap outline-none bg-gradient-to-br from-green-400 to-sky-300 text-white rounded-lg font-medium"
            onClick={() => navigate('/')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
            Inicio
          </button>
          <button
            className="p-2 flex flex-nowrap outline-none bg-gradient-to-br from-green-400 to-sky-300 text-white rounded-lg font-medium"
            onClick={() => logout()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                clipRule="evenodd"
              />
            </svg>
            cerrar sesion
          </button>
        </div>
        <div className=" sm:float-right mt-3 py-2">
          <nav className="flex justify-center">
            <ul className="flex list-style-none gap-2">
              <li className="page-item disabled">
                <button
                  className="font-medium relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded-full text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
                  onClick={() => {
                    navigate(`/dashboard/gestion/products/${page !== undefined ? +page - 1 : 1}`);
                    window.location.reload();
                  }}
                  disabled={!paginator.previous}
                >
                  Previous
                </button>
              </li>
              {countRoutes.map((count) => (
                <li key={count}>
                  <button
                    className={`relative block py-1 px-3.5 border-0 ${
                      page !== undefined
                        ? +page === count
                          ? 'bg-sky-500 text-white'
                          : 'bg-transparent text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none'
                        : ''
                    } outline-none transition-all duration-300 rounded-full `}
                    onClick={() => {
                      navigate(`/dashboard/gestion/products/${count}`);
                      window.location.reload();
                    }}
                  >
                    {count}
                  </button>
                </li>
              ))}
              <li>
                <button
                  className="font-medium relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded-full text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
                  onClick={() => {
                    navigate(`/dashboard/gestion/products/${page !== undefined ? +page + 1 : 1}`);
                    window.location.reload();
                  }}
                  disabled={!paginator.next}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
