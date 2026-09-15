# Scalev webhook for `/c11-problem`

The pricing buttons keep using Full Bright's existing Scalev checkout pages. Each
button adds `utm_source=c11-problem` and a package-specific `utm_content`. The
webhook stores only orders carrying the c11 marker; the public LP fetches only
aggregate counts and an anonymous recent-order notice from
`/c11-problem/scalev-proof`. The page polls every 10 seconds. The popup uses the
city only when Scalev sends one in `destination_address.city`; it does not invent
a registration goal such as scholarship or recruitment.

To activate this on a deployed HTTPS site:

1. Run the Laravel migrations so `scalev_orders` and `scalev_webhook_events` exist.
2. Set `SCALEV_WEBHOOK_SIGNING_SECRET` in the server environment to the Scalev
   webhook signing secret. This is separate from an API key.
3. In Scalev **Settings > Developers > Webhooks**, register
   `https://<your-domain>/webhooks/scalev`, select `order.created`,
   `payment.received`, `payment.failed`, and `order.payment_status_changed`,
   then activate it. Scalev sends a signed `business.test_event` on first save;
   the endpoint responds with 204 when the signing secret matches.
4. Submit one test order using a button on `/c11-problem` and inspect the signed
   `order.created` event. Confirm its `data.utm_source` or
   `data.metadata.event_source_url` carries `c11-problem`. If the hosted
   checkout does not retain that parameter, source attribution needs a
   supported Scalev setting before public counts can appear.
5. Check the proof endpoint after order creation and after a test payment. It
   returns `submitted`, `paid`, and a recent anonymous submission without buyer
   name, phone, or email. A new order should trigger the LP popup.

Scalev's webhook delivery is at least once. Events are identified by
`unique_id`; processing and order updates occur in a database transaction so a
failed delivery can be retried. A payment received before `order.created` is
reconciled after the attributed order arrives.

References: [Enabling Webhooks](https://dev.scalev.com/docs/enabling-webhooks),
[Webhook Events](https://dev.scalev.com/docs/webhook-events),
[Verifying a Webhook Request](https://dev.scalev.com/docs/verifying-a-webhook-request).
