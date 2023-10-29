export const portfolioQuote = `I am a developer by profession,
a physics student by compassion.` as const
export const myName = '- Subham Bhattacharjee' as const
export const bigNavButtonTransition = "calc(max(min(40vw, 100vw - 15em), 3.5rem) / 2 + 3ch)" as const
export const aboutMe = `I am a ${new Date().getFullYear() - 2005} year old, currently studying at Bangabashi college, for physics major. I had learnt to code to support my studies in physics, but quickly liked it, so it became a hobby. I learnt a few languages like C++ and python, before learning HTML, CSS and javascript. I learnt front end from free code camp, and got my first internship during highschool, at deep thought. There I worked as a backend developer and learnt to make data flow, and data schemas for crud apps. Later I also worked on frontend and on mobile app with react native. I even helped a few interns getting started with react native. Later I started working with ipx as a react native developer. I can work with javascript in general, have experience with rest api, and api design. Can manage a linux server and am currently using arch linux. I can also help with hosting a website. My favourite subject is physics however, which I'm currently learning in college, so I can't do full time work, and can't do work at any given time. I'm also teaching myself data science, and hope to learn AI later on. Thanks for visiting my portfolio hope you like what you see!` as const

export type AllTexts = typeof portfolioQuote | typeof myName | "none" | typeof bigNavButtonTransition | typeof aboutMe
