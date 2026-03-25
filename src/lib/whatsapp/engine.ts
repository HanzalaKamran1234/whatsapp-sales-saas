import { db } from '../firebase/server';
import { sendWhatsAppMessage } from './send';

export async function processIncomingMessage(phoneNumberId: string, fromNumber: string, messageBody: string) {
  try {
    // 1. Find the User by their WhatsApp Phone Number ID
    const usersSnapshot = await db.collection('users').where('whatsapp_phone_number_id', '==', phoneNumberId).get();
    
    if (usersSnapshot.empty) {
      console.log('No user found for this phone number ID.');
      return;
    }

    const userId = usersSnapshot.docs[0].id;

    // 2. Fetch User's FAQs
    const faqsSnapshot = await db.collection('faqs').where('user_id', '==', userId).get();
    
    let reply = "Our representative will get back to you shortly.";
    let ruleMatched = false;

    // 3. Rule Engine - Match Keywords
    for (const doc of faqsSnapshot.docs) {
      const faqData = doc.data();
      const keywords = faqData.keywords || [];
      
      const containsKeyword = keywords.some((keyword: string) => 
        messageBody.toLowerCase().includes(keyword.toLowerCase())
      );

      if (containsKeyword) {
        reply = faqData.answer;
        ruleMatched = true;
        break;
      }
    }

    // 4. Send the reply via WhatsApp API
    await sendWhatsAppMessage(phoneNumberId, fromNumber, reply);

    // 5. Store the lead and chat history
    await db.collection('leads').add({
      user_id: userId,
      customer_number: fromNumber,
      message: messageBody,
      reply: reply,
      rule_matched: ruleMatched,
      tags: ruleMatched ? ['hot'] : ['cold'],
      created_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing message:', error);
  }
}
