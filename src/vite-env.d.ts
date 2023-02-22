import { LatLngLiteral, Icon, LatLngTuple } from 'leaflet';
/// <reference types="vite/client" />

export interface IUserInformation {
  name: string;
  email: string;
}

export interface IAuthContext {
  user: IUserInformation;
  logout: () => void;
  login: (data: IUserInformation) => void;
}

export interface IBusStop {
  lat: number;
  lng: number;
  name: string;
}

export interface IRoute {
  _id: number;
  name: string;
  hour: string;
  busStops: IBusStop[];
}

export interface IMapProps {
  marker: TMarkerInformation;
  position?: LatLngLiteral;
  setMarkerInformation: React.Dispatch<React.SetStateAction<TMarkerInformation>>;
  data: IRoute[];
}

export type TMarkerInformation = Pick<IRoutes, 'hour'> & {
  state: boolean;
  busStopName: string;
  lat: number;
  lng: number;
};

export interface IFormRoutesProps {
  route: IRoute | null;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IPropsModal {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: JSX.Element;
}

export interface IMessageToast {
  error: boolean;
  message: string;
}
export interface IPropsToast {
  setOpenToast: React.Dispatch<React.SetStateAction<boolean>>;
  openToast: bool;
  text: string;
  error?: boolean;
}
