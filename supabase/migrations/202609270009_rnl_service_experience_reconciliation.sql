-- Reconcile the existing R&L provider tenant when its legacy provisioning predated
-- the durable service-config row. This does not create a business, menu, identity,
-- credential, order, or provider record. Rollback may delete this one config row.

insert into public.business_service_configs(business_id,foundation,gates)
select business.id,'quick',jsonb_build_object(
  'version',2,
  'preset','quick',
  'serviceModes',jsonb_build_array('quick'),
  'experiences',jsonb_build_object('quick',jsonb_build_object(
    'preset','quick',
    'gates',jsonb_build_array('consumption','fulfillment','quick_payment','locator'),
    'settings',jsonb_build_object(
      'serviceMode','quick',
      'consumptionModes',jsonb_build_array('dine_in','takeaway'),
      'fulfillmentModes',jsonb_build_array('pickup'),
      'paymentModes',jsonb_build_array('counter'),
      'locatorMode','none',
      'paymentTiming','counter'
    )
  ))
)
from public.businesses business
where business.id='20000000-0000-4000-8000-000000000001'::uuid
  and business.public_slug='rnl'
on conflict(business_id) do update set
  foundation=excluded.foundation,
  gates=excluded.gates,
  updated_at=now();

