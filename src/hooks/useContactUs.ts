import useMutationApi from "./useMutationApi";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  [key: string]: unknown;
}

interface ContactResponse {
  message: string;
}

// errorOff: the form shows its own message for 429 rate-limit errors.
function useContactUs() {
  return useMutationApi<ContactResponse, ContactPayload>({
    method: "POST",
    endpoint: "v1/contact",
    errorOff: true,
  });
}

export default useContactUs;
