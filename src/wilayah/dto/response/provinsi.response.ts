import { Kabupaten } from '@prisma/client';

export class ProvinsiResponse {
  id: number;
  nama: string;
  jumlahKabupaten: number;
  kabupaten: Kabupaten[];
}
