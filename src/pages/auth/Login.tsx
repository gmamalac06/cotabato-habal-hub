
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import { Bike } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      
      // Navigation will happen automatically via the GuestGuard
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary">
      <div className="auth-card animate-fade-in">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <Bike className="text-white h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">Welcome to Habal Hub</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>
        
        <AuthForm 
          type="login" 
          onSubmit={handleLogin} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
