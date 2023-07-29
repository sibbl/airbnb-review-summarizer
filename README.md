# Airbnb Review Summarizer

This tool fetches the user reviews from Airbnb listings and summarizes it using a LLM.

## How to use

1. Install Node.js
1. Run `npm ci` once
1. Copy `.env.sample` to `.env` and insert your [Anthropic API key](https://console.anthropic.com/)
1. Run `node index.js 12345678` or `node index.js "https://www.airbnb.de/rooms/12345678"`

## Sample

```console
> node index.js 1217318

Here is a summary of the pros and cons of Martin's airbnb based on the reviews:

Pros:

- Location is well suited for exploring Williamsburg and Manhattan. Close to subway and many restaurants, cafes, and bars within walking distance. 
- Martin is friendly, responsive, and provides helpful recommendations for the area. He is flexible with check in/out times.
- The apartment is clean overall, stylish, and has everything you need for a comfortable stay. The room is spacious and has AC, a comfortable bed, closet space, etc. 
- The rooftop view is nice.

Cons:

- The bathroom and common areas are not always as clean as the private room. Some guests mentioned hair, dust, and old towels.     
- Guests staying in the other room can sometimes make noise late at night. However, Martin provides earplugs.
- The stairs up to the 4th floor apartment are narrow, steep, and difficult for guests with heavy luggage.
- Some guests felt the cleaning fee was high for the level of cleanliness.
- Some reviewers mentioned occasional odor issues in the apartment.

Overall, most guests seem to enjoy Martin's airbnb for its value, location and convenience. The main issues appear to be around cleanliness and noise from other guests. But Martin is generally praised as friendly, helpful and responsive.
```

## Limitations

Right now, only Anthropic's Claude LLM is supported as most larger Airbnb listings have so many reviews which are only possible with LLMs with more than 50K token support.

To support GPT's 4K or 16K token length, a splitting algorithm would be necessary. One could make multiple GPT requests to generate multiple pro/con lists and then do a final summarization step. However, this is not implemented yet.
