import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const searchId = process.env.NEXT_PUBLIC_SEARCH_ENGINE_ID;
  const possibleApi = req.query.api;
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchId}&q=${req.query.q}`;
  try {
    const response = await axios.get(url);

    const correctData = response.data["items"][0];
    res.status(200).json({ data: correctData });
  } catch (error: any) {
    try {
      const url = `https://www.googleapis.com/customsearch/v1?key=${possibleApi}&cx=${searchId}&q=${req.query.q}`;
      const response = await axios.get(url);
      const correctData = response.data["items"][0];
      res.status(200).json({ data: correctData });
    } catch {
      res.status(500).json({ error: error.message });
    }
  }
}
