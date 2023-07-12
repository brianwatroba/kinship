import { sendSms } from "../../../app/api/sms/_utils";

const TEST_NUMBERS = {
  VALID: "+15005550006",
  INVALID: "+15005550001",
};
describe("api/sms/_utils", () => {
  describe("sendSms()", () => {
    it("Success: sends successfully (text)", async () => {
      const to = TEST_NUMBERS.VALID;
      const from = process.env.TWILIO_PHONE_NUMBER as string;
      const params = { to, from, body: "test" };
      const res = await sendSms(params);
      expect(res).toBe(true);
    });
    it("Success: sends successfully (media)", async () => {
      const to = TEST_NUMBERS.VALID;
      const from = process.env.TWILIO_PHONE_NUMBER as string;
      const mediaUrls = ["https://api.api-ninjas.com/v1/randomimage?category=nature"];
      const params = { to, from, mediaUrls };
      const res = await sendSms(params);
      expect(res).toBe(true);
    });
    it("Fails: invalid to number", async () => {
      const to = TEST_NUMBERS.INVALID;
      const from = process.env.TWILIO_PHONE_NUMBER as string;
      const params = { to, from, body: "test" };
      await expect(sendSms(params)).rejects.toThrow();
    });
  });
});
