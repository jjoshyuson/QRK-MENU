import assert from 'node:assert/strict';
import {entryPaymentAmounts,normalizeEntryPayment} from '../dist/data/qrk-entry-payment.js';

assert.deepEqual(normalizeEntryPayment(),{
  mode:'none',requiredMinor:0,paidMinor:0,expiresAt:null,expired:false,status:'pending',error:'',configurationError:false,satisfied:true
});

const pendingDeposit=normalizeEntryPayment({mode:'deposit',amountMinor:50000,paidMinor:20000,status:'pending'});
assert.equal(pendingDeposit.satisfied,false);
assert.equal(pendingDeposit.requiredMinor-pendingDeposit.paidMinor,30000);

const paidDeposit=normalizeEntryPayment({mode:'deposit',amountMinor:50000,appliedCreditMinor:50000,status:'paid'});
assert.equal(paidDeposit.satisfied,true);
assert.deepEqual(entryPaymentAmounts(paidDeposit,82000),{creditMinor:50000,remainingCreditMinor:0,dueMinor:32000,shortfallMinor:0});

const commitment=normalizeEntryPayment({mode:'minimum-spend',minimumMinor:100000,status:'satisfied'});
assert.equal(commitment.satisfied,true);
assert.deepEqual(entryPaymentAmounts(commitment,68000),{creditMinor:0,remainingCreditMinor:0,dueMinor:68000,shortfallMinor:32000});

const prepayment=normalizeEntryPayment({type:'full',requiredMinor:120000,paidMinor:120000,status:'complete'});
assert.equal(prepayment.mode,'full_prepayment');
assert.equal(prepayment.satisfied,true);
assert.deepEqual(entryPaymentAmounts(prepayment,95000),{creditMinor:95000,remainingCreditMinor:25000,dueMinor:0,shortfallMinor:0});

assert.equal(normalizeEntryPayment({mode:'deposit',requiredMinor:0}).configurationError,true);
assert.equal(normalizeEntryPayment({mode:'deposit',requiredMinor:50000,paidMinor:50000,status:'paid',expired:true}).satisfied,false);
assert.equal(normalizeEntryPayment({mode:'unknown',requiredMinor:50000}).configurationError,true);

console.log('Entry-payment normalization, satisfaction, credit, shortfall, incomplete, and expiry checks passed.');
