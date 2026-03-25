import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp/send';

// Vercel Cron Job endpoint
export async function GET(request: Request) {
  try {
    // Vercel Cron Authentication ensures only Vercel can trigger this
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Goal: Find leads captured over 24 hours ago that haven't been followed up
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    const leadsSnapshot = await db.collection('leads')
      .where('created_at', '<=', yesterday.toISOString())
      .where('followed_up', '==', false)
      .get();

    let followedUpCount = 0;

    for (const doc of leadsSnapshot.docs) {
      const lead = doc.data();
      const { user_id, customer_number, customer_name } = lead;

      // Fetch the User to get their Meta Phone Number ID
      const userSnap = await db.collection('users').doc(user_id).get();
      if (!userSnap.exists) continue;
      const userData = userSnap.data();

      if (userData?.whatsapp_phone_number_id) {
        // Standard non-AI check-in message
        const message = `Hi ${customer_name || 'there'}! Are you still interested in our products? Let us know if you have any questions or need help placing an order!`;
        
        await sendWhatsAppMessage(userData.whatsapp_phone_number_id, customer_number, message);
        
        // Mark as followed up in Firebase
        await doc.ref.update({ 
            followed_up: true, 
            follow_up_date: new Date().toISOString() 
        });
        followedUpCount++;
      }
    }

    return NextResponse.json({ success: true, processed: followedUpCount });
  } catch (error) {
    console.error('Cron Follow-up Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
