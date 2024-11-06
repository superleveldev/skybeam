import { chargeEvents } from './charge';
import { checkoutSessionEvents } from './checkout-session';
import { customerEvents } from './customer';
import { customerSubscriptionEvents } from './customer-subscription';
import { invoiceEvents } from './invoice';
import { paymentIntentEvents } from './payment-intent';
import { refundEvents } from './refund';

export const stripeHandlers = [
  ...chargeEvents,
  ...checkoutSessionEvents,
  ...customerEvents,
  ...customerSubscriptionEvents,
  ...invoiceEvents,
  ...paymentIntentEvents,
  ...refundEvents,
];

// other events that can be targeted
/*case 'account.updated': {
        break;
      }
      case 'account.external_account.created': {
        break;
      }
      case 'account.external_account.deleted': {
        break;
      }
      case 'account.external_account.updated': {
        break;
      }
      case 'balance.available': {
        break;
      }
      case 'billing_portal.configuration.created': {
        break;
      }
      case 'billing_portal.configuration.updated': {
        break;
      }
      case 'billing_portal.session.created': {
        break;
      }
      case 'capability.updated': {
        break;
      }
      case 'cash_balance.funds_available': {
        break;
      }
      case 'charge.captured': {
        break;
      }
      case 'charge.expired': {
        break;
      }
      case 'charge.failed': {
        break;
      }
      case 'charge.pending': {
        break;
      }
      case 'charge.refunded': {
        break;
      }
      case 'charge.succeeded': {
        break;
      }
      case 'charge.updated': {
        break;
      }
      case 'charge.dispute.closed': {
        break;
      }
      case 'charge.dispute.created': {
        break;
      }
      case 'charge.dispute.funds_reinstated': {
        break;
      }
      case 'charge.dispute.funds_withdrawn': {
        break;
      }
      case 'charge.dispute.updated': {
        break;
      }
      case 'charge.refund.updated': {
        break;
      }
      case 'checkout.session.async_payment_failed': {
        break;
      }
      case 'checkout.session.async_payment_succeeded': {
        break;
      }
      case 'checkout.session.completed': {
        break;
      }
      case 'checkout.session.expired': {
        break;
      }
      case 'climate.order.canceled': {
        break;
      }
      case 'climate.order.created': {
        break;
      }
      case 'climate.order.delayed': {
        break;
      }
      case 'climate.order.delivered': {
        break;
      }
      case 'climate.order.product_substituted': {
        break;
      }
      case 'climate.product.created': {
        break;
      }
      case 'climate.product.pricing_updated': {
        break;
      }
      case 'coupon.created': {
        break;
      }
      case 'coupon.deleted': {
        break;
      }
      case 'coupon.updated': {
        break;
      }
      case 'credit_note.created': {
        break;
      }
      case 'credit_note.updated': {
        break;
      }
      case 'credit_note.voided': {
        break;
      }
      case 'customer.created': {
        break;
      }
      case 'customer.deleted': {
        break;
      }
      case 'customer.updated': {
        break;
      }
      case 'customer.discount.created': {
        break;
      }
      case 'customer.discount.deleted': {
        break;
      }
      case 'customer.discount.updated': {
        break;
      }
      case 'customer.source.created': {
        break;
      }
      case 'customer.source.deleted': {
        break;
      }
      case 'customer.source.expiring': {
        break;
      }
      case 'customer.source.updated': {
        break;
      }
      case 'customer.subscription.created': {
        break;
      }
      case 'customer.subscription.deleted': {
        break;
      }
      case 'customer.subscription.updated': {
        break;
      }
      case 'customer.subscription.paused': {
        break;
      }
      case 'customer.subscription.pending_update_applied': {
        break;
      }
      case 'customer.subscription.pending_update_expired': {
        break;
      }
      case 'customer.subscription.resumed': {
        break;
      }
      case 'customer.subscription.trial_will_end': {
        break;
      }
      case 'customer.tax_id.created': {
        break;
      }
      case 'customer.tax_id.deleted': {
        break;
      }
      case 'customer.tax_id.updated': {
        break;
      }
      case 'customer_cash_balance_transaction.created': {
        break;
      }
      case 'entitlements.active_entitlement_summary.updated': {
        break;
      }
      case 'file.created': {
        break;
      }
      case 'financial_connections.account.created': {
        break;
      }
      case 'financial_connections.account.deactivated': {
        break;
      }
      case 'financial_connections.account.disconnected': {
        break;
      }
      case 'financial_connections.account.reactivated': {
        break;
      }
      case 'financial_connections.account.refreshed_balance': {
        break;
      }
      case 'financial_connections.account.refreshed_ownership': {
        break;
      }
      case 'financial_connections.account.refreshed_transactions': {
        break;
      }
      case 'identity.verification_session.canceled': {
        break;
      }
      case 'identity.verification_session.created': {
        break;
      }
      case 'identity.verification_session.processing': {
        break;
      }
      case 'identity.verification_session.requires_input': {
        break;
      }
      case 'identity.verification_session.verified': {
        break;
      }
      case 'invoice.created': {
        break;
      }
      case 'invoice.deleted': {
        break;
      }
      case 'invoice.updated': {
        break;
      }
      case 'invoice.finalization_failed': {
        break;
      }
      case 'invoice.finalized': {
        break;
      }
      case 'invoice.marked_uncollectible': {
        break;
      }
      // case 'invoice.overdue': {
      //   const invoiceOverdue = event.data.payload.object;
      //   // Then define and call a function to handle the event invoice.overdue
      //   break;
      // }
      case 'invoice.paid': {
        break;
      }
      case 'invoice.payment_action_required': {
        break;
      }
      case 'invoice.payment_failed': {
        break;
      }
      case 'invoice.payment_succeeded': {
        break;
      }
      case 'invoice.sent': {
        break;
      }
      case 'invoice.upcoming': {
        break;
      }
      case 'invoice.voided': {
        break;
      }
      // case 'invoice.will_be_due': {
      //   const invoiceWillBeDue = event.data.payload.object;
      //   Then define and call a function to handle the event invoice.will_be_due
        // break;
      // }
      case 'invoiceitem.created': {
        break;
      }
      case 'invoiceitem.deleted': {
        break;
      }
      case 'issuing_authorization.created': {
        break;
      }
      case 'issuing_authorization.updated': {
        break;
      }
      case 'issuing_card.created': {
        break;
      }
      case 'issuing_card.updated': {
        break;
      }
      case 'issuing_cardholder.created': {
        break;
      }
      case 'issuing_cardholder.updated': {
        break;
      }
      case 'issuing_dispute.closed': {
        break;
      }
      case 'issuing_dispute.created': {
        break;
      }
      case 'issuing_dispute.funds_reinstated': {
        break;
      }
      case 'issuing_dispute.submitted': {
        break;
      }
      case 'issuing_dispute.updated': {
        break;
      }
      case 'issuing_token.created': {
        break;
      }
      case 'issuing_token.updated': {
        break;
      }
      case 'issuing_transaction.created': {
        break;
      }
      case 'issuing_transaction.updated': {
        break;
      }
      case 'mandate.updated': {
        break;
      }
      case 'payment_intent.amount_capturable_updated': {
        break;
      }
      case 'payment_intent.created': {
        break;
      }
      case 'payment_intent.canceled': {
        break;
      }
      case 'payment_intent.partially_funded': {
        break;
      }
      case 'payment_intent.payment_failed': {
        break;
      }
      case 'payment_intent.processing': {
        break;
      }
      case 'payment_intent.requires_action': {
        break;
      }
      case 'payment_intent.succeeded': {
        break;
      }
      case 'payment_link.created': {
        break;
      }
      case 'payment_link.updated': {
        break;
      }
      case 'payment_method.attached': {
        break;
      }
      case 'payment_method.automatically_updated': {
        break;
      }
      case 'payment_method.detached': {
        break;
      }
      case 'payment_method.updated': {
        break;
      }
      case 'payout.canceled': {
        break;
      }
      case 'payout.created': {
        break;
      }
      case 'payout.failed': {
        break;
      }
      case 'payout.paid': {
        break;
      }
      case 'payout.reconciliation_completed': {
        break;
      }
      case 'payout.updated': {
        break;
      }
      case 'person.created': {
        break;
      }
      case 'person.deleted': {
        break;
      }
      case 'person.updated': {
        break;
      }
      case 'plan.created': {
        break;
      }
      case 'plan.deleted': {
        break;
      }
      case 'plan.updated': {
        break;
      }
      case 'price.created': {
        break;
      }
      case 'price.deleted': {
        break;
      }
      case 'price.updated': {
        break;
      }
      case 'product.created': {
        break;
      }
      case 'product.deleted': {
        break;
      }
      case 'product.updated': {
        break;
      }
      case 'promotion_code.created': {
        break;
      }
      case 'promotion_code.updated': {
        break;
      }
      case 'quote.accepted': {
        break;
      }
      case 'quote.canceled': {
        break;
      }
      case 'quote.created': {
        break;
      }
      case 'quote.finalized': {
        break;
      }
      // case 'quote.will_expire': {
      //   const quoteWillExpire = event.data.payload.object;
      //   // Then define and call a function to handle the event quote.will_expire
      //   break;
      // }
      case 'radar.early_fraud_warning.created': {
        break;
      }
      case 'radar.early_fraud_warning.updated': {
        break;
      }
      case 'refund.created': {
        break;
      }
      case 'refund.updated': {
        break;
      }
      case 'reporting.report_run.failed': {
        break;
      }
      case 'reporting.report_run.succeeded': {
        break;
      }
      case 'review.closed': {
        break;
      }
      case 'review.opened': {
        break;
      }
      case 'setup_intent.canceled': {
        break;
      }
      case 'setup_intent.created': {
        break;
      }
      case 'setup_intent.requires_action': {
        break;
      }
      case 'setup_intent.setup_failed': {
        break;
      }
      case 'setup_intent.succeeded': {
        break;
      }
      case 'sigma.scheduled_query_run.created': {
        break;
      }
      case 'source.canceled': {
        break;
      }
      case 'source.chargeable': {
        break;
      }
      case 'source.failed': {
        break;
      }
      case 'source.mandate_notification': {
        break;
      }
      case 'source.refund_attributes_required': {
        break;
      }
      case 'source.transaction.created': {
        break;
      }
      case 'source.transaction.updated': {
        break;
      }
      case 'subscription_schedule.aborted': {
        break;
      }
      case 'subscription_schedule.canceled': {
        break;
      }
      case 'subscription_schedule.completed': {
        break;
      }
      case 'subscription_schedule.created': {
        break;
      }
      case 'subscription_schedule.expiring': {
        break;
      }
      case 'subscription_schedule.released': {
        break;
      }
      case 'subscription_schedule.updated': {
        break;
      }
      case 'tax.settings.updated': {
        break;
      }
      case 'tax_rate.created': {
        break;
      }
      case 'tax_rate.updated': {
        break;
      }
      case 'terminal.reader.action_failed': {
        break;
      }
      case 'terminal.reader.action_succeeded': {
        break;
      }
      case 'test_helpers.test_clock.advancing': {
        break;
      }
      case 'test_helpers.test_clock.created': {
        break;
      }
      case 'test_helpers.test_clock.deleted': {
        break;
      }
      case 'test_helpers.test_clock.internal_failure': {
        break;
      }
      case 'test_helpers.test_clock.ready': {
        break;
      }
      case 'topup.canceled': {
        break;
      }
      case 'topup.created': {
        break;
      }
      case 'topup.failed': {
        break;
      }
      case 'topup.reversed': {
        break;
      }
      case 'topup.succeeded': {
        break;
      }
      case 'transfer.created': {
        break;
      }
      case 'transfer.reversed': {
        break;
      }
      case 'transfer.updated': {
        break;
      }*/
