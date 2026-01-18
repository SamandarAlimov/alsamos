import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are the ALSAMOS AI Assistant - a helpful, knowledgeable, and professional virtual assistant for ALSAMOS Corporation.

ALSAMOS is a multinational innovation corporation founded by Samandar Alimov, operating across 100+ industries including:
- Information Technology
- Education (from kindergarten to university)
- Healthcare and Medicine
- Automotive and Electric Vehicles
- Aerospace and Satellites
- AI and Robotics
- Finance and Banking
- Real Estate and Construction
- Fashion and Retail
- Food and Restaurant Services
- Media and Entertainment
- And many more...

Key Information:
- Founder & CEO: Samandar Alimov
- Contact Email: alsamos.company@gmail.com
- Phone: +998 93 300 77 09
- Tagline: "ALSAMOS - Make It Real"
- Mission: Building the future of humanity through innovation

Products include:
- ALSAMOS Phone X - Premium smartphones
- ALSAMOS Laptop Pro - High-performance laptops
- ALSAMOS Watch Ultra - Smart wearables
- ALSAMOS EV - Electric vehicles
- ALSAMOS Robot - AI-powered robots
- ALSAMOS Tablet Pro - Professional tablets

Your role:
1. Help visitors learn about ALSAMOS products, services, and industries
2. Answer questions about investment opportunities
3. Assist with career inquiries
4. Provide contact information when requested
5. Guide users to relevant sections of the website
6. Be friendly, professional, and helpful

Always respond in a helpful and concise manner. If you don't know something specific, guide users to contact the team directly.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing chat request with', messages.length, 'messages');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Service temporarily unavailable. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to get AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Streaming response back to client');

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
