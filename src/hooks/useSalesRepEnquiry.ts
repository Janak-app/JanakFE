import useMutationApi from "./useMutationApi";

interface SalesRepEnquiryPayload {
  productId: string;
  [key: string]: unknown;
}

interface SalesRepEnquiryResponse {
  salesRepName: string | null;
  salesRepPhone: string | null;
}

// Fire-and-forget click tracking — errors are silenced so they never block the call.
function useSalesRepEnquiry() {
  return useMutationApi<SalesRepEnquiryResponse, SalesRepEnquiryPayload>({
    method: "POST",
    endpoint: "v1/sales-rep-enquiries",
    errorOff: true,
  });
}

export default useSalesRepEnquiry;
