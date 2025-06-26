const HOST = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
export const SERVER_API_URL = `${HOST}/kaleidofin-dashboard/`;
export const OAUTH_API_URL = `${HOST}/kaleidofin-auth/`;
export const KALEIDO_SERVER_API_URL = `${HOST}/kaleidofin-server/`;
export const KREDILINE_SERVER_URL = `${HOST}/krediline-server/`;
export const S3_PATTERN =
  "(https|http)?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.s3.[a-zA-Z0-9()]([-a-zA-Z0-9()@:%_\\+.~#?&//=]*).amazonaws.com\\/*";
export const BUILD_TIMESTAMP = process.env["BUILD_TIMESTAMP"];
export const BANK_VALIDATION_RETRIES = 2;
export const BANK_VALIDATION_RETRY_TIMEOUT = 3000;
export const VERSION = process.env["VERSION"];
export const DEBUG_INFO_ENABLED: boolean = !!process.env["DEBUG_INFO_ENABLED"];

export const getBankingServerHost = (
  hostname: string = window.location.hostname || ""
) => {
  hostname = hostname.toLowerCase();
  let environment;
  switch (true) {
    case hostname.includes(".preprod1"):
      environment = "https://bankingserver.preprod1.kalfin.in/banking/";
      break;
    case hostname.includes(".sandbox"):
      environment = "https://bankingserver.sandbox.kalfin.in/banking/";
      break;
    case hostname.includes("admin") || hostname.includes(".com"):
      environment = "https://bankingserver.kaleidofin.com/banking/";
      break;
    case hostname.includes(".uat1") || hostname.startsWith("ft"): {
      let ftRegex = /ft(\d+)/;
      let ftNumber: string = "";
      const match = ftRegex.exec(hostname);
      ftNumber = match?.[1] || ftNumber;
      environment = `https://ft${ftNumber}bankingserver.uat1.kalfin.in/banking/`;
      break;
    }
    default:
      environment = "";
      break;
  }
  return environment;
};
