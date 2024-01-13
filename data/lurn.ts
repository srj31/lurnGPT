export interface Skill {
  name: string;
  image: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

export const skills: Skill[] = [
  {
    name: "Guitar",
    image: "https://images5.alphacoders.com/359/359452.jpg",
    description: "Do you want to learn how to play the guitar",
    level: "Advanced" as const,
  },
  {
    name: "Chinese",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Hanzi.svg/1920px-Hanzi.svg.png",
    description:
      "Seen calligraphy and tattoos of this, better than google translate",
    level: "Intermediate" as const,
  },
  {
    name: "Cardistry",
    image:
      "http://cdn.shopify.com/s/files/1/1788/4029/articles/Virtuoso_FW17_Playing_Cards_8_1024x1024.jpg?v=1559068543",
    description: "Hmm what do you mean they are normal cards",
    level: "Intermediate" as const,
  },
  {
    name: "Drums",
    image:
      "https://c1.wallpaperflare.com/preview/146/98/382/drum-drumstick-crossed-light.jpg",
    description: "Imagine if you could create the best of beats",
    level: "Beginner" as const,
  },
  {
    name: "Cooking",
    image:
      "https://media-cldnry.s-nbcnews.com/image/upload/newscms/2019_41/3044956/191009-cooking-vegetables-al-1422.jpg",
    description:
      "Worried about spending a lot on takeaways, worth trying cooking",
    level: "Beginner" as const,
  },
];

export interface History {
  title: string;
  snippet: string;
  img: string;
  date: string;
}
export const guitar_history: History[] = [
  {
    title:
      "Beginner Acoustic Lesson 1 - Your Very First Guitar Lesson (E Minor ...",
    snippet:
      "Jun 13, 2016 ... Latest Content - https://linktr.ee/martyschwartz Patreon - https://www.patreon.com/MartyMusic Website - http://www.",
    img: "https://i.ytimg.com/vi/6ny8htqHHuM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCgEAwOslO2PwJSfvtF7VAjCDA7vA",
    date: "2024-01-12",
  },
  {
    title:
      "Beginner Acoustic Lesson 1 - Your Very First Guitar Lesson (E Minor ...",
    snippet:
      "Jun 13, 2016 ... Latest Content - https://linktr.ee/martyschwartz Patreon - https://www.patreon.com/MartyMusic Website - http://www.",
    img: "https://i.ytimg.com/vi/6ny8htqHHuM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCgEAwOslO2PwJSfvtF7VAjCDA7vA",
    date: "2024-01-12",
  },
  {
    title:
      "Beginner Acoustic Lesson 1 - Your Very First Guitar Lesson (E Minor ...",
    snippet:
      "Jun 13, 2016 ... Latest Content - https://linktr.ee/martyschwartz Patreon - https://www.patreon.com/MartyMusic Website - http://www.",
    img: "https://i.ytimg.com/vi/6ny8htqHHuM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCgEAwOslO2PwJSfvtF7VAjCDA7vA",
    date: "2024-01-12",
  },
  {
    title:
      "Beginner Acoustic Lesson 1 - Your Very First Guitar Lesson (E Minor ...",
    snippet:
      "Jun 13, 2016 ... Latest Content - https://linktr.ee/martyschwartz Patreon - https://www.patreon.com/MartyMusic Website - http://www.",
    img: "https://i.ytimg.com/vi/6ny8htqHHuM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCgEAwOslO2PwJSfvtF7VAjCDA7vA",
    date: "2024-01-12",
  },
  {
    title:
      "Beginner Acoustic Lesson 1 - Your Very First Guitar Lesson (E Minor ...",
    snippet:
      "Jun 13, 2016 ... Latest Content - https://linktr.ee/martyschwartz Patreon - https://www.patreon.com/MartyMusic Website - http://www.",
    img: "https://i.ytimg.com/vi/6ny8htqHHuM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCgEAwOslO2PwJSfvtF7VAjCDA7vA",
    date: "2024-01-12",
  },
];
