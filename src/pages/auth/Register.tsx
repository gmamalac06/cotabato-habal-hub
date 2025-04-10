
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import { Bike } from "lucide-react";
import { UserRole } from "@/types";

export default function Register() {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data: { 
    name: string; 
    email: string; 
    phone: string;
    password: string; 
    role: UserRole;
  }) => {
    try {
      setIsLoading(true);
      await register(data.email, data.password, data.name, data.phone, data.role);
      
      // Navigation will happen automatically via the GuestGuard
    } catch (error) {
      console.error("Registration error:", error);
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
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">Join Habal Hub today</p>
        </div>
        
        <AuthForm 
          type="register" 
          onSubmit={handleRegister} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
