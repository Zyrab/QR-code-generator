import { functions, httpsCallable } from "./firebase";

export interface TrialStartResponse {
  success: boolean;
  trialEndsAt: string;
  plan: "trial";
}

export interface CheckoutSessionResponse {
  url: string;
}
export interface CustomerPortalLink {
  url: string;
}

const handleFunctionError = (error: any, functionName: string) => {
  // You can integrate your own notification system here (e.g., toast.error)
  console.error(`Error calling ${functionName}:`, error);
  throw error;
};

/**
 * Handles the logic for starting a 7-day free trial.
 * Backend: handleTrialStart
 */
export const startTrial = async (): Promise<TrialStartResponse> => {
  try {
    const fn = httpsCallable<{}, TrialStartResponse>(functions, "handleTrialStart");
    const result = await fn({});
    return result.data;
  } catch (error) {
    throw handleFunctionError(error, "startTrial");
  }
};

/**
 * Creates a Stripe Checkout Session for the Monthly Pro plan.
 * Redirects the user to the Stripe hosted checkout page on success.
 * Backend: createCheckoutSession
 */
export const getMonthlyPro = async (): Promise<void> => {
  try {
    const fn = httpsCallable<{}, CheckoutSessionResponse>(functions, "createCheckoutSession");
    const res = await fn({});
    
    const { url } = res.data;

    if (url) {
      window.location.href = url;
    } else {
      throw new Error("No checkout URL returned from server.");
    }
  } catch (error) {
    handleFunctionError(error, "getMonthlyPro");
  }
};
export const getCustumerPortalLink = async (): Promise<void> => {
  try {
    const fn = httpsCallable<{}, CustomerPortalLink>(functions, "getCustomerPortalLink");
    const res = await fn({});
    
    const { url } = res.data;

    if (url) {
      window.location.href = url;
    } else {
      throw new Error("No checkout URL returned from server.");
    }
  } catch (error) {
    handleFunctionError(error, "getMonthlyPro");
  }
};