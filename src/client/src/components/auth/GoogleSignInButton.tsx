import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { apiClient } from "@/api/client/axios.client";

interface GoogleSignInButtonProps {
  isLoading?: boolean;
}

export const GoogleSignInButton = ({ isLoading = false }: GoogleSignInButtonProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;

      const res = await apiClient.post("/Identity/google", { idToken });


      if (res.data.value?.accessToken) {
        dispatch(setCredentials({ accessToken: res.data.value.accessToken }));
        
        navigate("/dashboard", { replace: true });
      } else if (res.data.accessToken) {
        dispatch(setCredentials({ accessToken: res.data.accessToken }));
        
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
    }
  };

  return (
    <>
      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white/5 text-gray-400">Or continue with</span>
        </div>
      </div>

      <div className="mt-6">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("Login Failed")}
        />
      </div>
    </>
  );
};
