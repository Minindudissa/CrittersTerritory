require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const makePaymentStripe = async (req, res, next) => {
  try {
    const {
      productsList,
      subtotal,
      discount,
      promocode_voucherCode,
      isStandardShippingChosen,
      shipping,
      userId,
    } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: productsList.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
          },
          unit_amount:
            Math.round(item.discountedPrice * 100) ||
            Math.round(item.price * 100), // in cents
        },
        quantity: item.quantity || 1,
      })),
      ...(shipping !== 0 && {
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: Number(shipping) * 100,
                currency: "usd",
              },
              display_name: isStandardShippingChosen
                ? "Standard Shipping (Exc. Handling Time)"
                : "Expedited Shipping (Exc. Handling Time)",
              delivery_estimate: isStandardShippingChosen
                ? {
                    minimum: { unit: "business_day", value: 25 },
                    maximum: { unit: "business_day", value: 35 },
                  }
                : {
                    minimum: { unit: "business_day", value: 1 },
                    maximum: { unit: "business_day", value: 4 },
                  },
            },
          },
        ],
      }),

      ...(discount !== 0
        ? {
            discounts: [
              {
                coupon: promocode_voucherCode,
              },
            ],
          }
        : {}),
      success_url: `https://www.crittersterritory.com/payment-success?fromPayment=true`,
      cancel_url: `https://www.crittersterritory.com/payment-declined?fromCancel=true`,
      metadata: {
        userId,
        discount,
      },
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("Stripe session creation failed:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  makePaymentStripe,
};
