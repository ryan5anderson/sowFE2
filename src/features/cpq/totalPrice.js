
import React from "react";


const FixedFeeContingency = 0.1430;
const StandardProjectOnboarding = 3;

const e_discovery = (vms, lzs) => {
  const k7 = ((Math.ceil(vms / 100)) - 1) * 8
  const c11 = (8 * lzs) + k7;
  return Math.ceil(0.25 * (StandardProjectOnboarding + c11));
};

const e_design = (vms, lzs) => {
  const innerValue = ((16 + ((Math.ceil(vms / 100)) - 1) * 8) + (8 * lzs))
  return Math.ceil(0.25 * (innerValue + parseInt(vms)));
};

const e_mig_n_cut = (vms) => {
  return Math.ceil(0.85 * (vms * 2));
};

const e_staging = (lzs) => {
  return Math.ceil(0.85 * ((lzs * 8) + 16));
};

const e_post_cut_support = (vms) => {
  return (vms * 0.1) + 8;
}

const a_discovery = (vms, lzs) => {
  const k7 = ((Math.ceil(vms / 100)) - 1) * 8
  const c11 = (8 * lzs) + k7;
  return Math.ceil(0.75 * (StandardProjectOnboarding + c11));
};

const a_design = (vms, lzs) => {
  const innerValue = ((16 + ((Math.ceil(vms / 100)) - 1) * 8) + (8 * lzs))
  return Math.ceil(0.75 * (innerValue + parseInt(vms)));
};

const a_mig_n_cut = (vms) => {
  return Math.ceil(0.15 * (vms * 2));
};


const a_staging = (lzs) => {
  const innerValue = ((lzs * 8) + 16)
  return Math.ceil (0.15 * innerValue);
};

const total_pmtime = (vms, lzs) => {
  const values = (e_discovery(vms, lzs) + e_design(vms, lzs) + e_mig_n_cut(vms) + e_staging(lzs) + e_post_cut_support(vms) + 
  a_discovery(vms, lzs) + a_design(vms, lzs) + a_mig_n_cut(vms) + a_staging(lzs));  
  return Math.ceil(values * 0.3);
}

const total_e_cont = (vms, lzs) => {
  const values = (e_discovery(vms, lzs) + e_design(vms, lzs) + e_mig_n_cut(vms) + e_staging(lzs) + e_post_cut_support(vms));
  return Math.ceil(FixedFeeContingency * values);
}

const total_a_cont = (vms, lzs) => {
  const values = (a_discovery(vms, lzs) + a_design(vms, lzs) + a_mig_n_cut(vms) + a_staging(lzs));
  return Math.ceil(FixedFeeContingency * values);
}

const total_pm_cont = (vms, lzs) => {
  return Math.ceil(FixedFeeContingency * (total_pmtime(vms, lzs)));
}

const total_service_cost = (vms, lzs, ehr, phr, ahr) => {
  const e_total = ((e_discovery(vms, lzs) + e_design(vms, lzs) + e_staging(lzs) + e_mig_n_cut(vms) + e_post_cut_support(vms)
    + total_e_cont(vms, lzs)) * ehr) 
    
  const pm_total = ((total_pmtime(vms, lzs) + total_pm_cont(vms, lzs)) * phr)

  const a_total = ((a_discovery(vms, lzs) + a_design(vms, lzs) + a_mig_n_cut(vms) + a_staging(lzs) + total_a_cont(vms, lzs)) * ahr)
  
  const total = e_total + pm_total + a_total;
  
  return (Math.ceil(total/1000) * 1000);
}

const total_arc = (hours, months, ahr) => {
  const pm = 202
  const total =  (pm * months) + (months * (ahr * hours))
  return (Math.ceil(total/1000) * 1000)
}


const totalPrice = ({ values, type }) => (
    <>
      {type === "Arc as a Service" && (
        <div className="totalPrice">
          <h2>Total Services Cost ${total_arc(values.hours, values.months, values.architect_hourly).toLocaleString()}</h2>
        </div>
      )}
  
      {type === "Lift and shift" && (
        <div className="totalPrice">
          <h2>Total Services Cost ${total_service_cost(values.vms, values.landing_zones, values.engineer_hourly, values.pm_hourly, values.architect_hourly).toLocaleString()}</h2>
        </div>
      )}
    </>
  );
  
  export default totalPrice;
  
  
  
  
  
  
  