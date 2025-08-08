import axios from 'axios';
import Constants from 'expo-constants';

// API keys and endpoints are left to be configured by the user.  The
// functions below encapsulate calls to various environmental data sources
// required by Old Head, including weather, streamflow, tides and solar
// information.  Each function returns the raw response from the remote
// service; caching should be handled via react‑query in the caller.

const extra =
  (Constants?.expoConfig && Constants.expoConfig.extra) ||
  (Constants?.manifest && Constants.manifest.extra) ||
  {};
const WEATHER_API_KEY =
  extra.WEATHER_API_KEY ||
  process.env.EXPO_PUBLIC_WEATHER_API_KEY ||
  process.env.WEATHER_API_KEY;

/**
 * Fetch a multi‑day forecast for a given latitude/longitude from
 * WeatherAPI.com.  Refer to https://www.weatherapi.com/docs/ for details
 * on available parameters and response structure.
 */
export const getWeatherForecast = async (lat, lon, days = 3) => {
  const { data } = await axios.get('https://api.weatherapi.com/v1/forecast.json', {
    params: {
      key: WEATHER_API_KEY,
      q: `${lat},${lon}`,
      days
    }
  });
  return data;
};

/**
 * Retrieve gage height and streamflow data from USGS for a specified site.
 * See https://waterservices.usgs.gov/ for parameter definitions.
 */
export const getUSGSData = async site => {
  const url = `https://waterservices.usgs.gov/nwis/iv/`;
  const { data } = await axios.get(url, {
    params: {
      site,
      parameterCd: '00065,00060',
      format: 'json'
    }
  });
  return data;
};

/**
 * Obtain tide predictions from NOAA CO‑OPS.  See
 * https://tidesandcurrents.noaa.gov/api/ for detailed usage.  Times
 * should be provided in YYYYMMDD format.
 */
export const getNOAATide = async (station, begin_date, end_date) => {
  const { data } = await axios.get('https://api.tidesandcurrents.noaa.gov/api/prod/datagetter', {
    params: {
      begin_date,
      end_date,
      station,
      product: 'predictions',
      datum: 'MLLW',
      interval: 'h',
      units: 'english',
      time_zone: 'lst_ldt',
      format: 'json'
    }
  });
  return data;
};

/**
 * Fallback solar data from the open Sunrise‑Sunset API.  This is used when
 * WeatherAPI lacks sunrise and sunset information for a location.  The
 * coordinates should be provided in decimal degrees.  See
 * https://sunrise-sunset.org/api for more information.
 */
export const getSunriseSunset = async (lat, lon) => {
  const { data } = await axios.get('https://api.sunrise-sunset.org/json', {
    params: {
      lat,
      lng: lon,
      formatted: 0
    }
  });
  return data;
};