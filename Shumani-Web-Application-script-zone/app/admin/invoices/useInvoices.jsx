import { useInvoices as useInvoicesContext } from "@/components/invoice-provider"

export function useInvoices() {
  return useInvoicesContext()
}
