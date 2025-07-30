import React from "react";
import PaymentHistory from "./paymentHistory";
import UploadPOP from "../client/uploadPOP";
import DownloadStatement from "../client/downloadStatement";

function ClientPortal() {
  return (
    <div>
      <h2>Client Portal</h2>
      <PaymentHistory />
      {/* <UploadPOP /> */}
      <DownloadStatement />
    </div>
  );
}

export default ClientPortal;
