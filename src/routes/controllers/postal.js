import postalData from '../../../postal/postal-data-store.json'  assert {type: 'json'};
import postalIdData from '../../../postal/postal-data-id-store.json'  assert {type: 'json'};

  
export const fetchPostalData = async (id) => {
    const pincodeResponse = {
        postOfficeList:[],
        result: 0
    };
    await Promise.all(postalData.filter(postalOffice => postalOffice.pincode === Number(id)).map(postalOffice => {
        const postOfficeData = {};
        postOfficeData.postOfficeName = postalOffice.officeName;
        postOfficeData.postOfficeId = findId('postOffice', postalOffice.officeName).id;
        postOfficeData.taluka = findId('taluka', postalOffice.taluk);
        postOfficeData.taluka.district = findId('district', postalOffice.districtName);
        postOfficeData.taluka.district.state = findId('state', postalOffice.stateName);
        pincodeResponse.postOfficeList.push(postOfficeData);
    }));
    pincodeResponse.result = pincodeResponse.postOfficeList.length;
    pincodeResponse.status = 'success';
    return pincodeResponse;
}
  
const findId = (typeName, name) => {
    return postalIdData[typeName].find((item => item[typeName] === name));
}
  
export default {fetchPostalData};