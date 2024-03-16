import express, { NextFunction, Request, Response } from "express";
import { UserPayload, currentUser } from "../../auth/middlewares/current-user";
import { requireAuth } from "../../auth/middlewares/require-auth";
import cron from "node-cron";
import ExpensesService from "../../expenses/services/expenses.service";
import { ExpenseDocument } from "../../expenses/models/expense.model";

const router = express.Router();

import { EventEmitter } from "events";

const eventEmitter = new EventEmitter();

router.get(
  "/api/sse",

  currentUser,
  requireAuth,
  async (req, res, next) => {
    const { currentUser } = req;

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "cache-control": "no-chache",
      Connection: "keep-alive",
    });

    const emitSSE = (data: ExpenseDocument[]) => {
      res.write("event: message\n");
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      // @ts-ignore
      res.flush();
    };
    eventEmitter.on(currentUser.id, emitSSE);

    // Close the connection when the client disconnects
    req.on("close", () => {
      res.end("OK");
      eventEmitter.off(currentUser.id, emitSSE);
    });
  }
);

// Schedule cron job
cron.schedule("* * * * *", async () => {
  const expenses = await ExpensesService.findTodayExpenses();
  const map = {};
  expenses.map((expense) => {
    if (map[expense.creator.toString() as string])
      map[expense.creator.toString() as string].push(expense);
    else map[expense.creator.toString() as string] = [expense];
  });
  for (const key in map) {
    eventEmitter.emit(key, map[key]);
  }
});

export { router as NotificationsRouter };
