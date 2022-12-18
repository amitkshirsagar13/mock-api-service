import { fetchPostalData } from "./controllers/postal";

export const postalRoute = {
    fetchPincode: async (req, res) => {
        const pincode = req.params.pincode;
        fetchPostalData(pincode).then((response) => {
            res.json(response);
        });
    }
}

export default {postalRoute};