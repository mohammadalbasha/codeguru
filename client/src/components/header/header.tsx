import React, { useContext, useState } from "react";
import { Button, Modal } from "flowbite-react";
import AuthContext from "../../store/auth-context";
import { TermsOfUsage } from "../terms-of-usage/terms-of-usage";
import { SideDrawer } from "./sideDrawer/sideDrawer";
import { FiAlignJustify, FiMinimize2 } from "react-icons/fi";
import { Notifications } from "../notifications/notifications";

export function Header() {
  const authContext = useContext(AuthContext);
  const [openTermsModal, setOpenTermsModal] = useState<boolean>(false);
  const [openNotificationsModal, setOpenNotificationsModal] =
    useState<boolean>(false);
  const [notificationAnimation, setNotificationAnimation] =
    useState<string>("");

  const [displaySideDrawer, setDisplaySideDrawer] = useState(false);
  const toggleSideDrawer = (event: any) => {
    setDisplaySideDrawer((prev) => !prev);
  };

  return (
    <>
      <section className="flex fixed  top-0 z-50 w-screen items-center justify-between bg-slate-600  px-4">
        <button
          className="hidden cursor-pointer text-slate-50 max-md:block text-center w-12"
          onClick={toggleSideDrawer}
        >
          {displaySideDrawer ? (
            <FiMinimize2 size={30} />
          ) : (
            <FiAlignJustify size={50} />
          )}
        </button>

        <div className=" ">
          <img
            className="w-30 h-20 m-2 ml-8"
            src="https://cdn-icons-png.flaticon.com/128/12606/12606434.png"
          />
        </div>

        {!authContext.isLoggedIn && (
          <Button className="mr-4" onClick={() => setOpenTermsModal(true)}>
            Our Terms
          </Button>
        )}
        {authContext.isLoggedIn && (
          <Button
            className={`mr-4 ${notificationAnimation}`}
            onClick={() => setOpenNotificationsModal(true)}
          >
            Notifications
          </Button>
        )}
        {authContext.isLoggedIn && (
          <div
            onClick={authContext.logout}
            className="bg-black hover:bg-yellow-300 text-white text-m text-center m-3 px-6 py-2 border-gray-800 border-spacing-2 border-2 hover:cursor-pointer"
          >
            <a>Logout</a>
          </div>
        )}

        {!authContext.isLoggedIn && (
          <TermsOfUsage
            openModal={openTermsModal}
            setOpenModal={setOpenTermsModal}
          />
        )}

        {authContext.isLoggedIn && (
          <Notifications
            openModal={openNotificationsModal}
            setOpenModal={setOpenNotificationsModal}
            setAnimation={setNotificationAnimation}
          />
        )}
      </section>
      {authContext.isLoggedIn && (
        <SideDrawer displaySideDrawer={displaySideDrawer} />
      )}
    </>
  );
}
