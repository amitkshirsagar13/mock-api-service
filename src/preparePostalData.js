import postalData from '../postal/postal-data-store.json' assert {type: 'json'};
import  fs  from "fs";
    
const saveData = (name, data) => {
    fs.writeFileSync(
        `./db/${name}.json`,
        JSON.stringify(data, " ", 4 )
    );
}

const fetchTalukaDataStore = () => {

    const postalTreeStore = [];
    const stateStore = [];
    const districtStore = [];
    const talukaStore = [];
    const poStore = [];
    for(const postalOffice of postalData) {
        console.log(`Working with ${postalOffice.pincode} | ${postalOffice.officeName}`)
        let index = stateStore.findIndex((state)=> state.state === postalOffice.stateName);
        if(index < 0) {
            const state = {
                state: postalOffice.stateName,
                id: stateStore.length + 1
            };
            stateStore.push(state);
        }

        index = districtStore.findIndex((district)=> district.district === postalOffice.districtName);
        if(index < 0) {
            const district = {
                district: postalOffice.districtName,
                id: districtStore.length + 1
            };
            districtStore.push(district);
        }
        
        index = talukaStore.findIndex((taluk)=> taluk.taluka === postalOffice.taluk);
        if(index < 0) {
            const taluka = {
                taluka: postalOffice.taluk,
                id: talukaStore.length + 1
            };
            talukaStore.push(taluka);
        }
        
        index = poStore.findIndex((po)=> po.postalOffice === postalOffice.officeName);
        if(index < 0) {
            const po = {
                postalOffice: postalOffice.officeName,
                id: poStore.length + 1
            };
            poStore.push(po);
        }
        // taluka.postOffice = [po];
        // district.taluka = [taluka];
        // state.district = [district];
        // const stateItem = postalTreeStore.find((stateData)=>stateData.id === state.id);
        // if(stateItem) {
        //     const districtItem = stateItem.find(district=>district.id === state.district[0].id);
        // } else {
        //     postalTreeStore.push(state);
        // }
    }
    
    saveData('state', stateStore);
    saveData('district', districtStore);
    saveData('taluka', talukaStore);
    saveData('postOffice', poStore);
}
fetchTalukaDataStore();