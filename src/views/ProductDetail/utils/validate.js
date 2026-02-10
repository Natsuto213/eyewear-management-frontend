export const validateEyeDegree = (value, type) => {
  if (value === "" || value === null) {
    return { isValid: true, message: "" };
  }

  const num = parseFloat(value);
  if (isNaN(num)) {
    return { isValid: false, message: "Vui lòng nhập số" };
  }

  const limits = {
    Can: { min: -20, max: 0, msg: "Độ cận: 0 đến -20" },
    Vien: { min: 0, max: 10, msg: "Độ viễn: 0 đến +10" },
    Loan: { min: -6, max: 6, msg: "Độ loạn: -6 đến +6" },
    Lao: { min: 0.75, max: 3.5, msg: "Độ lão: +0.75 đến +3.5" },
  };

  const limit = limits[type];
  if (limit && (num < limit.min || num > limit.max)) {
    return { isValid: false, message: limit.msg };
  }

  if (Math.round(num * 100) % 25 !== 0) {
    return { isValid: false, message: "Phải là bội số của 0.25" };
  }

  return { isValid: true, message: "" };
};
