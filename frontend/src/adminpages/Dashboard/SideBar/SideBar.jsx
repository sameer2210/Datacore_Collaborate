import "./SideBar.css";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import premium from "../../../assets/premium.svg";
import ge3sLogo from "../../../assets/ge3s-logo.png";
import useOrganizationContext from "../../../context/OrgContext";
import defaultLogo from "../../../assets/defaultOrg.svg";
import constant from "../../../constant";
import BookCall from "../../owner/BookCall";
import premiumimg from "../../../assets/images/premiumplan.png"
import basicimg from "../../../assets/images/basicplan.png"
import { activePlan } from "../../../api/subscription";

function SideBar() {
  // Retrieve organization data from context
  const { data: orgData } = useOrganizationContext();
  const [activePlanData, setActivePlanData] = useState(null);

  // Get the current location from the router
  const location = useLocation();

  // State to manage the visibility of the booking call modal
  const [bookCall, setBookCall] = useState(false);

  useEffect(() => {
    const fetchActivePlan = async () => {
      const { data, error } = await activePlan();
      if (data && !error) {
        setActivePlanData(data);
      }
    };
    fetchActivePlan();
  }, []);

  return (
    <div className="sidemenu">
      <div className="sidemanu_content">
        <div className="sidemenu_brand">
          <img
            src={
              orgData?.logo
                ? `${constant.IMG_URL}/${orgData?.logo}`
                : defaultLogo
            }
            alt="logo"
            height={80}
            width={80}
          />

          <div className="subscription_side">
            <h6>{orgData?.name ?? "Dummy Name"}</h6>
          </div>

        </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '5px 0 20px 0' }}>
          {
            activePlanData?.plan_name === 'Premium' ? <img src={premiumimg} alt="Premium Plan" style={{ width: '9rem' }} />
              :
              <img src={basicimg} alt="Basic Plan" style={{ width: '7rem' }} />
          }

        </div>

        <div>
          <NavLink
            to="monitor"
            className={(navLink) =>
              navLink.isActive || location.pathname === "/admin-dash" || location.pathname === "/admin-dash/"
                ? "sidebar_menu_item checked"
                : "sidebar_menu_item"
            }
          >
            <div
              id="Dashboard"
              style={{
                display: "flex",
                gap: "0.8rem",
                alignItems: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M8.33333 10.8333H3.33333C3.11232 10.8333 2.90036 10.9211 2.74408 11.0774C2.5878 11.2337 2.5 11.4457 2.5 11.6667V16.6667C2.5 16.8877 2.5878 17.0996 2.74408 17.2559C2.90036 17.4122 3.11232 17.5 3.33333 17.5H8.33333C8.55435 17.5 8.76631 17.4122 8.92259 17.2559C9.07887 17.0996 9.16667 16.8877 9.16667 16.6667V11.6667C9.16667 11.4457 9.07887 11.2337 8.92259 11.0774C8.76631 10.9211 8.55435 10.8333 8.33333 10.8333ZM7.5 15.8333H4.16667V12.5H7.5V15.8333ZM16.6667 2.5H11.6667C11.4457 2.5 11.2337 2.5878 11.0774 2.74408C10.9211 2.90036 10.8333 3.11232 10.8333 3.33333V8.33333C10.8333 8.55435 10.9211 8.76631 11.0774 8.92259C11.2337 9.07887 11.4457 9.16667 11.6667 9.16667H16.6667C16.8877 9.16667 17.0996 9.07887 17.2559 8.92259C17.4122 8.76631 17.5 8.55435 17.5 8.33333V3.33333C17.5 3.11232 17.4122 2.90036 17.2559 2.74408C17.0996 2.5878 16.8877 2.5 16.6667 2.5ZM15.8333 7.5H12.5V4.16667H15.8333V7.5ZM16.6667 13.3333H15V11.6667C15 11.4457 14.9122 11.2337 14.7559 11.0774C14.5996 10.9211 14.3877 10.8333 14.1667 10.8333C13.9457 10.8333 13.7337 10.9211 13.5774 11.0774C13.4211 11.2337 13.3333 11.4457 13.3333 11.6667V13.3333H11.6667C11.4457 13.3333 11.2337 13.4211 11.0774 13.5774C10.9211 13.7337 10.8333 13.9457 10.8333 14.1667C10.8333 14.3877 10.9211 14.5996 11.0774 14.7559C11.2337 14.9122 11.4457 15 11.6667 15H13.3333V16.6667C13.3333 16.8877 13.4211 17.0996 13.5774 17.2559C13.7337 17.4122 13.9457 17.5 14.1667 17.5C14.3877 17.5 14.5996 17.4122 14.7559 17.2559C14.9122 17.0996 15 16.8877 15 16.6667V15H16.6667C16.8877 15 17.0996 14.9122 17.2559 14.7559C17.4122 14.5996 17.5 14.3877 17.5 14.1667C17.5 13.9457 17.4122 13.7337 17.2559 13.5774C17.0996 13.4211 16.8877 13.3333 16.6667 13.3333ZM8.33333 2.5H3.33333C3.11232 2.5 2.90036 2.5878 2.74408 2.74408C2.5878 2.90036 2.5 3.11232 2.5 3.33333V8.33333C2.5 8.55435 2.5878 8.76631 2.74408 8.92259C2.90036 9.07887 3.11232 9.16667 3.33333 9.16667H8.33333C8.55435 9.16667 8.76631 9.07887 8.92259 8.92259C9.07887 8.76631 9.16667 8.55435 9.16667 8.33333V3.33333C9.16667 3.11232 9.07887 2.90036 8.92259 2.74408C8.76631 2.5878 8.55435 2.5 8.33333 2.5ZM7.5 7.5H4.16667V4.16667H7.5V7.5Z"
                  fill="#77BCBB"
                />
              </svg>

              <span className="menu--text">Dashboard</span>
            </div>
          </NavLink>

          <NavLink
            to="team-members"
            className={(navLink) =>
              navLink.isActive
                ? "sidebar_menu_item checked"
                : "sidebar_menu_item"
            }
          >
            <div
              style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.72662 10.2271C9.40085 10.2271 10.7569 8.87109 10.7569 7.1968C10.7569 5.52256 9.40085 4.1665 7.72662 4.1665C6.05238 4.1665 4.69632 5.52256 4.69632 7.1968C4.69632 8.87109 6.05238 10.2271 7.72662 10.2271ZM7.72662 5.68165C8.55993 5.68165 9.24177 6.36347 9.24177 7.1968C9.24177 8.03014 8.55993 8.71192 7.72662 8.71192C6.89329 8.71192 6.21147 8.03014 6.21147 7.1968C6.21147 6.36347 6.89329 5.68165 7.72662 5.68165ZM1.66602 14.7726C1.66602 12.7574 5.70389 11.7423 7.72662 11.7423C9.74935 11.7423 13.7873 12.7574 13.7873 14.7726V16.2878H1.66602V14.7726ZM3.18117 14.7726C3.34783 14.2271 5.68874 13.2574 7.72662 13.2574C9.7721 13.2574 12.1206 14.2347 12.2721 14.7726H3.18117ZM16.0599 10.9847V13.2574H14.5448V10.9847H12.2721V9.4695H14.5448V7.1968H16.0599V9.4695H18.3327V10.9847H16.0599Z"
                  fill="#96CDCC"
                />
              </svg>

              <span className="menu--text">Team Members</span>
            </div>
          </NavLink>

          <NavLink
            to="reports"
            className={(navLink) =>
              navLink.isActive
                ? "sidebar_menu_item checked"
                : "sidebar_menu_item"
            }
          >
            <div
              style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_3174_1184)">
                  <path
                    d="M13.125 17.5H4.375C4.20924 17.5 4.05027 17.4342 3.93306 17.3169C3.81585 17.1997 3.75 17.0408 3.75 16.875V5.625C3.75 5.45924 3.81585 5.30027 3.93306 5.18306C4.05027 5.06585 4.20924 5 4.375 5H10.625L13.75 8.125V16.875C13.75 17.0408 13.6842 17.1997 13.5669 17.3169C13.4497 17.4342 13.2908 17.5 13.125 17.5Z"
                    stroke="#96CDCC"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.25 5V3.125C6.25 2.95924 6.31585 2.80027 6.43306 2.68306C6.55027 2.56585 6.70924 2.5 6.875 2.5H13.125L16.25 5.625V14.375C16.25 14.5408 16.1842 14.6997 16.0669 14.8169C15.9497 14.9342 15.7908 15 15.625 15H13.75"
                    stroke="#96CDCC"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.875 11.875H10.625"
                    stroke="#96CDCC"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.875 14.375H10.625"
                    stroke="#96CDCC"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3174_1184">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <span className="menu--text">Reports</span>
            </div>
          </NavLink>

          <NavLink
            to="subscriptions"
            className={(navLink) =>
              navLink.isActive
                ? "sidebar_menu_item checked"
                : "sidebar_menu_item"
            }
          >
            <div
              style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M16.25 3.125H3.75C3.40482 3.125 3.125 3.40482 3.125 3.75V16.25C3.125 16.5952 3.40482 16.875 3.75 16.875H16.25C16.5952 16.875 16.875 16.5952 16.875 16.25V3.75C16.875 3.40482 16.5952 3.125 16.25 3.125Z"
                  stroke="#96CDCC"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M13.75 1.875V4.375"
                  stroke="#96CDCC"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.25 1.875V4.375"
                  stroke="#96CDCC"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.125 6.875H16.875"
                  stroke="#96CDCC"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10 10.9375C10.3452 10.9375 10.625 10.6577 10.625 10.3125C10.625 9.96732 10.3452 9.6875 10 9.6875C9.65482 9.6875 9.375 9.96732 9.375 10.3125C9.375 10.6577 9.65482 10.9375 10 10.9375Z"
                  fill="#96CDCC"
                />
                <path
                  d="M13.4375 10.9375C13.7827 10.9375 14.0625 10.6577 14.0625 10.3125C14.0625 9.96732 13.7827 9.6875 13.4375 9.6875C13.0923 9.6875 12.8125 9.96732 12.8125 10.3125C12.8125 10.6577 13.0923 10.9375 13.4375 10.9375Z"
                  fill="#96CDCC"
                />
                <path
                  d="M6.5625 14.0625C6.90768 14.0625 7.1875 13.7827 7.1875 13.4375C7.1875 13.0923 6.90768 12.8125 6.5625 12.8125C6.21732 12.8125 5.9375 13.0923 5.9375 13.4375C5.9375 13.7827 6.21732 14.0625 6.5625 14.0625Z"
                  fill="#96CDCC"
                />
                <path
                  d="M10 14.0625C10.3452 14.0625 10.625 13.7827 10.625 13.4375C10.625 13.0923 10.3452 12.8125 10 12.8125C9.65482 12.8125 9.375 13.0923 9.375 13.4375C9.375 13.7827 9.65482 14.0625 10 14.0625Z"
                  fill="#96CDCC"
                />
                <path
                  d="M13.4375 14.0625C13.7827 14.0625 14.0625 13.7827 14.0625 13.4375C14.0625 13.0923 13.7827 12.8125 13.4375 12.8125C13.0923 12.8125 12.8125 13.0923 12.8125 13.4375C12.8125 13.7827 13.0923 14.0625 13.4375 14.0625Z"
                  fill="#96CDCC"
                />
              </svg>
              <span className="menu--text">Subscription</span>
            </div>
          </NavLink>
        </div>
      </div>
      <div className="sidebar_powered_by">
        <div className="logo_wrapper">
          <img src={ge3sLogo} className="sidebar_logo" alt="Logo" />
        </div>
        <span className="text">Need help with generating your Score?</span>
        <div className="brand_wrapper">
          <span>Book a call with a Senior Consultant.</span>
        </div>
        <button
          className="sidebar_connect_btn"
          onClick={() => setBookCall(true)}
        >
          Connect With an Expert
        </button>

        <BookCall open={bookCall} onClose={() => setBookCall(false)} />
      </div>
    </div>
  );
}

export default SideBar;
