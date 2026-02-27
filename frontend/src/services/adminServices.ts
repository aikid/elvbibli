// adminServices.ts
import axios from 'axios';

export const adminServices = {
  requestCode: async (email: string) => {
    return axios.post('/admin/request-code', { email });
  },
  validateCode: async (email: string, code: string) => {
    return axios.post('/admin/validate-code', { email, code });
  },
};
