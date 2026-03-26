import { createClient } from '../supabase/server';
import { sendWhatsAppMessage } from './send';

export async function processIncomingMessage(phoneNumberId: string, fromNumber: string, messageBody: string) {
  try {
    const supabase = await createClient();
    
    // 1. Find the user associated with this WhatsApp Phone Number ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('whatsapp_phone_number_id', phoneNumberId)
      .single();

    if (profileError || !profile) {
      console.error('No user profile found for this phone number ID:', phoneNumberId);
      return;
    }

    const userId = profile.id;
    let reply = "Our representative will get back to you shortly.";
    let ruleMatched = false;

    const autoReplyOn = profile.auto_reply_enabled !== false;

    if (autoReplyOn) {
      // 2. Fetch FAQ rules for this user
      const { data: faqs, error: faqsError } = await supabase
        .from('faqs')
        .select('*')
        .eq('user_id', userId);

      if (!faqsError && faqs) {
        for (const faq of faqs) {
          const keywords = faq.keywords || [];
          if (keywords.some((k: string) => messageBody.toLowerCase().includes(k.toLowerCase()))) {
            reply = faq.answer;
            ruleMatched = true;
            break;
          }
        }
      }

      // 3. Send the reply via WhatsApp API
      await sendWhatsAppMessage(phoneNumberId, fromNumber, reply, profile.whatsapp_access_token);
    } else {
      reply = ''; // No automated reply sent since the bot is paused
    }

    // 4. Save the lead/interaction to Supabase
    const { error: leadError } = await supabase
      .from('leads')
      .insert({
        user_id: userId,
        customer_number: fromNumber,
        message: messageBody,
        reply: reply,
        rule_matched: ruleMatched,
        tags: ruleMatched ? ['hot'] : ['cold'],
        followed_up: false,
        created_at: new Date().toISOString()
      });

    if (leadError) {
      console.error('Error saving lead to Supabase:', leadError);
    } else {
      console.log(`[Supabase] Lead saved for user ${userId}: ${fromNumber}`);
    }

  } catch (error) {
    console.error('WhatsApp Engine caught critical error:', error);
  }
}

