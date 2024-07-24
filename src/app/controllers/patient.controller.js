import APIFeaturesQuery from "../../utils/apiFeaturesQuery.js";
import catchAsync from "../../utils/catchAsync.js";
import Patient from "../models/patient.model.js"


export const getAllPatients = catchAsync(async (req, res, next) => {
    const features = new APIFeaturesQuery(Patient, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .startDateFilter()
    .populate();

    const patients = await features.query;
    
    res.status(200).json({
        status: "success",
        message: "Patients fetched successfully",
        results: patients.length,
        data: {
          patients,
        },
      });
})
