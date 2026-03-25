import axios from 'axios';

export async function sendWhatsAppMessage(phoneNumberId: string, to: string, body: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  
  if (!token) {
    console.error('Missing WHATSAPP_ACCESS_TOKEN');
    return null;
  }

  const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;

  try {
    const response = await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: body },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    return null;
  }
}
