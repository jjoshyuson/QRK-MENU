-- Resolve the provider tenant through its authoritative public destination rather
-- than assuming an internal business UUID. This safely upserts only the live R&L
-- destination's service configuration.

insert into public.business_service_configs(business_id,foundation,gates)
select destination.business_id,'quick',jsonb_build_object(
  'version',2,
  'preset','quick',
  'serviceModes',jsonb_build_array('quick'),
  'experiences',jsonb_build_object('quick',jsonb_build_object(
    'preset','quick',
    'gates',jsonb_build_array('consumption','fulfillment','quick_payment'),
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
from public.public_destinations destination
where destination.slug='rnl' and destination.active
on conflict(business_id) do update set
  foundation=excluded.foundation,
  gates=excluded.gates,
  updated_at=now();

