// form.js

async function handleForm(event) {
  event.preventDefault();

  // Get form values
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const start = document.getElementById("start-date").value;
  const days = document.getElementById("duration").value;
  const people = document.getElementById("people").value;
  const type = document.getElementById("vacation-type").value;

  // Construct prompt for Gemini AI
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

  try {
    // Call Gemini API directly
    const res = await fetch(
      "https://generativeai.googleapis.com/v1beta2/models/gemini-pro:generateText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer AIzaSyAZvy214LqCc6Ci7jzdJcMhz45vsEPtFjY" // 
        },
        body: JSON.stringify({
          prompt: prompt,
          // Optional: add temperature or other parameters if needed
        })
      }
    );

    const data = await res.json();

    // Extract AI text (adjust according to Gemini response structure)
    const aiText = data?.candidates?.[0]?.content || "No response received.";

    // Store AI result and redirect to results page
    localStorage.setItem("ai_result", aiText);
    window.location.href = "results.html";

  } catch (error) {
    alert("Something went wrong: " + error);
    console.error(error);
  }
}
