-- R&L Quick accepts both counter pickup and dine-in delivery to a numbered table.
-- Consumption validation continues to prevent takeaway + table combinations.
update public.business_service_configs config
set gates=jsonb_set(
      jsonb_set(config.gates,'{experiences,quick,settings,fulfillmentModes}','["pickup","table"]'::jsonb,true),
      '{experiences,quick,settings,locatorMode}','"table"'::jsonb,true
    ),
    updated_at=now()
from public.public_destinations destination
where destination.slug='rnl'
  and destination.active
  and destination.business_id=config.business_id
  and config.gates->'serviceModes' ? 'quick';
