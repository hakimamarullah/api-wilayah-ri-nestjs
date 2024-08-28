import { KelurahanResponse } from './kelurahan.response';

export class KecamatanResponse {
  id: number;
  nama: string;
  jumlahKelurahan: number;
  kelurahan: KelurahanResponse[];
  createdAt: Date;
  updatedAt: Date;

  static toResponse(kecamatan: any): KecamatanResponse {
    const kecamatanResponse: KecamatanResponse = new KecamatanResponse();
    kecamatanResponse.id = kecamatan.id;
    kecamatanResponse.nama = kecamatan.name;
    kecamatanResponse.jumlahKelurahan = kecamatan.Kelurahan?.length ?? 0;
    kecamatanResponse.kelurahan = kecamatan.Kelurahan?.map((item: any) =>
      KelurahanResponse.toKelurahanResponse(item),
    );
    return kecamatanResponse;
  }
}
