import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as api from "../services/api";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Enter OTP code");
      return;
    }
    setLoading(true);
    try {
      await api.verifyOtp({ email, otp });
      toast.success("OTP Verified Successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.resendOtp(email);
      toast.success("OTP resent to your email");
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-gray-900 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
        <p className="text-gray-500 mb-6">
          Enter the code sent to <span className="text-blue-600 font-medium">{email}</span>
        </p>
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-3 rounded-lg border border-gray-300 text-center text-lg tracking-widest focus:ring-2 focus:ring-blue-500"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        <button
          onClick={handleResend}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
