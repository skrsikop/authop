import React from "react";

const getStrength = (password) => {
  let score = 0;
  if (!password) return { score: 0, label: "Too Weak", color: "bg-gray-700" };

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  switch (score) {
    case 0:
    case 1:
      return { score, label: "Very Weak", color: "bg-red-600" };
    case 2:
      return { score, label: "Weak", color: "bg-orange-500" };
    case 3:
      return { score, label: "Good", color: "bg-yellow-500" };
    case 4:
      return { score, label: "Strong", color: "bg-green-600" };
    default:
      return { score: 0, label: "Too Weak", color: "bg-gray-700" };
  }
};

const PasswordStrength = ({ password }) => {
  const { score, label, color } = getStrength(password);

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 rounded ${score >= level ? color : "bg-gray-700"}`}
          ></div>
        ))}
      </div>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
};

export default PasswordStrength;
