export class KelurahanResponse {
  id: number;
  nama: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;

  static toKelurahanResponse(kelurahan: any): KelurahanResponse {
    const kelurahanResponse = new KelurahanResponse();
    kelurahanResponse.id = kelurahan?.id;
    kelurahanResponse.nama = kelurahan?.name;
    kelurahanResponse.zipCode = kelurahan?.zipCode;
    kelurahanResponse.createdAt = kelurahan?.createdAt;
    kelurahanResponse.updatedAt = kelurahan?.updatedAt;
    return kelurahanResponse;
  }
}
