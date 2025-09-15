import React, { createContext, useState } from "react";
import CompanyOverview from "../loginpages/CompanyOverview";

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [allFormData, setAllFormData] = useState({
    companyOverview: {},
    productionDetails: {},
    certifications: {},
    documentsUpload: {},
    operationalData: {},
    electrical: {},
    hvac: {},
    scada: {},
    building: {},
    equipment: {}
  });
 
  const updateFormData = (formName, data) => {
    setAllFormData((prev) => ({
      ...prev,
      [formName]: { ...prev[formName], ...data },
    }));
  };

  return (
    <FormContext.Provider value={{ allFormData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};   