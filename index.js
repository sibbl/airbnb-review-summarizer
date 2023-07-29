require("dotenv").config();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL;

async function fetchAllReviews(listingId) {
  const pageSize = 50;
  let page = 0;
  let reviewsCount;
  const reviews = [];
  do {
    const offset = page * pageSize;
    const response = await fetch(
      `https://www.airbnb.com/api/v2/homes_pdp_reviews?key=d306zoyjsyarp7ifhu67rjxn52tv0t20&locale=en&listing_id=${listingId}&limit=${pageSize}&offset=${offset}`
    );
    const json = await response.json();
    reviews.push(...json.reviews);
    reviewsCount = json.metadata.reviews_count;
    page++;
  } while (page * pageSize < reviewsCount);
  return reviews;
}

async function summarize(reviews) {
  const reviewsString = reviews.map((review) => review.comments).join("\n");
  const prompt = `Human: ${reviewsString}\n\nSummarize the pros and cons of this airbnb's reviews mentioned above!\n\nAssistant:`;

  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": ANTHROPIC_API_KEY
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      prompt,
      max_tokens_to_sample: 1024
    })
  };
  const response = await fetch(
    "https://api.anthropic.com/v1/complete",
    options
  );
  if (response.status !== 200) {
    const responseText = await response.text();
    throw new Error(
      `Anthropic API returned HTTP status ${response.status}: ${responseText}`
    );
  }
  const json = await response.json();
  return json.completion;
}

async function fetchAndSummarize(listingId) {
  const reviews = await fetchAllReviews(listingId);
  const summary = await summarize(reviews);
  console.log(summary);
}

if (!process.argv || process.argv.length < 3) {
  throw new Error(
    "Please pass the Airbnb listing ID or URL as the argument, i.e. 'node index.js 12345678'"
  );
}

function getAirbnbId(urlOrId) {
  const regex = /rooms\/([^d]+\/)?(\d+)/;
  const match = urlOrId.match(regex);
  if (match && match[2]) {
    return match[2];
  } else {
    return urlOrId;
  }
}

// Get Airbnb ID from command-line arguments
const airbnb_id = getAirbnbId(process.argv[2]);
fetchAndSummarize(airbnb_id);
