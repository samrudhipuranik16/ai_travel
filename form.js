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

  try {
    // Call your backend serverless API
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    // Save AI result to localStorage
    const aiText = data?.reply || "No response received.";
    localStorage.setItem("ai_result", aiText);

    // Redirect to results.html
    window.location.href = "results.html";

  } catch (error) {
    alert("Something went wrong: " + error);
    console.error(error);
  }
}
