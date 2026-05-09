const { ShieldGuard } = require("@shieldguard/sdk")

const shield = new ShieldGuard({
  apiKey: "test_key"
})

async function test() {
  try {
    const result = await shield.evaluateTransaction({
      phoneNumber: "+251911223344",
      amount: 500,
      deviceId: "device_123"
    })

    console.log(result)
  } catch (err) {
    console.error(err)
  }
}

test()