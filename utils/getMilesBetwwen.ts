import { Coors } from '../redux/business/businessSlide';
import { getDistance } from 'geolib';
export const getMilesBetweenLatLon = (data: {
    start: { lon: number; lat: number };
    end: { lon: number; lat: number };
}): number => {
    const distance = getDistance(
        { lon: data.start.lon, lat: data.start.lat },
        { lon: data.end.lon, lat: data.end.lat }
    );

    return Math.round(distance / 1609);
};
