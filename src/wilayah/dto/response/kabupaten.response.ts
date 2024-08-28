import { KecamatanResponse } from './kecamatan.response';

export class KabupatenResponse {
  id: number;
  nama: string;
  jumlahKecamatan: number;
  kecamatan: KecamatanResponse[];
  createdAt: Date;
  updatedAt: Date;

  static toResponse(kabupaten: any): KabupatenResponse {
    const kabupatenResponse = new KabupatenResponse();
    kabupatenResponse.id = kabupaten.id;
    kabupatenResponse.nama = kabupaten.name;
    kabupatenResponse.jumlahKecamatan = kabupaten.Kecamatan?.length ?? 0;
    kabupatenResponse.kecamatan = kabupaten.Kecamatan?.map((item: any) =>
      KecamatanResponse.toResponse(item),
    );
    return kabupatenResponse;
  }
}
