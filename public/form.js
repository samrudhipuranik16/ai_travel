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

  // Show loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Generating...";
  submitBtn.disabled = true;

  console.log("🚀 Starting API call to /api/gemini");
  console.log("📝 Prompt:", prompt);

  let aiText = "";
  let apiSuccess = false;
  let errorMessage = "";

  try {
    console.log("📡 Fetching /api/gemini...");
    
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    console.log("📊 Response status:", res.status);
    console.log("📊 Response ok:", res.ok);

    if (res.ok) {
      const data = await res.json();
      console.log("✅ API Response data:", data);
      
      aiText = data?.reply || "";
      
      if (aiText) {
        apiSuccess = true;
        console.log("✅ Got AI text, length:", aiText.length);
      } else {
        errorMessage = "API returned empty response";
        console.error("❌ Empty response from API");
      }
    } else {
      const errorData = await res.json();
      errorMessage = errorData.error || `API request failed with status ${res.status}`;
      console.error("❌ API error:", errorData);
    }
  } catch (err) {
    errorMessage = err.message || "Network error";
    console.error("❌ Fetch failed:", err);
  }

  // If API failed, show detailed error
  if (!aiText) {
    const errorDetails = `
❌ Unable to generate AI suggestions

Error: ${errorMessage}

Troubleshooting checklist:
✓ Check browser console (F12) for detailed logs
✓ Verify you're deployed on Vercel (not localhost)
✓ Check Vercel environment variable GEMINI_API_KEY is set
✓ Verify Gemini API key is valid
✓ Check /api/gemini endpoint exists

Debug Info:
- API Success: ${apiSuccess}
- Error Message: ${errorMessage}
    `;
    
    alert(errorDetails);
    console.error("🔴 Full error details:", errorDetails);
    
    // Re-enable the button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    return; // Don't redirect
  }

  // Success! Store and redirect
  console.log("✅ Success! Storing results and redirecting...");
  
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
  console.log("💾 Stored in sessionStorage:", resultData);

  // Redirect to results page
  window.location.href = "results.html";
}