async function handleForm(event) {
  event.preventDefault();

  // Get form values
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const start = document.getElementById("start-date").value;
  const days = document.getElementById("duration").value;
  const people = document.getElementById("people").value;
  const type = document.getElementById("vacation-type").value;

  const submitBtn = event.submitter;
  const originalText = submitBtn.textContent;
  
  // Disable button and show loading state
  submitBtn.textContent = "Planning Trip...";
  submitBtn.disabled = true;

  let aiText = null;
  let apiSuccess = false;
  let errorMessage = "Unknown error";
  
  // Prepare payload - keys match the new index.js (from, to, start, days, people, type)
  const payload = {
    from,
    to,
    start,
    days,
    people,
    type,
  };

  try {
    // --- FIX: Correcting the endpoint URL from /api/gemini to /api/generate ---
    // Assuming your index.js file is placed in an 'api' directory in your Vercel project
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    
    if (res.ok) {
      if (data.response) {
        aiText = data.response;
        apiSuccess = true;
      } else {
        errorMessage = "API returned success status but no 'response' field.";
        console.error("❌ API returned unexpected data:", data);
      }
    } else {
      // Handle API errors (e.g., 500 status from the serverless function)
      errorMessage = data.error || `API request failed with status ${res.status}`;
      console.error("❌ API error:", data);
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
✓ Check Vercel environment variable GEMINI_API_KEY is set (CRITICAL)
✓ Verify the deployed path is correct (e.g., /api/generate)
✓ Check Vercel logs for detailed backend errors
✓ The "gemini pro not found" error usually means the API key is invalid or missing.

Debug Info:
- API Success: ${apiSuccess}
- Error Message: ${errorMessage}
    `;
    
    // DO NOT use alert(), use console for non-critical alerts in this environment
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
      start, // 'start' is the correct key
      days,  // 'days' is the correct key
      people,
      type,  // 'type' is the correct key
    }
  };

  // Use sessionStorage to pass data to results.html
  sessionStorage.setItem('aiTripResults', JSON.stringify(resultData));
  window.location.href = 'results.html';
}