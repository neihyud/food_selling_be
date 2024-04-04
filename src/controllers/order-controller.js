const configs = require('../config')
const Order = require('../models/Order')
const stripe = require('stripe')(configs.stripePrivateKey)

exports.createOrder = async (req, res) => {

}

const storeItems = new Map([
  [1, { priceInCents: 10000, name: 'Learn React Today' }],
  [2, { priceInCents: 20000, name: 'Learn CSS Today' }]
])

exports.createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user_id
    const { address, items: listCartItems, payment } = req.body
    // to do
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(1)
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: storeItem.name
            },
            unit_amount: storeItem.priceInCents
          },
          quantity: item.quantity
        }
      }),
      success_url: `${process.env.CLIENT_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/order/cancel`
    })

    const order = new Order({
      user_id: userId,
      address_id: address.id
    })

    // const orderItems

    console.log('session: ', session)
    res.status(200).send({ url: session.url })
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
}
