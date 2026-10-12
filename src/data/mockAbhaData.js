// Mock ABHA (Ayushman Bharat Health Account) Data & Helper Utilities

export const defaultAbhaProfile = {
  abhaNumber: "91-5829-4012-8831",
  abhaAddress: "rahul.sharma@abdm",
  fullName: "Rahul Kumar Sharma",
  dob: "14/08/1988",
  gender: "Male",
  bloodGroup: "O+",
  mobile: "+91 98765 43210",
  state: "Karnataka",
  district: "Bengaluru Urban",
  address: "Flat 402, Green Glen Layout, Bellandur, Bengaluru",
  linkedDate: "2024-03-15",
  isVerified: true,
  healthRecordsCount: 7,
  consentManagerActive: true,
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
};

export const validateAbhaNumber = (num) => {
  const clean = num.replace(/[^0-9]/g, '');
  return clean.length === 14;
};

export const formatAbhaNumber = (num) => {
  const clean = num.replace(/[^0-9]/g, '').slice(0, 14);
  const parts = [];
  if (clean.length > 0) parts.push(clean.slice(0, 2));
  if (clean.length > 2) parts.push(clean.slice(2, 6));
  if (clean.length > 6) parts.push(clean.slice(6, 10));
  if (clean.length > 10) parts.push(clean.slice(10, 14));
  return parts.join('-');
};
