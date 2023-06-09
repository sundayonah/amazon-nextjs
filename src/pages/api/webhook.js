import { buffer } from "micro"
import * as admin from "firebase-admin"
import { request } from "http"

// Secure a connection to FIREBASE from the backend
const serviceAccount = require("../../../permissions.json")

// Establish connection to Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_SIGNING_SECRET

const fulfillOrder = async (session) => {

   // Initialize the Firebase app if not already initialized
   // if (!admin.apps.length) {
   //    admin.initializeApp({
   //       credential: admin.credential.cert(serviceAccount),
   //    })
   // }
   // Create a new order in the DB
   
   const app = !admin.apps.length 
   ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)})
    : admin.app();

   return app
      .firestore()
      .collection("users")
      .doc(session.metadata.email)
      .collection("orders")
      .doc(session.id)
      .set({
         amount: session.amount_total / 100,
         amount_shipping: session.total_details.amount_shipping / 100,
         images: JSON.parse(session.metadata.images),
         timestamp: admin.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
      })
};

export default async (req, res) => {
   if (req.method === "POST") {
      const requestBuffer = await buffer(req)
      const payload = requestBuffer.toString()
      const sig = req.headers["stripe-signature"]

      let event

      // Verify that the event posted came from Stripe
      try {
         event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
      } catch (error) {
         return res.status(404).send(`Webhook error: ${error.message}`)
      }
      // Handle the checkout.session.completed event
      if (event.type === "checkout.session.completed") {
         const session = event.data.object

         // Fulfill the order...
         return fulfillOrder(session)
            .then(() => res.status(200))
            .catch((error) =>
               res.status(400).send(`Webhook Error: ${error.message}`)
            )
      }
   }
}
export const config = {
   api: {
      bodyParser: false,
      externalResolver: true,
   },
}
