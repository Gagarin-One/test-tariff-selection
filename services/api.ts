import axios from 'axios';
import { Tariff } from '@/types';

const API_URL = 'https://t-core.fit-hub.pro/Test/GetTariffs';

export const fetchTariffs = async (): Promise<Tariff[]> => {
  try {
    const response = await axios.get<Tariff[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching tariffs:', error);
    return [];
  }
};
