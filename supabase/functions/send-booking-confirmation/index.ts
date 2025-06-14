
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  guestName: string;
  guestEmail: string;
  roomName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  bookingId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      guestName,
      guestEmail,
      roomName,
      roomNumber,
      checkInDate,
      checkOutDate,
      totalPrice,
      bookingId
    }: BookingConfirmationRequest = await req.json();

    console.log("Sending booking confirmation email to:", guestEmail);

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Booking Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D4AF37, #B8860B); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #666; }
            .detail-value { color: #333; }
            .total-price { font-size: 1.2em; font-weight: bold; color: #D4AF37; }
            .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 0.9em; }
            .logo { font-size: 1.8em; font-weight: bold; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">LAPOSH HOTEL</div>
            <h1>Booking Confirmation</h1>
            <p>Your reservation has been confirmed!</p>
          </div>
          
          <div class="content">
            <h2>Dear ${guestName},</h2>
            <p>We're delighted to confirm your reservation at Laposh Hotel. Your booking has been successfully confirmed and we look forward to welcoming you!</p>
            
            <div class="booking-details">
              <h3>Booking Details</h3>
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">${bookingId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Room:</span>
                <span class="detail-value">${roomName} (${roomNumber})</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-in:</span>
                <span class="detail-value">${formatDate(checkInDate)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-out:</span>
                <span class="detail-value">${formatDate(checkOutDate)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value total-price">₦${totalPrice.toLocaleString()}</span>
              </div>
            </div>
            
            <h3>Important Information:</h3>
            <ul>
              <li>Check-in time: 2:00 PM</li>
              <li>Check-out time: 12:00 PM</li>
              <li>Payment will be collected upon arrival at the hotel</li>
              <li>Please bring a valid ID for check-in</li>
              <li>Cancellation policy: 24 hours before check-in</li>
            </ul>
            
            <p>If you have any questions or need to make changes to your reservation, please contact us immediately.</p>
            
            <p>Thank you for choosing Laposh Hotel. We can't wait to provide you with an exceptional experience!</p>
            
            <p>Best regards,<br>
            <strong>The Laposh Hotel Team</strong></p>
          </div>
          
          <div class="footer">
            <p>Laposh Hotel | Premium Hospitality Experience</p>
            <p>This is an automated confirmation email. Please do not reply to this email.</p>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Laposh Hotel <onboarding@resend.dev>",
      to: [guestEmail],
      subject: `Booking Confirmation - ${roomName} | Laposh Hotel`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
