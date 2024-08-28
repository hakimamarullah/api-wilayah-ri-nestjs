import { KabupatenResponse } from './kabupaten.response';

export class ProvinsiResponse {
  id: number;
  nama: string;
  jumlahKabupaten: number;
  kabupaten: KabupatenResponse[];
  createdAt: Date;
  updatedAt: Date;
}
