
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
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation - Laposh Signature Suites</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              background-color: #f8f9fa;
            }
            .email-container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: white; 
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center; 
            }
            .logo-section {
              margin-bottom: 20px;
            }
            .logo {
              max-width: 200px;
              height: auto;
              margin: 0 auto;
              display: block;
            }
            .header h1 { 
              font-size: 28px; 
              font-weight: 300; 
              margin: 20px 0 10px 0;
              letter-spacing: 1px;
            }
            .header p { 
              font-size: 16px; 
              opacity: 0.9;
              font-weight: 300;
            }
            .content { 
              padding: 40px 30px; 
            }
            .greeting {
              font-size: 18px;
              margin-bottom: 25px;
              color: #2c3e50;
            }
            .intro-text {
              font-size: 16px;
              margin-bottom: 30px;
              color: #555;
              line-height: 1.7;
            }
            .booking-details { 
              background: #f8f9fa; 
              border-radius: 12px; 
              padding: 30px; 
              margin: 30px 0; 
              border-left: 5px solid #D4AF37;
            }
            .booking-details h3 {
              color: #2c3e50;
              font-size: 20px;
              margin-bottom: 20px;
              font-weight: 600;
            }
            .detail-row { 
              display: flex; 
              justify-content: space-between; 
              align-items: center;
              padding: 12px 0; 
              border-bottom: 1px solid #e9ecef;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .detail-label { 
              font-weight: 600; 
              color: #6c757d;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .detail-value { 
              color: #2c3e50;
              font-weight: 500;
              font-size: 15px;
            }
            .total-price { 
              font-size: 20px; 
              font-weight: 700; 
              color: #D4AF37;
            }
            .info-section {
              margin: 30px 0;
            }
            .info-section h3 {
              color: #2c3e50;
              font-size: 18px;
              margin-bottom: 15px;
              font-weight: 600;
            }
            .info-list {
              background: #fff;
              border: 1px solid #e9ecef;
              border-radius: 8px;
              padding: 20px;
            }
            .info-list li {
              margin: 10px 0;
              padding-left: 20px;
              position: relative;
              color: #555;
            }
            .info-list li:before {
              content: "✓";
              position: absolute;
              left: 0;
              color: #D4AF37;
              font-weight: bold;
            }
            .contact-info {
              background: #2c3e50;
              color: white;
              padding: 25px;
              border-radius: 8px;
              margin: 30px 0;
              text-align: center;
            }
            .contact-info h4 {
              margin-bottom: 15px;
              font-size: 16px;
              font-weight: 600;
            }
            .contact-info p {
              margin: 5px 0;
              opacity: 0.9;
            }
            .address-section {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #D4AF37;
            }
            .address-section h4 {
              color: #2c3e50;
              margin-bottom: 10px;
              font-size: 16px;
            }
            .address-section p {
              color: #555;
              line-height: 1.6;
            }
            .closing {
              margin: 30px 0;
              font-size: 16px;
              color: #555;
              line-height: 1.7;
            }
            .signature {
              margin-top: 30px;
              font-size: 16px;
              color: #2c3e50;
            }
            .signature strong {
              color: #D4AF37;
            }
            .footer { 
              background: #f8f9fa;
              text-align: center; 
              padding: 30px; 
              color: #6c757d; 
              font-size: 13px;
              border-top: 1px solid #e9ecef;
            }
            .footer p {
              margin: 8px 0;
            }
            .footer .brand {
              font-weight: 600;
              color: #2c3e50;
              font-size: 14px;
            }
            @media (max-width: 600px) {
              .email-container { margin: 0; }
              .header, .content { padding: 20px; }
              .detail-row { flex-direction: column; align-items: flex-start; }
              .detail-label { margin-bottom: 5px; }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="logo-section">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7744159b-04e7-44ab-8c6a-6591e39c0bb6-9QqWcNGJ2XwpKg2bgJJqcPQHyY5kGg.png" alt="Laposh Signature Suites" class="logo">
              </div>
              <h1>Booking Confirmation</h1>
              <p>Your luxury accommodation awaits</p>
            </div>
            
            <div class="content">
              <div class="greeting">Dear ${guestName},</div>
              
              <div class="intro-text">
                We are delighted to confirm your reservation at Laposh Signature Suites. Your booking has been successfully processed, and we are excited to welcome you to our luxury establishment.
              </div>
              
              <div class="booking-details">
                <h3>Reservation Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Confirmation Number</span>
                  <span class="detail-value">${bookingId.substring(0, 8).toUpperCase()}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Accommodation</span>
                  <span class="detail-value">${roomName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Room Number</span>
                  <span class="detail-value">${roomNumber}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Check-in Date</span>
                  <span class="detail-value">${formatDate(checkInDate)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Check-out Date</span>
                  <span class="detail-value">${formatDate(checkOutDate)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Total Amount</span>
                  <span class="detail-value total-price">₦${totalPrice.toLocaleString()}</span>
                </div>
              </div>
              
              <div class="info-section">
                <h3>Important Information</h3>
                <div class="info-list">
                  <ul style="list-style: none; margin: 0; padding: 0;">
                    <li>Check-in time: 12:00 PM</li>
                    <li>Check-out time: 12:00 PM</li>
                    <li>Payment will be collected upon arrival at the hotel</li>
                    <li>Please bring a valid government-issued photo ID for check-in</li>
                    <li>Complimentary Wi-Fi throughout the property</li>
                    <li>24-hour concierge service available</li>
                    <li>Free cancellation up to 24 hours before check-in</li>
                  </ul>
                </div>
              </div>

              <div class="address-section">
                <h4>Hotel Location</h4>
                <p>5 Poultry Road by Labrix<br>Abraka, Delta State<br>Nigeria</p>
              </div>
              
              <div class="contact-info">
                <h4>Need Assistance?</h4>
                <p>Our reservations team is available 24/7 to assist you</p>
                <p><strong>Phone:</strong> +234 905 212 9939</p>
                <p><strong>Email:</strong> laposhsignaturesuites@gmail.com</p>
              </div>
              
              <div class="closing">
                Should you need to make any changes to your reservation or have special requests, please contact us immediately. We strive to accommodate all reasonable requests to ensure your stay is exceptional.
              </div>
              
              <div class="closing">
                Thank you for choosing Laposh Signature Suites. We look forward to providing you with an unforgettable luxury experience.
              </div>
              
              <div class="signature">
                Warm regards,<br>
                <strong>The Laposh Signature Suites Team</strong><br>
                <em>Where Luxury Meets Excellence</em>
              </div>
            </div>
            
            <div class="footer">
              <p class="brand">Laposh Signature Suites</p>
              <p>Premium Hospitality Experience</p>
              <p>This is an automated confirmation email. Please do not reply directly to this message.</p>
              <p>For immediate assistance, please contact our reservations team.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Laposh Signature Suites <laposhsignaturesuites@resend.dev>",
      to: [guestEmail],
      subject: `Booking Confirmed - ${roomName} | Laposh Signature Suites`,
      html: emailHtml,
    });

    console.log("Professional confirmation email sent successfully:", emailResponse);

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
