import { KabupatenResponse } from './kabupaten.response';
import { ApiProperty } from '@nestjs/swagger';

export class ProvinsiResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  jumlahKabupaten: number;

  @ApiProperty({ isArray: true, type: () => KabupatenResponse })
  kabupaten: KabupatenResponse[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static build(provinsi: any): ProvinsiResponse {
    const provinsiResponse = new ProvinsiResponse();
    provinsiResponse.id = provinsi?.id;
    provinsiResponse.name = provinsi?.name;
    provinsiResponse.kabupaten = provinsi?.Kabupaten?.map((kabupaten: any) =>
      KabupatenResponse.toResponse(kabupaten),
    );
    provinsiResponse.createdAt = provinsi?.createdAt;
    provinsiResponse.updatedAt = provinsi?.updatedAt;
    return provinsiResponse;
  }
}
