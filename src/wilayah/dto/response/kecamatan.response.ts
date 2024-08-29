import { KelurahanResponse } from './kelurahan.response';
import { ApiProperty } from '@nestjs/swagger';

export class KecamatanResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nama: string;

  @ApiProperty()
  jumlahKelurahan: number;

  @ApiProperty({ isArray: true, type: () => KelurahanResponse })
  kelurahan: KelurahanResponse[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
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
