/* import { AccidentService } from '../components/accident/accident.service'; */
import cron from "node-cron";

const accidentService = new AccidentService();

// Tâche quotidienne pour incrémenter les jours sans accident
cron.schedule("0 */2 * * *", async () => {
  console.log("Running task to increment days without accident every 2 hours");
  await accidentService.incrementDaysWithoutAccident();
});

// Tâche annuelle pour réinitialiser reset_on_new_year
cron.schedule("0 0 1 1 *", async () => {
  console.log("Running annual task to reset reset_on_new_year");
  await accidentService.resetOnNewYear();
});
