import React from "react";
import Divider from "@/components/commons/divider";
import NeumorphButton from "@/components/commons/neumorph-button";

import googleLogo from "@/assets/logos/google.png";
import appleLogo from "@/assets/logos/apple.png";
import DialogBox from "@/components/commons/dialog-box";
import SigninForm from "@/components/Authentication/Signin/SigninForm";
import SignupForm from "@/components/Authentication/Signup/SignupForm";
import TextLooper from "@/components/animated/TextLooper";
import Spinner from "@/components/animated/Spinner";
import { GradientHeading } from "@/components/commons/gradient-heading";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useServices } from "@/contexts/ServicesContext";

const WelcomePage = () => {
  const [isSignInDialogOpen, setIsSignInDialogOpen] = React.useState(false);
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = React.useState(false);
  const { accessToken, setAccessToken } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const adjectives = [
    "Authentic",
    "Fearless",
    "Thoughtful",
    "Seamless",
    "Adaptive",
    "Intuitive",
    "Connected",
    "Inclusive",
    "Human",
    "Powerful",
    "Provocative",
    "Game-changing",
  ];

  const { authService } = useServices();

  const handleSignIn = () => {
    setIsSignInDialogOpen(true);
    setIsSignUpDialogOpen(false);
  };

  const handleSignUp = () => {
    setIsSignUpDialogOpen(true);
    setIsSignInDialogOpen(false);
  };
  const handleCloseDialog = () => {
    setIsSignInDialogOpen(false);
    setIsSignUpDialogOpen(false);
  };

  React.useEffect(() => {
    // This covers the following scenarios:
    // 1. No refresh token - When there is no refesh token stored in cookie.
    // 2. Invalid refresh token - When the refresh token stored in cookie is either expired or invalid due to any reason.
    // 3. Valid refresh token - When the refresh token has not expired and is still valid. This scenraio is the positive case.
    const getAccessToken = async () => {
      setIsLoading(true);
      try {
        // If we already have an access token, proceed to protected route
        let token = accessToken;
        if (!token) {
          const refreshResponse = await authService.refresh();
          token = refreshResponse.access_token;
          setAccessToken(token);
        }
        // If we have a token (either from context or just refreshed), navigate
        if (token) {
          navigate("/home", { replace: true });
        }
      } catch {
        // If the refresh token was invalid then we simply don't do anything. It is best to clearout the cookie so as to clear out the invalid
        // refresh token. To do so /auth/logout API endpoint needs to be called.
        await authService.logout();
      } finally {
        setIsLoading(false);
      }
    };
    getAccessToken();
  }, []);

  return isLoading ? (
    <div className="flex items-center justify-center h-screen">
      <Spinner size="large" />
    </div>
  ) : (
    <div className="flex flex-row items-center justify-center h-screen">
      <div className="w-1/2">
        <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
          A platform designed to be <TextLooper texts={adjectives} />
        </span>
        <br />
        <br />
        <GradientHeading size={"sm"} weight={"semi"}>
          Because even small thoughts can spark big conversations—sign in and be
          part of something real.
        </GradientHeading>
      </div>
      <div className="flex flex-col items-center justify-center h-full w-1/2">
        <div className="w-2/3">
          <div className="text-4xl xl:text-5xl font-bold text-white mb-4 text-start w-full">
            Connect. Share. Inspire.
          </div>
          <div className="text-white font-bold text-2xl mb-5 text-start w-full">
            Sign in to your account
          </div>
          <NeumorphButton fullWidth intent={"white"} className="mb-4">
            <div className="flex items-center justify-center">
              <img
                src={googleLogo}
                alt="Google Logo"
                className="w-5 h-5 mr-2"
              />
              <span>Sign in with Google</span>
            </div>
          </NeumorphButton>
          <NeumorphButton fullWidth intent={"white"} className="mb-4">
            <div className="flex items-center justify-center">
              <img src={appleLogo} alt="Apple Logo" className="w-5 h-5 mr-2" />
              <span>Sign in with Apple</span>
            </div>
          </NeumorphButton>
          <NeumorphButton fullWidth intent={"white"} onClick={handleSignIn}>
            Sign in
          </NeumorphButton>
          <DialogBox isOpen={isSignInDialogOpen} onClose={handleCloseDialog}>
            <SigninForm />
          </DialogBox>
          <div className="flex flex-col items-center justify-center mt-4 w-full">
            <Divider text="OR" />
            <div className="text-white text-sm mb-4 text-start w-full">
              Don't have an account?
            </div>
            <NeumorphButton fullWidth intent={"primary"} onClick={handleSignUp}>
              Sign up
            </NeumorphButton>
            <DialogBox isOpen={isSignUpDialogOpen} onClose={handleCloseDialog}>
              <SignupForm />
            </DialogBox>
          </div>
          <div className="text-white text-xs mt-4 text-start w-full">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-400 underline">
              Terms of Service
            </a>
            ,{" "}
            <a href="#" className="text-blue-400 underline">
              Privacy Policy
            </a>
            , and{" "}
            <a href="#" className="text-blue-400 underline">
              Cookie Use
            </a>
            . Your privacy is our priority.
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
