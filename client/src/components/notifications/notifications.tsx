import { Modal, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { initSSE } from "../../services/sse/sse";

export const Notifications = ({
  openModal,
  setOpenModal,
  setAnimation,
}: any) => {
  const [notifications, setNotifications] = useState<
    { amount: number; description: string }[]
  >([]);

  useEffect(() => {
    const SSE = initSSE();
    SSE.onmessage = (e) => {
      setNotifications(JSON.parse(e.data));
      setAnimation("animate-ping");
      const interval = setInterval(() => {
        setAnimation("");
        clearInterval(interval);
      }, 3000);
    };
  }, []);

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Today's expenses</Modal.Header>
      <Modal.Body>
        {notifications.map((notification) => {
          return (
            <div className="flex justify-between p-2  text-slate-700  border-b-2">
              <h1>{notification.amount}</h1>
              <h1>{notification.description}</h1>
            </div>
          );
        })}
      </Modal.Body>

      <Modal.Footer>
        <Button color="gray" onClick={() => setOpenModal(false)}>
          Decline
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
