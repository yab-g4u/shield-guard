const { ShieldGuard } = require("@shieldguard/sdk");

// `demo: true` — no HTTP calls; returns realistic mocked JSON (offline / hackathon safe).
// Alternatively use `fallbackToMock: true` to try the real API first, then mock on network failure.
const shield = new ShieldGuard({
  demo: true,
});

async function test() {
  try {
    const result = await shield.evaluateTransaction({
      phoneNumber: "+251911223344",
      amount: 500,
      deviceId: "device_123",
    });

    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(err);
  }
}

test();
