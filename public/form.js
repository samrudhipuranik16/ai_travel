async function handleForm(event) {
  event.preventDefault();

  // Get form values
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const start = document.getElementById("start-date").value;
  const days = document.getElementById("duration").value;
  const people = document.getElementById("people").value;
  const type = document.getElementById("vacation-type").value;

  const prompt = `
Generate exactly 3 hotel recommendations, 3 restaurant recommendations, and 3 places to visit for this trip.

Trip Details:
- From: ${from}
- To: ${to}
- Start Date: ${start}
- Duration: ${days} days
- Number of People: ${people}
- Activity Type: ${type}

Please provide real, specific recommendations with:
1. The actual name of the hotel/restaurant/place
2. A brief description (1-2 sentences)
3. Why it's suitable for this trip

Format the response clearly with sections:

HOTELS:
1. [Hotel Name] - [Description]
2. [Hotel Name] - [Description]
3. [Hotel Name] - [Description]

RESTAURANTS:
1. [Restaurant Name] - [Description]
2. [Restaurant Name] - [Description]
3. [Restaurant Name] - [Description]

PLACES TO VISIT:
1. [Place Name] - [Description]
2. [Place Name] - [Description]
3. [Place Name] - [Description]
  `;

  // Show loading state (optional but recommended)
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Generating...";
  submitBtn.disabled = true;

  let aiText = "";
  let apiSuccess = false;

  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (res.ok) {
      const data = await res.json();
      aiText = data?.reply || "";
      if (aiText) {
        apiSuccess = true;
      }
    } else {
      const errorData = await res.json();
      console.error("API error:", errorData);
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }

  // Fallback to mock response if API failed
  if (!aiText) {
    aiText = `
**Hotels in ${to}:**
• ${to} Grand Hotel - Luxury accommodations with stunning views
• Cozy Stay ${to} - Comfortable mid-range option in the city center
• Luxury Suites ${to} - Premium service with excellent amenities

**Restaurants in ${to}:**
• The ${to} Bistro - Fine dining with local specialties
• Food Paradise - Popular spot for international cuisine
• Gourmet Hub - Trendy restaurant with fusion menu

**Places to Visit in ${to}:**
• ${to} Museum - Rich cultural and historical exhibits
• Central Park of ${to} - Beautiful green space for relaxation
• ${to} Historical Center - Iconic landmarks and architecture
    `.trim();
  }

  // Store results with metadata
  const resultData = {
    aiText: aiText,
    apiSuccess: apiSuccess,
    tripDetails: {
      from,
      to,
      start,
      days,
      people,
      type
    },
    timestamp: new Date().toISOString()
  };

  sessionStorage.setItem("ai_result", JSON.stringify(resultData));

  // Redirect to results page
  window.location.href = "results.html";
}