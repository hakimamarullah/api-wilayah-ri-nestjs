import { KecamatanResponse } from './kecamatan.response';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels(() => KecamatanResponse)
export class KabupatenResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  jumlahKecamatan: number;
  @ApiProperty({ isArray: true, type: () => KecamatanResponse })
  kecamatan: KecamatanResponse[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static toResponse(kabupaten: any): KabupatenResponse {
    const kabupatenResponse = new KabupatenResponse();
    kabupatenResponse.id = kabupaten.id;
    kabupatenResponse.name = kabupaten.name;
    kabupatenResponse.jumlahKecamatan = kabupaten.Kecamatan?.length ?? 0;
    kabupatenResponse.kecamatan = kabupaten.Kecamatan?.map((item: any) =>
      KecamatanResponse.toResponse(item),
    );
    return kabupatenResponse;
  }
}
