async function handleForm(event) {
  event.preventDefault(); // prevent default form submission

  // Get form values
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const start = document.getElementById("start-date").value;
  const days = document.getElementById("duration").value;
  const people = document.getElementById("people").value;
  const type = document.getElementById("vacation-type").value;

  const prompt = `
Generate 3 hotel suggestions, 3 restaurant suggestions, and 3 places to visit.
Trip Details:
From: ${from}
To: ${to}
Start Date: ${start}
Duration: ${days} days
People: ${people}
Activity Type: ${type}
Give answer in bullet points.
  `;

  let aiText = "";

  try {
    // Try real API if deployed on Vercel
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (res.ok) {
      const data = await res.json();
      aiText = data?.reply || "No response received.";
    } else {
      console.warn("API returned error, using mock response.");
    }

  } catch (err) {
    console.warn("Fetch failed, using mock response.", err);
  }

  // If API failed, use MOCK response (works locally)
  if (!aiText) {
    aiText = `
Hotels in ${to}:
- ${to} Grand Hotel
- Cozy Stay ${to}
- Luxury Suites ${to}

Restaurants in ${to}:
- The ${to} Bistro
- Food Paradise
- Gourmet Hub

Places to Visit in ${to}:
- ${to} Museum
- Central Park of ${to}
- ${to} Historical Center
    `;
  }

  const formattedText = aiText
  .replace(/\r\n/g, "\n")       // Normalize line breaks
  .replace(/\n{2,}/g, "\n\n")  // Ensure only one empty line between sections
  .trim();


  // Save result to localStorage
  localStorage.setItem("ai_result", aiText);

  // Redirect to results.html
  window.location.href = "results.html";
}
