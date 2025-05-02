
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import { Bike } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const { login, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Add debugging to check if component mounts
  useEffect(() => {
    console.log("Login component mounted");
  }, []);

  // Add debugging for auth loading state
  useEffect(() => {
    console.log("Auth loading state changed:", authLoading);
  }, [authLoading]);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      console.log("Login attempt started", data.email);
      setIsLoading(true);
      setError(null);
      const result = await login(data.email, data.password);
      
      if (result?.error) {
        console.error("Login error from result:", result.error);
        let errorMessage = result.error.message || "Failed to login. Please try again.";
        
        if (result.error.message === "Email not confirmed") {
          errorMessage = "Please check your email and confirm your account before logging in.";
        } else if (result.error.message === "Invalid login credentials") {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        }
        
        setError(errorMessage);
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
      // Note: Navigation will happen automatically via the GuestGuard
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error?.message || "Failed to login. Please try again.";
      setError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
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
          <h1 className="text-2xl font-bold">Welcome to Habal Hub</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <AuthForm 
          type="login" 
          onSubmit={handleLogin} 
          isLoading={isLoading || authLoading} 
        />
        
        <div className="mt-4 text-xs text-muted-foreground">
          Auth state: {authLoading ? "Loading..." : "Ready"}
        </div>
      </div>
    </div>
  );
}
