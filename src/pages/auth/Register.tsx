
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import { Bike } from "lucide-react";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";

export default function Register() {
  const { register, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Add debugging to check if component mounts
  useEffect(() => {
    console.log("Register component mounted");
  }, []);

  // Add debugging for auth loading state
  useEffect(() => {
    console.log("Register auth loading state:", authLoading);
  }, [authLoading]);

  const handleRegister = async (data: { 
    name: string; 
    email: string; 
    phone: string;
    password: string; 
    role: UserRole;
  }) => {
    try {
      console.log("Registration attempt started", data.email);
      setIsLoading(true);
      setError(null);
      const result = await register(data.email, data.password, data.name, data.phone, data.role);
      
      if (result?.error) {
        console.error("Registration error from result:", result.error);
        setError(result.error.message || "Failed to register. Please try again.");
        toast({
          title: "Registration failed",
          description: result.error.message || "Failed to register. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration successful",
          description: "Please check your email for confirmation link before logging in.",
        });
        // Navigation is handled in the register function
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error?.message || "Failed to register. Please try again.");
      toast({
        title: "Registration failed",
        description: error?.message || "Failed to register. Please try again.",
        variant: "destructive",
      });
    } finally {
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
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <AuthForm 
          type="register" 
          onSubmit={handleRegister} 
          isLoading={isLoading || authLoading} 
        />
        
        <div className="mt-4 text-xs text-muted-foreground">
          Auth state: {authLoading ? "Loading..." : "Ready"}
        </div>
      </div>
    </div>
  );
}
