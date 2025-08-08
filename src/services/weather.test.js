jest.mock('axios');

describe('getWeatherForecast', () => {
  it('requests forecast with coordinates and days', async () => {
    jest.resetModules();
    process.env.WEATHER_API_KEY = 'test-key';
    const axios = require('axios');
    const { getWeatherForecast } = require('./weather');
    axios.get.mockResolvedValue({ data: { ok: true } });
    const lat = 40;
    const lon = -105;
    const days = 5;
    const result = await getWeatherForecast(lat, lon, days);
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.weatherapi.com/v1/forecast.json',
      { params: { key: 'test-key', q: `${lat},${lon}`, days } }
    );
    expect(result).toEqual({ ok: true });
  });
});
