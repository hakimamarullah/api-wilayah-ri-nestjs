import { ApiProperty } from '@nestjs/swagger';

export class KelurahanResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static toKelurahanResponse(kelurahan: any): KelurahanResponse {
    const kelurahanResponse = new KelurahanResponse();
    kelurahanResponse.id = kelurahan?.id;
    kelurahanResponse.name = kelurahan?.name;
    kelurahanResponse.zipCode = kelurahan?.zipCode;
    kelurahanResponse.createdAt = kelurahan?.createdAt;
    kelurahanResponse.updatedAt = kelurahan?.updatedAt;
    return kelurahanResponse;
  }
}
