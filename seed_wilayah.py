import logging

import requests

# Configure logging
logging.basicConfig(level=logging.INFO)


# URLs for the source and destination APIs
source_api_url = "https://api.wilayah.anmediacorp.com"
destination_api_url = "http://localhost:3000/api/wilayah"

# Fetch data from the source API
logging.info('START GETTING PROVINSI [SOURCE]')
responseProvinsi = requests.get(source_api_url+"/provinces")
responseProvinsi.raise_for_status()  # Ensure the request was successful
provinsi_list = responseProvinsi.json()

# Map to store old IDs and new IDs
id_map = {}

# Remap the entire list for the batch request
batch_payload = []


for provinsi in provinsi_list:
    # Extract the old ID and store it in order
    old_id = provinsi["id"]
    

    # Remap the data for the destination API
    new_payload = {
        "name": provinsi["name"]
    }
    
    id_map[provinsi["name"]] = old_id

    batch_payload.append(new_payload)


# Send the batch payload to the destination API
logging.info('START SAVE PROVINSI [DESTINATION]')
batch_response = requests.post(destination_api_url + "/provinsi", json=batch_payload)
batch_response.raise_for_status()  # Ensure the request was successful
new_provinsi_list = batch_response.json()["responseData"]

provinsi_id_map = {}
for res in new_provinsi_list:
    provinsi_id_map[id_map[res["name"]]] = res["id"] 


logging.info('START GETTING KABUPATEN [SOURCE]')
batch_kabupaten = []
kab_old_id = {}
for id_old in id_map.values():
    responseKabupaten = requests.get(source_api_url + "/districts?province_id=" + str(id_old)).json()
    for kab in responseKabupaten:
        print(kab)
        new_kab = {
            "name": kab["name"],
            "provinsiId": provinsi_id_map[kab["province_id"]]
        }
        kab_old_id[kab["name"]] = kab["id"]
        batch_kabupaten.append(new_kab)

logging.info('START POSTING KABUPATEN [DESTINATION]')
new_kab_list = requests.post(destination_api_url + "/kabupaten", json=batch_kabupaten).json()["responseData"]
kab_id_map = {}

for res in new_kab_list:
    kab_id_map[kab_old_id[res["name"]]] = res["id"]


logging.info('START GETTING KECAMATAN [SOURCE]')
batch_kec = []
kec_old_id = {}
new_kec_list = []
for id_old in kab_old_id.values():
    responseKecamatan = requests.get(source_api_url + "/subdistricts?district_id=" + str(id_old)).json()
    print(responseKecamatan)
    for kec in responseKecamatan:
        new_kec = {
            "name": kec["name"],
            "kabupatenId": kab_id_map[kec["district_id"]]
        }
        kec_old_id[kec["name"]] = kec["id"]
        batch_kec.append(new_kec)
    new_kec_list.extend(requests.post(destination_api_url + "/kecamatan", json=batch_kec).json()["responseData"])
    batch_kec = []

logging.info('START POSTING KECAMATAN [DESTINATION]')
kec_id_map = {}

print("KECAMATAN CREATED")
print(new_kec_list)
print(new_kec_list)
for res in new_kec_list:
    kec_id_map[kec_old_id[res["name"]]] = res["id"]


logging.info('START GETTING KELURAHAN [SOURCE]')
batch_kel = []
kel_old_id = {}
for id_old in kec_id_map.keys():
    responseKel = requests.get(source_api_url + "/villages?subdistrict_id=" + str(id_old)).json()
    for kel in responseKel:
        new_kel = {
            "name": kel["name"],
            "kecamatanId": kec_id_map[kel["subdistrict_id"]]
        }
        print(new_kel)
        kel_old_id[kel["name"]] = kel["id"]
        batch_kel.append(new_kel)
    logging.info('START POSTING KELURAHAN [DESTINATION]')
    requests.post(destination_api_url + "/kelurahan", json=batch_kel).json()
    batch_kel = []


logging.info('ALL DATA POSTED')