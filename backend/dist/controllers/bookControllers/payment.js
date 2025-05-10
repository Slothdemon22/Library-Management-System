import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const payment = async (req, res) => {
    try {
        console.log("payment");
        console.log(req.body);
        const { amount } = req.body;
        if (!amount) {
            res.status(400).send({ error: 'Amount is required' });
            return;
        }
        // Create a Checkout Session with line items
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Library Premium Membership',
                            description: 'Access to premium library features',
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:3001/payment/success`,
            cancel_url: `http://localhost:3001/payment/cancel`,
        });
        // Send the Checkout Session ID to the frontend
        res.status(200).send({
            sessionId: session.id,
        });
    }
    catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send({
            error: error.message,
        });
    }
};
