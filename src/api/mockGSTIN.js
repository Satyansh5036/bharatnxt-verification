export const verifyGSTIN = (gstin) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        valid: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin),
        businessName: "Demo Vendor Pvt Ltd",
        lastFiled: "2024-05-01",
        complianceStatus: "Active",
        reputationScore: 4.2
      });
    }, 1500); // Simulate API delay
  });
};