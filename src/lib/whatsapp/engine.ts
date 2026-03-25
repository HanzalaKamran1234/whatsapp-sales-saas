import { getDb } from '../firebase/server';
import { sendWhatsAppMessage } from './send';
import { store } from '../store';

export async function processIncomingMessage(phoneNumberId: string, fromNumber: string, messageBody: string) {
  try {
    const db = getDb();
    let reply = "Our representative will get back to you shortly.";
    let ruleMatched = false;

    if (db) {
      // === PRODUCTION MODE (Firebase) ===
      const usersSnapshot = await db.collection('users').where('whatsapp_phone_number_id', '==', phoneNumberId).get();
      if (usersSnapshot.empty) { console.log('No user found for this phone number ID.'); return; }

      const userId = usersSnapshot.docs[0].id;
      const faqsSnapshot = await db.collection('faqs').where('user_id', '==', userId).get();

      for (const doc of faqsSnapshot.docs) {
        const faqData = doc.data();
        const keywords = faqData.keywords || [];
        if (keywords.some((k: string) => messageBody.toLowerCase().includes(k.toLowerCase()))) {
          reply = faqData.answer;
          ruleMatched = true;
          break;
        }
      }

      await sendWhatsAppMessage(phoneNumberId, fromNumber, reply);
      await db.collection('leads').add({
        user_id: userId, customer_number: fromNumber, message: messageBody,
        reply, rule_matched: ruleMatched, tags: ruleMatched ? ['hot'] : ['cold'],
        followed_up: false, created_at: new Date().toISOString()
      });

    } else {
      // === DEMO MODE (In-memory store) ===
      const faqs = store.faqs;
      for (const faq of faqs) {
        if (faq.keywords.some(k => messageBody.toLowerCase().includes(k.toLowerCase()))) {
          reply = faq.answer;
          ruleMatched = true;
          break;
        }
      }
      // Save to in-memory store
      store.leads.unshift({
        lead_id: Date.now().toString(), user_id: 'demo',
        customer_name: 'New Customer', customer_number: fromNumber,
        message: messageBody, reply, tags: [ruleMatched ? 'hot' : 'cold'],
        rule_matched: ruleMatched, followed_up: false, created_at: new Date().toISOString()
      });
      console.log(`[DEMO] Auto-reply: "${reply}" → ${fromNumber}`);
    }

  } catch (error) {
    console.error('Error processing message:', error);
  }
}
