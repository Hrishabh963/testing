import { ACCOUNT_TEMPORARILY_LOCKED } from "../entities/kaleido-credit/loan/constant";

export const LENDER_CONFIGURATIONS = {
  KCPL: {
    logo: "assets/images/kaleidofin-new-logo.svg",
    useFooter: true,
    defaultLogoutRoute: "/",
    lenderCode: "KCPL",
  },
  ICICI: {
    logo: "assets/images/login/landing_kaleidofin_image.svg",
    useFooter: true,
    defaultLogoutRoute: "/",
    lenderCode: "ICICI",
  },
  AFL: {
    logo: "assets/images/login/landing_kaleidofin_image.svg",
    useFooter: true,
    defaultLogoutRoute: "/",
    lenderCode: "AFL",
  },
  DCB: {
    logo: "assets/images/dcb_logo.svg",
    logoClass: "dcb-logo",
    useFooter: false,
    defaultLogoutRoute: "/",
    lenderCode: "DCB",
    disableForgotPassword: true,
    accountLockedErrorText: ACCOUNT_TEMPORARILY_LOCKED.DCB,
    hideResetPassword:true
  },
  DCBMFI: {
    logo: "assets/images/dcb_logo.svg",
    logoClass: "dcb-logo",
    useFooter: false,
    defaultLogoutRoute: "/",
    lenderCode: "DCBMFI",
    disableForgotPassword: true,
    accountLockedErrorText: ACCOUNT_TEMPORARILY_LOCKED.DCB,
    hideResetPassword:true
  },
  MAXIMAL: {
    logo: "assets/images/kaleidofin-new-logo.svg",
    useFooter: true,
    defaultLogoutRoute: "/",
    lenderCode: "MAXIMAL",
    defaultLandingRoute: "/kcredit/kiscore",
  },
  TDB: {
    logo: "",
    navbarLogo: "assets/images/tdb-logo.svg",
    logoClass: "tdb-logo",
    useFooter: true,
    defaultLogoutRoute: "/",
    lenderCode: "TDB",
    defaultLandingRoute: "/business/overview",
  },
};
